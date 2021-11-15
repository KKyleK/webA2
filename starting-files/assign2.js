//henry V is bugged. Something wrong with the json since it breaks when parsed (the request is)
//FIX HIGHLIGHTING to only persons.    Meh its a feature


document.addEventListener("DOMContentLoaded", () => {

  const paintings = JSON.parse(content);

  display_header();
  display_by_name();
  display_welcome_message();

  const sort_bttn = document.querySelector("#playList p");
  sort_bttn.addEventListener("input", sort);  //Sort the plays on the left hand side
  
  

  const select_play = document.querySelector("section ul");  //Shows selected play
  
  select_play.addEventListener("click",e => {
    if(e.target.tagName == "LI"){
    const plays = document.querySelectorAll("section ul li");
    for (p of plays){
      if (p.classList.contains("selected")){
        p.classList.remove("selected");
      }
    }

    e.target.classList.add("selected");
  }});
  select_play.addEventListener("click", show_screen_1);
  




  function display_header(){
    const header = document.querySelector("header");
    const button = document.createElement("button");
    button.id = "credit";
    button.textContent = "Credits";
    header.appendChild(button); 
    button.addEventListener("mouseover", e=>{
      
      try{  //If its already there
        document.querySelector("#credit_box").remove();
      }
      finally{
      const box = document.querySelector("#playHere");
      const old = box.innerHTML;
      box.innerHTML = "";

      const credit_box = document.createElement("div");
      credit_box.id = "credit_box";
      const credit_name = document.createElement("p");
      credit_name.textContent = "Page by Kyle Koivuneva."
      const credit_course = document.createElement("p");
      credit_course.textContent = "COMP 3612."

      credit_box.appendChild(credit_name);
      credit_box.appendChild(credit_course);

      // box.appendChild(credit_name);
      // box.appendChild(credit_course);  
      box.appendChild(credit_box);
      
      setTimeout(()=>box.innerHTML = old,5000);
      }
    });
  }
  


  //Initial welcome message
  function display_welcome_message(){

    const left_column = document.querySelector("#playHere");
    const p = document.createElement("p");
    p.textContent = "Select a play to see details";
    left_column.appendChild(p);
  }


  //Start loading of the second page
  /* 1: Check if the play exists

If it does: Fetch Play
            Populate the first screen with filter options and such. 
            Then once the user clicks filter, show the portions wanted
            
If not:     Don't fetch the play.
            Show filter as empty?
            TODO
  */
  function show_play_screen_2(e) {

    if (e.target.tagName === "BUTTON") {

      e.stopPropagation();
      const play = paintings.find(p => p.id == e.target.getAttribute("data-id")); //Find the play in use



      

      get_data(play.id);    //Fill the screen all async. Initial fetch    
    }
  }


  /*
  This needs to populate entire both screens but its all async, so cannot do any waiting.
  
  1: Fill the middle part with filter options
  2: add an event listener inside this function that will fill the right side once 
     the filter is choosen
  
  NOTE: EVENT LISTENERS MUST BE CONTAINED. This is an ititial setup
  */
  async function get_data(id) {

    let play_local = localStorage.getItem(id);

    if(play_local == null){
    
    const resp = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=${id}`);
    var data = await resp.json();    //Has to be function scoped
    localStorage.setItem(id,JSON.stringify(data));

    

    }
    else{
      var data = JSON.parse(play_local);   
    }

    fill_screen();                
    show_play("ACT I","SCENE I");  //Act 1 scene 1 (Initial)
    document.querySelector("#btnHighlight").addEventListener("click", highlight);  //Does the filter



    //Filters based on selection. Name must be populated below.
    function highlight(e){

      //Rewrite play:
      
      const speaker = document.querySelector("#playerList").value;        //The player 
                  //the play (text)
      const text = document.querySelector("#txtHighlight").value;   //the stuff to highlight

      const act = document.querySelector("#actList");
      const scene = document.querySelector("#sceneList");

      show_play(act.value,scene.value); //Refresh the play
      document.querySelector("#playerList").value = speaker;

      const play = document.querySelector("#sceneHere");
      
      if(text != "" && text != " "){
        
        play.innerHTML = play.innerHTML.replaceAll(text,`<b>${text}</b>`);
      }

      if (speaker!= "ALL"){
      const speaches = document.querySelectorAll(".speech");

      for (s of speaches){
        if (s.firstChild.textContent != speaker){
          s.remove();
        }
      }
    }
  }



    //Programatically generates the play
    //An event handler will call this.
    //Act and scene will be in roman neumeral form.
    //Fills the filter option for people you can choose
    function show_play(act_num,scene_num) {

      const page = document.querySelector("#playHere");    //Fill the right hand side
      page.innerHTML = "";


      const act = data.acts.find(a=> a.name == `${act_num}`);         //the act
      const scene = act.scenes.find(s=>s.name == `${scene_num}`);   //The first scene


      const h2 = document.createElement("h2");                       
      h2.textContent = data.title;

      const article = document.createElement("article");
      article.id = "actHere";
      const h3 = document.createElement("h3");
      h3.textContent = act.name;

      article.appendChild(h3);


      const div = document.createElement("div");
      div.id = "sceneHere";
      
      const h4 = document.createElement("h4");
      h4.textContent = scene.name;

      const p = document.createElement("p");
      p.setAttribute("class", "title");
      p.textContent = scene.title;

      const p2 = document.createElement("p");
      p2.setAttribute("class", "direction");
      p2.textContent = scene.stageDirection;

      div.appendChild(h4);
      div.appendChild(p);
      div.appendChild(p2);



      let speakers = [];   //unique speakers

// append the rest to div.
      for(s of scene.speeches) {

        const div2 = document.createElement("div");
        div2.setAttribute("class", "speech");
        const span = document.createElement("span");
        span.textContent = s.speaker;

        div2.appendChild(span);
        
        if (!speakers.includes(s.speaker)) {  //no duplicates
          speakers.push(s.speaker);
        }
        for (l of s.lines){

          const line = document.createElement("p");
          line.textContent = l;
          div2.appendChild(line);
        }
        div.appendChild(div2);
      }

      article.appendChild(div);

      page.appendChild(h2);
      page.appendChild(article);

      const speaker_option = document.querySelector("#playerList");
      speaker_option.innerHTML = "";
      for (let s of speakers){
        const option = document.createElement("option");
        option.textContent = s;
        speaker_option.appendChild(option);
      }
      const all = document.createElement("option");
      all.textContent = "ALL";
      speaker_option.appendChild(all);
     

     
      
     }
    






    /* Optons:
  1. Act number
  2. Scene Number
  3. Highlight text option
  
  This is the middle of the screen.
    */
    function fill_screen() {


      const fieldset = document.createElement("fieldset");
      fieldset.setAttribute("id", "interface");            //this is the outer box (meh)
      
      const h2 = document.createElement("h2");
      h2.textContent = id;

      const select = document.createElement("select");
      select.id = "actList";                                //Act list

      const select2 = document.createElement("select");     //The scenes
      select2.id = "sceneList";
      select2.addEventListener("change", e=>change_scene(e.target.value));



      const fieldset2 = document.createElement("fieldset");

      const select3 = document.createElement("select");
      select3.id = "playerList";

      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.id = "txtHighlight";
      input.setAttribute("placeholder", "Enter a search term");

      const button = document.createElement("button");
      button.id = "btnHighlight";
      button.textContent = "Filter";
      //event listener for the button (filter)


      const button2 = document.createElement("button");
      button2.textContent = "Close";
      button2.id = "btnClose";
      button2.setAttribute("data-id", id);
      button2.addEventListener("click", show_screen_1);

      

      for (let a of data.acts) {  //The acts to choose from

        const act = document.createElement("option");
        act.textContent = a.name;
        select.appendChild(act);
      }


      select.addEventListener("change", e=>fill_scene(e.target.value));     //Avalible scenes
      select.setAttribute("selected","ACT I");          //Selects act 1 by default

      

      fieldset2.appendChild(select3);
      fieldset2.appendChild(input);
      fieldset2.appendChild(button);

      fieldset.appendChild(h2);
      fieldset.appendChild(select);
      fieldset.appendChild(select2);
      fieldset.appendChild(fieldset2);
      fieldset.appendChild(button2);



      const page = document.querySelector("aside");
      page.innerHTML = "";

      page.appendChild(fieldset);
      page.appendChild(button2);

      fill_scene("ACT I");  //Initial load  of the scenes.
    }


   function change_scene(scene_num){
    
    const act = document.querySelector("#actList");
    
    show_play(act.value,scene_num);
   }




    
    //When the act number is changed
    function fill_scene(act_name){
      const scene = document.querySelector("#sceneList");
      scene.innerHTML = "";

      const sceneList = data.acts.find(a=>a.name == act_name);

    for (let s of sceneList.scenes) {  //The acts to choose from

        const option = document.createElement("option");
        option.textContent = s.name;
        scene.appendChild(option);
      }

      

      show_play(act_name,"SCENE I");  //Initial load.
    }
  }






















  //Detects that the play has been clicked.
  function show_screen_1(e) {


    if (e.target.tagName == "LI" || e.target.tagName == "BUTTON") {   //If close was clicked.

      e.stopPropagation();

      const page = document.querySelector("aside");  //The screen to change
      const play = paintings.find(p => p.id == e.target.getAttribute("data-id")); //Get the play that was clicked


      const header = document.createElement("h1");
      const synopsis = document.createElement("h2");
      const body = document.createElement("p");
      const button = document.createElement("button")

      page.innerHTML = "";

      header.textContent = play.title;
      body.textContent = play.synopsis;
      synopsis.textContent = "Synopsis";

      button.textContent = "Show Play Text";
      button.setAttribute("data-id", play.id);

      if (play.filename == "") {

        //button.setAttribute("hidden","True");   //FIX
        button.style.display = "none";
        //Clear the button
      }
      else {

        button.addEventListener("click", show_play_screen_2);    //Show screen 2
      }

      page.appendChild(header);
      page.append(synopsis);
      page.appendChild(body);
      page.appendChild(button);

      show_screen_1_right(play);
    }






    function show_screen_1_right(play) {

      const page = document.querySelector("#playHere");
      page.innerHTML = "";

      const header = document.createElement("h2");
      const data = document.createElement("p");
      
      header.textContent = play.title;

      const wiki_link = document.createElement("a");
      const gutenberg_link = document.createElement("a");
      const shakespeare_link = document.createElement("a");

      const list = document.createElement("ul");              //The list of links
      list.id = "playInfo";                         

      const placeholder = document.createElement("li");
      const placeholder2 = document.createElement("li");
      const placeholder3 = document.createElement("li");


      wiki_link.setAttribute("href",play.wiki);
      wiki_link.textContent = "Wiki link";
      gutenberg_link.setAttribute("href",play.gutenberg);
      gutenberg_link.textContent = "Gutenberg link";
      shakespeare_link.setAttribute("href",play.shakespeareOrg);
      shakespeare_link.textContent = "Shakespeare org link";
      //Change later maybe
      //data.innerHTML = `<a href = ${play.likelyDate}      ,<br>${play.genre},<br>${play.wiki}, ${play.gutenberg}, ${play.shakespeareOrg}<br><br>${play.desc}`;

      placeholder.appendChild(wiki_link);
      placeholder2.appendChild(gutenberg_link);
      placeholder3.appendChild(shakespeare_link);

      list.appendChild(placeholder);
      list.appendChild(placeholder2);
      list.appendChild(placeholder3);
      
      const plays_info = document.createElement("p");
      plays_info.textContent = play.desc;

      const genre = document.createElement("p");
      genre.textContent = play.genre + ",";

      data.append(genre);
      data.appendChild(list);
      data.appendChild(plays_info);

      page.appendChild(header);
      page.appendChild(data);
    }
  }



  function sort(e) {
    //If ... Disable bubbling.
    
    if (e.target.tagName === "INPUT") {

      e.stopPropagation();

      const label_name = e.target.nextSibling.nextSibling.textContent;
      
      //Uses querySelectorAll so that it dosent break if there are no matches
      const highlighted = document.querySelectorAll(".selected"); //re highlight after editing list
     
      
      if (label_name == "Name") {
        display_by_name();

      }
      else if (label_name == "Date") {
        display_by_date();
      }
     
      const to_highlight = document.querySelectorAll("section ul li");

      for (i of to_highlight){
        if(i.textContent == highlighted[0].textContent){
          i.classList.add("selected");
        }
      }
    }
  }
  



  function display_by_date() {

    
    const plays = document.querySelector("#playList ul");   //The individual plays
    plays.innerHTML = "";

    let date_composed = [];
    for (let p of paintings) {

      if (!date_composed.includes(p.likelyDate)) {  //no duplicates
        date_composed.push(p.likelyDate);
      }
    }

    date_composed.sort();

    for (let d of date_composed) {    //find the element that has that date

      const match = paintings.filter(p => p.likelyDate == d);

      for (let m of match) {
        const li = document.createElement("li");
        li.setAttribute("data-id", m.id);
        li.textContent = m.title;

        if(m.filename != ""){
          const img = document.createElement("img");
          img.setAttribute("src","icon.png");
          li.appendChild(img);
        }

        plays.appendChild(li);
      }
    }
  }


  function display_by_name() {

    const plays = document.querySelector("#playList ul");
    plays.innerHTML = "";  //clear the paintings


    let name = [];
    for (let p of paintings) {

      if (!name.includes(p.title)) {  //no duplicates
        name.push(p.title);
      }
    }
    name.sort();
  
    for (let n of name) {    //find the element that has that date

      const match = paintings.find(p => p.title == n); //The element to be added

      const li = document.createElement("li");
      li.setAttribute("data-id", match.id);
      li.textContent = match.title;

      if(match.filename != ""){
        const img = document.createElement("img");
        img.setAttribute("src","icon.png");
        li.appendChild(img);
      }

      plays.appendChild(li);
   // }
  }
    
  }
















  //const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';
  //const plays = JSON.parse(plays_info);





  /*
   To get a specific play, add play's id property (in plays.json) via query string,
     e.g., url = url + '?name=hamlet';
  
   https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
   https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
   https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=macbeth
  
   NOTE: Only a few plays have text available. If the filename property of the play is empty,
   then there is no play text available.
  */


  /* note: you may get a CORS error if you test this locally (i.e., directly from a
     local file). To work correctly, this needs to be tested on a local web server.
     Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
     use built-in Live Preview.
  */
});