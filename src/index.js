// ** HI!!! I wrote some notes at the end!!!! 

document.addEventListener("DOMContentLoaded", () => {
  const theatreId = 807;
  const APIURL = "https://evening-plateau-54365.herokuapp.com/theatres"; //get this from API docs
  const POSTURL = "https://evening-plateau-54365.herokuapp.com/tickets"

  const showingsContainer = document.getElementById("showings-container") //I'm aware the the id attribute is meant for CSS styling and I'm making the choice to use it and am aware of potential consequences if a designer changes/removes it!

  // As a user, when the page loads I should see a list of movie showings fetched from a remote API.
  getShowings() //the magic of hoisting

  function getShowings() {
    return fetch(`${APIURL}/${theatreId}`)
    .then(resp => resp.json())
    .then(data => {
      data.showings.forEach(showing => {
        renderShowing(showing)
      })
    })
  }

  function buyTicketPost(postBod) {
    return fetch(POSTURL, {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(postBod)
    })
    .then(resp => {
      // console.log(resp)
      resp.json()
    })
  }

  function renderShowing(showing) {
    const title = showing.film.title
    const runtime = showing.film.runtime
    const showtime = showing.showtime
   
    let remainingTickets = (showing.capacity - showing.tickets_sold)
    
    showingsContainer.insertAdjacentHTML("beforeend", `
    <div class="card" data-id="${showing.id}">
      <div class="content">
        <div class="header">
          ${title}
        </div>
        <div class="meta">
        ${runtime} minutes
        </div>
        <div class="description" data-desc="remainging-tickets">
        ${remainingTickets} remaining tickets
        </div>
        <span class="ui label">
        ${showtime}
        </span>
      </div>
      <div class="extra content" data-info="button-area">
        <div class="ui blue button" data-showing-id="${showing.id}" data-action="buy" data-tickets="${remainingTickets}">Buy Ticket</div>
      </div>
    </div>
    `)

    const buttonArea = document.querySelector(`[data-info="button-area"]`) 
    if (remainingTickets === 0) {
      buttonArea.innerHTML = `<div class="sold-out">Sold Out</div>`
    }
  }

  // function renderUpdatedShowing(showing, id) {
  //   //re-render the showing for the updated id
  // }

  // As a user, clicking on the 'Buy Ticket' button should purchase a ticket and decrement the remaining tickets by one. 
  // This information should be persisted in the remote API.
  // As a user I should not be able to purchase a ticket for a sold out showing. 
  //The 'Buy Ticket' button should be disabled on sold out showings, and the text should change to "sold out".
  showingsContainer.addEventListener("click", e => {
    // console.log("clicky boy")
    // console.log(e.target.dataset.action)
    // console.log(e.target.dataset.showingId
    if (e.target.dataset.action === "buy") {
      // console.log(`trying to buy a dang ticket! for movie id ${e.target.dataset.showingId}`)
      const showingId = e.target.dataset.showingId
      const showingCard = showingsContainer.querySelector(`[data-id="${showingId}"]`)
      const updateTicketsArea = showingCard.querySelector(`[data-desc="remainging-tickets"]`)
      const buttonArea = showingCard.querySelector(`[data-info="button-area"]`) 

      let ticketsSold = e.target.dataset.tickets
      const postBod = {
        showing_id: showingId
      }

      buyTicketPost(postBod)
      .then(data => {
        if (ticketsSold - 1 === 0) {
          updateTicketsArea.innerText = `${ticketsSold - 1} tickets remaining`
          buttonArea.innerHTML = `<div class="sold-out">Sold Out</div>`
          //would be good to get the error response from the API here and maybe alert the user
        } else {
          updateTicketsArea.innerText = `${ticketsSold - 1} tickets remaining`
          buttonArea.innerHTML = `<div class="ui blue button" data-showing-id="${showingId}" data-action="buy" data-tickets="${ticketsSold - 1}">Buy Ticket</div>`
        }
      })

      } //end of if statement
  }) //end of event listener


}) //end of DOMContentLoaded

// ** NOTES **

// As is, this "works" but I don't really like it and would refactor if I had more time, but I was nervous and lost some time to *mild* panic
// In a more real world situation, before updatin the tickets remaining situation, you'd probably want to do a GET request on the individual showing to make sure multiple users aren't all buying tickets at the same time before updating the number of tickets sold
// This API wasn't RESTFUL in the sense that we could make an individual GET request to a showing/:id (also all those GET requests are probably not great for the server and stuff) so I cobbled together a different way to do it
// If I had this to do over, I'd store all the response data from the page load GET fetch into an array of the showing objects, and operate off of that to render the DOM. 
// Instead I started to freak out about the time and just used the dataset alllll over the place like a mad woman. I recognize this is likely "not" "ideal" (Chris Farley air quotes) Lots of places to update things and room for bugs/errors
// ALSO rather than replacing the innerHTML on the button when sold out, it would be nicer to toggle the css class and display the Sold Out that way rather than overwriting the HTML