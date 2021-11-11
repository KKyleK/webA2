//TODO Check if event bubbling really needs to be disabled where it is. 

//Add an if e.target. ... for each event since it could be a bubble that is causing event to fire.

document.addEventListener("DOMContentLoaded", () => {

  const paintings = JSON.parse(content);

  display_by_name();

  const sort_bttn = document.querySelector("#playList p");
  sort_bttn.addEventListener("input", sort);  //Sort the plays on the left hand side

  const select_play = document.querySelector("section ul");  //Shows selected play 
  select_play.addEventListener("click", show_screen_1);





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
      const play = paintings.find(p => p.id == e.target.getAttribute("data-id")); //Find the painting in use

      get_data(play.id);    //Fill the screen all async.      

    }
  }





  /*
  This needs to populate entire both screens but its all async, so cannot do any waiting.
  
  1: Fill the middle part with filter options
  2: add an event listener inside this function that will fill the right side once 
     the filter is choosen
  
  NOTE: EVENT LISTENERS MUST BE CONTAINED
  
  */
  async function get_data(id) {

    //alert(id);   

    const resp = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=${id}`);
    const data = await resp.json();

    fill_screen();

    document.querySelector("aside button").addEventListener("click", show_play);  //The "Filter" button
    





    function show_play(e) {

      const page = document.querySelector("#playHere");    //Fill the right hand side

      for (d of data) {                       //Fill the other page with play info once clicked.
        const p = document.createElement("");
      }
    }



    /* Optons:
  1. Act number
  2. Scene Number
  3. Highlight text option
  
    */
    function fill_screen() {


      const fieldset = document.createElement("fieldset");
      fieldset.setAttribute("id", "interface");            //this is the outer box (meh)

      const h2 = document.createElement("h2");
      h2.textContent = id;

      const select = document.createElement("select");
      select.id = "actList";

      const select2 = document.createElement("select");
      select2.id = "sceneList";

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

      select.addEventListener("select", fill_scene);
      //Add event listener to populate the scenes now

      //Scene event listener will need the peoples names!

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
    }


    function fill_scene(e){

      alert(e.target.tagName);
      if(e.target.tagName == "SELECT"){
    }
  }
  }












  //Detects that the play has been clicked.
  function show_screen_1(e) {


    if (e.target.tagName == "LI" || e.target.tagName == "BUTTON") {

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

      //Change later maybe
      data.innerHTML = `${play.likelyDate},<br>${play.genre},<br>${play.wiki}, ${play.gutenberg}, ${play.shakespeareOrg}<br><br>${play.desc}`;

      page.appendChild(header);
      page.appendChild(data);

    }


  }



  function sort(e) {


    //If ... Disable bubbling.
    if (e.target.tagName === "INPUT") {
      e.stopPropagation();

      const label_name = e.target.nextSibling.nextSibling.textContent;

      if (label_name == "Name") {
        display_by_name();

      }
      else if (label_name == "Date") {
        display_by_date();
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

      const match = paintings.find(p => p.title == n); //if there is a duplciate name

  //  for (let m of match) {  //add them back

      const li = document.createElement("li");
      li.setAttribute("data-id", match.id);
      li.textContent = match.title;;
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