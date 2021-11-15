/*
Name: Kyle Koivuneva.
Course: COMP 3612.
Instructor: Randy Connolly.

Description: A website which uses the provided API to display 
             Shakespeare plays.
*/


/*
Main: Fills initial screen and adds event listeners to allow 
      user to populate list of plays view.
*/
document.addEventListener("DOMContentLoaded", () => {

  const paintings = JSON.parse(content);  //The Json file provided.

  display_header();
  display_by_name();
  display_welcome_message();

  const sort_bttn = document.querySelector("#playList p");
  sort_bttn.addEventListener("input", sort);  //Sort the plays on the left hand side

  const select_play = document.querySelector("section ul");  //Shows selected play's view screen.

  select_play.addEventListener("click", e => {    //Highlights the selcted play.
    if (e.target.tagName == "LI") {
      const plays = document.querySelectorAll("section ul li");
      for (p of plays) {
        if (p.classList.contains("selected")) {
          p.classList.remove("selected");
        }
      }

      e.target.classList.add("selected");
    }
  });
  select_play.addEventListener("click", list_of_plays_middle); //Fills list of plays view with selected play.


  /*
    Function: display_header()
  
    purpose: Displays credits on the right hand column of the page.
  
    details: Saves the contents of the right hand column. Inserts
             the credit content. After 5 seconds reinstates previous
             content.
  */
  function display_header() {
    const header = document.querySelector("header");
    const button = document.createElement("button");
    button.id = "credit";
    button.textContent = "Credits";
    header.appendChild(button);
    button.addEventListener("mouseover", e => {

      try {
        document.querySelector("#credit_box").remove();  //Removes previous credits before re-showing them.
      }
      finally {
        const box = document.querySelector("#playHere");
        const old = box.innerHTML;                       //saves HTML of page.
        box.innerHTML = "";

        const credit_box = document.createElement("div");
        credit_box.id = "credit_box";
        const credit_name = document.createElement("p");
        credit_name.textContent = "Page by Kyle Koivuneva."
        const credit_course = document.createElement("p");
        credit_course.textContent = "COMP 3612."

        credit_box.appendChild(credit_name);            //adds new HTML with the credits.
        credit_box.appendChild(credit_course);

        box.appendChild(credit_box);

        setTimeout(() => box.innerHTML = old, 5000);    //after 5 seconds puts back the HTML
      }
    });
  }



  /*
  Function: display_header()

  purpose: Promps user to select a play.

*/
  function display_welcome_message() {

    const left_column = document.querySelector("#playHere");
    const p = document.createElement("p");
    p.textContent = "Select a play to see details";
    left_column.appendChild(p);
  }



  /*
    Function: sort()
  
    purpose: Sorts the list of avalible plays based on user input.
             Also preserves highlighting after a sort is made.
  
  */
  function sort(e) {

    if (e.target.tagName === "INPUT") {
      e.stopPropagation();

      const label_name = e.target.nextSibling.nextSibling.textContent;  //Gets the option choosen.

      //Uses querySelectorAll so that it does not break if there are no matches.
      const highlighted = document.querySelectorAll(".selected"); //re highlight after editing list

      if (label_name == "Name") {
        display_by_name();

      }
      else if (label_name == "Date") {
        display_by_date();
      }

      const to_highlight = document.querySelectorAll("section ul li");

      for (let i of to_highlight) {
        if (i.textContent == highlighted[0].textContent) {
          i.classList.add("selected");
        }
      }
    }
  }



  /*
    Function: display_by_date()
  
    purpose: Reorders the list of plays to be in order by date.
  
    details: uses js function sort which automatically orders the list
             in ascending order.
  */
  function display_by_date() {

    const plays = document.querySelector("#playList ul");   //The individual plays.
    plays.innerHTML = "";

    let date_composed = [];
    for (let p of paintings) {

      if (!date_composed.includes(p.likelyDate)) {  //no duplicates.
        date_composed.push(p.likelyDate);
      }
    }
    date_composed.sort();

    for (let d of date_composed) {    //find the element that has that date.

      const match = paintings.filter(p => p.likelyDate == d);

      for (let m of match) {          //Adds the plays back in.
        const li = document.createElement("li");
        li.setAttribute("data-id", m.id);
        li.textContent = m.title;

        if (m.filename != "") {     //Adds an icon if the play has an api associated with it.
          const img = document.createElement("img");
          img.setAttribute("src", "icon.png");
          li.appendChild(img);
        }
        plays.appendChild(li);
      }
    }
  }

  /*
    Function: display_by_name().
  
    purpose: Reorders the list of plays to be in order by name.
  
    details: Sort in this case returns all plays in alphabetical order.
  */
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

      if (match.filename != "") {                     //adds the icon.
        const img = document.createElement("img");
        img.setAttribute("src", "icon.png");
        li.appendChild(img);
      }
      plays.appendChild(li);
    }
  }




  /*
    Function: list_of_plays_middle(e).
  
    purpose: Displays the middle portion of the list of plays view.
  
    details: Finds and displays the selected plays: title,
                                                    Synopsis,
                                                    And a button if the play has api information.
  */
  function list_of_plays_middle(e) {

    if (e.target.tagName == "LI" || e.target.tagName == "BUTTON") {   //If close was clicked or a list element.

      e.stopPropagation();

      const page = document.querySelector("aside");  //The middle portion of the screen.
      const play = paintings.find(p => p.id == e.target.getAttribute("data-id")); //Get the play that was clicked

      const header = document.createElement("h1");
      const synopsis = document.createElement("h2");    //New content to be displayed.
      const body = document.createElement("p");
      const button = document.createElement("button")

      page.innerHTML = "";

      header.textContent = play.title;
      body.textContent = play.synopsis;
      synopsis.textContent = "Synopsis";

      button.textContent = "Show Play Text";    //creates the button with information for api fetch.
      button.setAttribute("data-id", play.id);

      if (play.filename == "") {  //Hides the button if no filename.

        button.style.display = "none";

      }
      else {

        button.addEventListener("click", show_play_view);
      }

      page.appendChild(header);   //adds the content.
      page.append(synopsis);
      page.appendChild(body);
      page.appendChild(button);

      list_of_plays_right(play);
    }


    /*
      Function: list_of_plays_right().
    
      purpose: Displays the right portion of the list of plays view.
    
      details: Fills the screen with various information from provided
              "plays.json" file.
    */
    function list_of_plays_right(play) {

      const page = document.querySelector("#playHere");  //The right side of the screen.
      page.innerHTML = "";

      const header = document.createElement("h2");
      const data = document.createElement("p");

      header.textContent = play.title;

      const wiki_link = document.createElement("a");
      const gutenberg_link = document.createElement("a");
      const shakespeare_link = document.createElement("a");

      const list = document.createElement("ul");              //The list of links
      list.id = "playInfo";

      const link_holder = document.createElement("li");
      const link_holder2 = document.createElement("li");
      const link_holder3 = document.createElement("li");


      wiki_link.setAttribute("href", play.wiki);            //Fills the links
      wiki_link.textContent = "Wiki link";
      gutenberg_link.setAttribute("href", play.gutenberg);
      gutenberg_link.textContent = "Gutenberg link";
      shakespeare_link.setAttribute("href", play.shakespeareOrg);
      shakespeare_link.textContent = "Shakespeare org link";

      link_holder.appendChild(wiki_link);                 //Add the links into the list for easy
      link_holder2.appendChild(gutenberg_link);           //formatting.
      link_holder3.appendChild(shakespeare_link);

      list.appendChild(link_holder);
      list.appendChild(link_holder2);
      list.appendChild(link_holder3);

      const plays_info = document.createElement("p");
      plays_info.textContent = play.desc;

      const genre = document.createElement("p");
      genre.textContent = play.genre + ",";

      data.append(genre);              //add all content to page.
      data.appendChild(list);
      data.appendChild(plays_info);

      page.appendChild(header);
      page.appendChild(data);
    }
  }



  /*
    Function: show_play_view().
  
    purpose: Gets the ID of the play which has api information
  */
  function show_play_view(e) {

    if (e.target.tagName === "BUTTON") {

      e.stopPropagation();
      const play = paintings.find(p => p.id == e.target.getAttribute("data-id")); //Find the play in use

      get_data(play.id);    //Fetch and show the play
    }
  }


  /*
  Function: get_data().

  purpose: async function that gets the api data of a play. 

  details: Local storage is first checked to see if the play is already cashed.
           If not, play is fetched, and then displayed.
*/
  async function get_data(id) {

    let play_local = localStorage.getItem(id);

    if (play_local == null) {  //if not in local storage.

      const resp = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=${id}`);
      var data = await resp.json();
      localStorage.setItem(id, JSON.stringify(data));  //save to local storage.

    }
    else {
      var data = JSON.parse(play_local);   //var used to make it function scoped.
    }

    play_view_middle();
    play_view_right("ACT I", "SCENE I");  //Initialy show act I scene I

    document.querySelector("#btnHighlight").addEventListener("click", highlight);  //Does the filter



    /*
      Function: play_view_middle().
    
      purpose: Fills the middle of the screen with select options, 
               and other HTML markup.
    */
    function play_view_middle() {

      const outer_box = document.createElement("fieldset");     //Create the elements.
      outer_box.setAttribute("id", "interface");

      const title = document.createElement("h2");
      title.textContent = id;

      const act_select = document.createElement("select");
      act_select.id = "actList";

      const scene_select = document.createElement("select");
      scene_select.id = "sceneList";
      scene_select.addEventListener("change", e => change_scene(e.target.value));


      const inner_box = document.createElement("fieldset");

      const speaker_select = document.createElement("select");
      speaker_select.id = "playerList";

      const input_text = document.createElement("input");
      input_text.setAttribute("type", "text");
      input_text.id = "txtHighlight";
      input_text.setAttribute("placeholder", "Enter a search term");

      const button_filter = document.createElement("button");
      button_filter.id = "btnHighlight";
      button_filter.textContent = "Filter";

      const button_close = document.createElement("button");
      button_close.textContent = "Close";
      button_close.id = "btnClose";
      button_close.setAttribute("data-id", id);
      button_close.addEventListener("click", list_of_plays_middle);


      for (let a of data.acts) {  //add the acts to choose from.

        const act = document.createElement("option");
        act.textContent = a.name;
        act_select.appendChild(act);
      }

      act_select.addEventListener("change", e => fill_scene(e.target.value));     //Change avalible scenes
      act_select.setAttribute("selected", "ACT I");             //Selects act 1 by default

      inner_box.appendChild(speaker_select);    //add content
      inner_box.appendChild(input_text);
      inner_box.appendChild(button_filter);

      outer_box.appendChild(title);
      outer_box.appendChild(act_select);
      outer_box.appendChild(scene_select);
      outer_box.appendChild(inner_box);
      outer_box.appendChild(button_close);

      const page = document.querySelector("aside");
      page.innerHTML = "";

      page.appendChild(outer_box);
      page.appendChild(button_close);

      fill_scene("ACT I");  //Initial load of the scenes list.
    }



    /*
      Function: fill_scene(). 
    
      purpose: Fills the scene options based on the act selected.
    */
    function fill_scene(act_name) {
      const scene = document.querySelector("#sceneList");
      scene.innerHTML = "";

      const sceneList = data.acts.find(a => a.name == act_name);

      for (let s of sceneList.scenes) {  //The acts to choose from

        const option = document.createElement("option");
        option.textContent = s.name;
        scene.appendChild(option);
      }

      play_view_right(act_name, "SCENE I");  //When a new act is selected show scene 1 by default.
    }


    /*
         Function: fill_scene(). 
       
         purpose: Helper function that changes the scene being shown.
       */
    function change_scene(scene_num) {

      const act = document.querySelector("#actList");

      play_view_right(act.value, scene_num);
    }





    /*
    Function: highlight().
  
    purpose: Highlights the text in the play that matches the users input.
             Changes the text to only be the speaker who is talking.
  
    details: Wraps text in <b> tags to highlight. 
             Removes all speeches that are not done by the 
             speaker selected.
  */
    function highlight(e) {

      const speaker = document.querySelector("#playerList").value;        //The player 
      const text = document.querySelector("#txtHighlight").value;   //the stuff to highlight
      const act = document.querySelector("#actList");
      const scene = document.querySelector("#sceneList");

      play_view_right(act.value, scene.value);                      //Refresh the play to delete previous highlighting.
      document.querySelector("#playerList").value = speaker;

      const play = document.querySelector("#sceneHere");

      if (text != "" && text != " ") {    //Only replace if valid text was entered.

        play.innerHTML = play.innerHTML.replaceAll(text, `<b>${text}</b>`);
      }

      if (speaker != "ALL") {
        const speaches = document.querySelectorAll(".speech");

        for (let s of speaches) {
          if (s.firstChild.textContent != speaker) {    //Remove speakers that don't match
            s.remove();
          }
        }
      }
    }


    /*
     Function: play_view_right
   
     purpose: Generates the play on the right hand column.
   
     details: Generates the HTML markup based on the selected
              act and play. Based on the characters in the given 
              scene, populates the actor filter option.
   */
    function play_view_right(act_num, scene_num) {

      const page = document.querySelector("#playHere");    //The right column of the screen.
      page.innerHTML = "";

      const act = data.acts.find(a => a.name == `${act_num}`);         //the act
      const scene = act.scenes.find(s => s.name == `${scene_num}`);   //The first scene

      const title = document.createElement("h2");   //add content
      title.textContent = data.title;

      const article = document.createElement("article");
      article.id = "actHere";
      const act_name = document.createElement("h3");
      act_name.textContent = act.name;

      article.appendChild(act_name);

      const current_scene = document.createElement("div");
      current_scene.id = "sceneHere";

      const scene_name = document.createElement("h4");
      scene_name.textContent = scene.name;

      const scene_title = document.createElement("p");
      scene_title.setAttribute("class", "title");
      scene_title.textContent = scene.title;

      const stage_direction = document.createElement("p");
      stage_direction.setAttribute("class", "direction");
      stage_direction.textContent = scene.stageDirection;

      current_scene.appendChild(scene_name);
      current_scene.appendChild(scene_title);
      current_scene.appendChild(stage_direction);

      let speakers = [];   //Based on the scene, populates the speaker filter.

      for (s of scene.speeches) {

        const speech = document.createElement("div");      //create the speeches.
        speech.setAttribute("class", "speech");
        const span = document.createElement("span");
        span.textContent = s.speaker;

        speech.appendChild(span);

        if (!speakers.includes(s.speaker)) {  //no duplicates, add it to speaker filter.
          speakers.push(s.speaker);
        }
        for (let l of s.lines) {

          const line = document.createElement("p");     //write out the speaches
          line.textContent = l;
          speech.appendChild(line);
        }
        current_scene.appendChild(speech);
      }

      article.appendChild(current_scene);

      page.appendChild(title);
      page.appendChild(article);

      const speaker_option = document.querySelector("#playerList");
      speaker_option.innerHTML = "";

      for (let s of speakers) {       //add the speakers to the list
        const option = document.createElement("option");
        option.textContent = s;
        speaker_option.appendChild(option);
      }
      const all = document.createElement("option"); //add ALL: shows all speeches.
      all.textContent = "ALL";
      speaker_option.appendChild(all);
    }
  }
});