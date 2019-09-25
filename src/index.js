document.addEventListener('DOMContentLoaded', function() {



let showCardDIV = document.querySelector(".showings")
let buyButton = showCardDIV.querySelector(".button")
const theatreId = 810
let allData



//------------ FUNCTIONS-----------
function printAllShowingsToScreen(showingsArr) {
  showCardDIV.innerHTML = ""
  showingsArr.forEach (function(show) {
    printSingleShowingToScreen(show)
  })
} // ends printAllShowingsToScreen function

function printSingleShowingToScreen(show) {
  let ticketsRemaining = (`${show.capacity}` - `${show.tickets_sold}`)


  if  (ticketsRemaining > 0) { 
  showCardDIV.insertAdjacentHTML("beforeend", `
    <div class="card">
    <div class="content">
      <div class="header">
        ${show.film.title}
      </div>
      <div class="meta">
      ${show.film.runtime} minutes
      </div>
      <div class="description" data-show-id="${show.id}Left">
        ${ticketsRemaining} remaining tickets
      </div>
      <span class="ui label">
        ${show.showtime}
      </span>
    </div>
    <div class="extra content">
      <div class="ui blue button" data-show-id="${show.id}">Buy Ticket</div>
    </div>
  </div>
  `)}
  else {
    showCardDIV.insertAdjacentHTML("beforeend", `
    <div class="card">
    <div class="content">
      <div class="header">
        ${show.film.title}
      </div>
      <div class="meta">
      ${show.film.runtime} minutes
      </div>
      <div class="description" data-show-id="${show.id}Left">
        ${ticketsRemaining} remaining tickets
      </div>
      <span class="ui label">
        ${show.showtime}
      </span>
    </div>
    <div class="extra content">
      <div data-show-id="${show.id}">Sold Out </div>
    </div>
  </div>
  `)
  }
} //ends  printSingleShowingToScreen(show) 


function fetchToUpdateTicketCount(showid,alldata) {
  show = alldata.showings.find( function(show) { return show.id == showid})
  allData = alldata
  postData = {showing_id: `${show.id}`}
  // debugger
  fetch('https://evening-plateau-54365.herokuapp.com/tickets',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(postData)
    }
  )
  .then( function(response) { return response.json()} )
  .then ( function(response) {
    if (!response.errors) {
      show.tickets_sold = ++show.tickets_sold
      printAllShowingsToScreen(alldata.showings)
    } else {
      return response.errors
    }

  })
  .catch(function(errors) {
    alert(errors)
  })


  
} // ends fetchToUpdateTicketCount(showid) function




document.addEventListener("click", function(clickEvent) {
  // console.log(clickEvent.target)
  // showCardDIV = document.querySelector(".showings")
  // buyButton = showCardDIV.querySelector(".button")
  
  switch (true) {
    case (clickEvent.target.innerText == "Buy Ticket"):
      let showid = clickEvent.target.dataset.showId
      if (parseInt(document.querySelector(`[data-show-id='${showid}Left']` ).innerText) > 0 ) {
        fetchToUpdateTicketCount(showid, allData)
        
      }
      break

  }// Ends EL Switch Statement
})// ends click event listeneer


//fetch to get all the theater data `https://evening-plateau-54365.herokuapp.com/theatres/${theatreId}` 

//// Initial fetch to load the page
fetch(`https://evening-plateau-54365.herokuapp.com/theatres/${theatreId}` )
.then ( function(response) { return response.json()} )
.then ( function(response) {
  allData = response
  printAllShowingsToScreen(allData.showings)
})


}); // ends the DOM Loaded event listener