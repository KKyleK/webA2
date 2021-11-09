//TODO Check if event bubbling really needs to be disabled where it is. 

//Add an if e.target. ... for each event since it could be a bubble that is causing event to fire.

document.addEventListener("DOMContentLoaded", () => {

  const paintings = JSON.parse(content);

  display_by_name();
  
  const sort_bttn = document.querySelector("#playList p");
  sort_bttn.addEventListener("input", sort);  //Sort the plays on the left hand side

  const select_play = document.querySelector("section ul");  //Shows selected play 
  select_play.addEventListener("click", show_screen_1);

 



  //This is the middle of the page.
  function show_play_screen_2(e){
    
    if(e.target.tagName === "BUTTON") {

      e.stopPropagation();
      const play = paintings.find(p => p.id == e.target.getAttribute("data-id"));
      

      //Can make this better later
      
      //Lots of js!
      fill_screen(play);

      
      
      
      show_play_screen_2_right(play);
    }
  }

//This only happens once user selects the box or whatever.
  function show_play_screen_2_right(play){

    
    const page = document.querySelector("#playHere");
    
    page.innerHTML = "";
    
    
    if (play.filename == ""){

      const p = document.createElement("p");
      p.textContent = "The play cannot be found";
      page.appendChild(p);
    }
    else{
      get_data(play.id);    //Fetch the api data and display it.
    }
  }

  async function get_data(id){

    const resp = await fetch("https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?" + id);
    const data = await resp.json();
    
    const page = document.querySelector("#playHere");

    for (d of data){
      const p = document.createElement("")
    }


  }





  //Detects that the play has been clicked.
  function show_screen_1(e){


    if(e.target.tagName == "LI" || e.target.tagName == "BUTTON"){

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
      button.addEventListener("click",show_play_screen_2);
  
  
      page.appendChild(header);
      page.append(synopsis);
      page.appendChild(body);
      page.appendChild(button);
      
      show_screen_1_right(play);   
    }
  
  
  
    function show_screen_1_right(play){
  
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

   
    const plays = document.querySelector("#playList ul");
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
        li.textContent = m.id;
        plays.appendChild(li);
      }
    }
  }





  function display_by_name() {

    const plays = document.querySelector("#playList ul");
    plays.innerHTML = "";  //clear the paintings
    for (let p of paintings) {  //add them back

      const li = document.createElement("li");
      li.setAttribute("data-id", p.id);
      li.textContent = p.id;
      plays.appendChild(li);
    }
  }










  function fill_screen(play){


    



    // const fieldset = document.createElement("fieldset");
    // fieldset.setAttribute("id", "interface");

    // const fieldset2 = document.createElement("fieldset");
    // const h2 = document.createElement("h2");

    // const select = document.createElement("select");
    // const select2 = document.createElement("select");

    // fieldset.appendChild(h2);
    // fieldset.appendChild(select);
    // fieldset.appendChild(select2);
    // fieldset.appendChild(fieldset2);

    // const select = document.createElement("select");
    // const option = document.createElement("option");
    // select.appendChild(option);

    // const input = document.createElement("input");
    // const button = document.createElement("button");



    // const button = ocument.createElement("button");
    // fieldset.appendChild(button);
    const page = document.querySelector("aside");
    page.innerHTML =`
    <fieldset id="interface">
          <h2>Whatever I want</h2>
          <select id="actList"></select>
          <select id="sceneList"></select>
          <fieldset>
             <select id="playerList">
                <option value=0>All Players</option>
             </select>

             <input type="text" id="txtHighlight" placeholder="Enter a search term" />
             <button id="btnHighlight">Filter</button>
          </fieldset> 
        </fieldset>

       <button>Close</button>`;
    
    

    const but = document.querySelector("aside > button");
    but.setAttribute("data-id", play.id);
    but.addEventListener("click", show_screen_1);

    
    //document.querySelector("aside button").addEventListener("click", show_screen_1);
   

  }
});









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
