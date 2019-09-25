const theatreId = 813;
const baseURL = "https://evening-plateau-54365.herokuapp.com/theatres/813"
const tixURL = "https://evening-plateau-54365.herokuapp.com/tickets"
const showingsPanel = document.querySelector("body > div.ui.cards.showings")
let allShowings;


//As a user, when the page loads I should see a list of movie showings fetched from a remote API.

getShowings().then(showShowings)

function showShowings(showings){
  allShowings = showings.showings 
  allShowings.forEach(renderOneShow)
}

function renderOneShow(show, atCapacity = false){

  // const remainingTix = show.capacity - show.tickets_sold
  const showCard = `
    <div class="card">
      <div class="content">
        <div class="header">
          ${show.film.title}
        </div>
        <div class="meta">
          ${show.film.runtime} minutes
        </div>
        <div class="description">
          ${show.capacity - show.tickets_sold} remaining tickets
        </div>
        <span class="ui label">
          ${show.showtime}
        </span>
      </div>
      <div class="extra content">
        <div data-id=${show.id} id="button" class="ui blue button">Buy Ticket</div>
      </div>
    </div>
  `

  showingsPanel.insertAdjacentHTML('beforeend', showCard)

}

//As a user, clicking on the 'Buy Ticket' button should purchase a ticket and decrement the remaining tickets by one.This information should be persisted in the remote API. 

showingsPanel.addEventListener('click', clickBuyTicket)

function clickBuyTicket(e){
  const showingId = e.target.dataset.id
  if (e.target.innerText === "Buy Ticket"){

    //look for the tix remaining and decrease it
    const showingMatch = allShowings.find(showing => parseInt(showingId) === showing.id)

    const showingMatchTix = showingMatch.tickets_sold 

    let updatedTixSold = showingMatchTix + 1 
    showingMatch.tickets_sold = updatedTixSold
    
    //look for the description div and update the html there
    const tixRemain = e.target.closest('.card').querySelector(".description")
    const remainingTix = showingMatch.capacity - showingMatch.tickets_sold

    if(remainingTix >= 0){
      tixRemain.innerText = `${remainingTix} remaining tickets`
      //Post new ticket
      postTix(showingId)
    } else {
      //disable the button by finding the button and putting the innerText as Sold Out
      //As a user I should NOT be able to purchase a ticket for a sold out showing.
      //The 'Buy Ticket' button should be disabled on sold out showings, and the text should change to "sold out".
      const buyTicketBtn = e.target.closest('.card').querySelector("#button")
      buyTicketBtn.innerText = "Sold Out"
      buyTicketBtn.disabled = true 
      alert("SOLD OUT. SUCKS TO SUCK. " )

    }
  }
}


//FETCHES
function getShowings(){
  return fetch(baseURL)
    .then(resp => resp.json())
}

function postTix(showingId){
  options = {
    method: "POST", 
    body: JSON.stringify({showing_id: showingId}),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  return fetch(tixURL, options)
    .then(resp => resp.json())
}
