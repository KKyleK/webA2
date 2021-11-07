

document.addEventListener("DOMContentLoaded",()=>{

  
  const paintings = JSON.parse(content);

  //Add the paintings to the left hand side
  display_by_name();

  

  const sort = document.querySelector("#playList p");

  sort.addEventListener("input", (e)=> {
    
    alert(e.target.getAttribute("type")); //correct
    let childName = e.target.firstChild;
    alert(childName);


    //if(querySelector(`${e.target} label`).textContent == "Name"){
      if(e.target.childNodes[0].textContent == "Name"){
      alert("Name!");
      display_by_name();
      
    }

    //else if(querySelector(`${e.target} label`).textContent == "Date"){
      else if(e.target.childNodes[0].textContent == "Date"){
      alert("Date!");
      display_by_date();

    }
    alert("nope!");
    //Handle errors
  });





  function display_by_date(){

    const plays = document.querySelector("#playList ul");
    plays.innerHTML = "";

    let date_composed = [];
    for (p of paintings){
      date_composed.push(p.likelyDate);
    }
    date_composed.sort();

    for (d of date_composed){    //find the element that has that date
      document.createElement("li");

      const match = paintings.find(p=>p.likelyDate==d.likelyDate);

      li.setAttribute("data-id",match.id);
      li.textContent = match.id;


      plays.appendChild
    }

  }

  function display_by_name(){

    const plays = document.querySelector("#playList ul");
    plays.innerHTML = "";  //clear the paintings
    for (p of paintings){  //add them back
  
      const li = document.createElement("li");
      li.setAttribute("data-id",p.id);
      li.textContent = p.id;
      plays.appendChild(li);
    }
  }




  //This is going to make the play go on the left.
  //plays.addEventListener()



  //returns an array of the play names
  // function fill_names(){
  //   names = [];
  //   for (p of paintings){
  //     names.push(p.id);
  //   }

  //   return names;
  // }


});

//const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';
//const plays = JSON.parse(plays_info);

//alert("here!");
//alert(file_text[0].id);



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
