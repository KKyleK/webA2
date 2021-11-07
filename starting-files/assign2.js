

document.addEventListener("DOMContentLoaded", () => {


  const paintings = JSON.parse(content);

  //Add the paintings to the left hand side
  display_by_name();

  //The sort buttons
  const sort_bttn = document.querySelector("#playList p");
  sort_bttn.addEventListener("input", sort);


















  function sort(e) {

    const label_name = e.target.nextSibling.nextSibling.textContent;

    if (label_name == "Name") {
      display_by_name();

    }
    else if (label_name == "Date") {
      display_by_date();
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
