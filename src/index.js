const theatreId = 805

const allMovies = "https://evening-plateau-54365.herokuapp.com/theatres/805"

const allTickets = "https://evening-plateau-54365.herokuapp.com/tickets"

const movieContaier = document.querySelector("body > div.ui.cards.showings")



moviesArray = []

fetch(allMovies)
.then(resp => resp.json())
.then(function(data) {
    moviesArray = data.showings
    moviesArray.forEach(function(film) {
        let remTix = film.capacity - film.tickets_sold
        // debugger
        const str = ` <div data-id=${film.id} class="card">
                        <div class="content">
                            <div class="header">
                            ${film.film.title} 
                            </div>
                            <div class="meta">
                            ${film.film.runtime} minutes
                            </div>
                            <div class="description">
                            ${remTix} remaining tickets
                            </div>
                            <span class="ui label">
                            ${film.showtime} 
                            </span> 
                        </div>
                        <div class="extra content">
                            <div class="ui blue button" data-id=${film.id} data-action="buy">Buy Ticket</div>
                        </div>
                        </div> `

        movieContaier.innerHTML += str


    })  // the end of forEach
})  // the end of the last .then

movieContaier.addEventListener("click", function(e) {
    
    if(e.target.dataset.action === "buy") {
        
        let showingId = e.target.dataset.id
        let tixNum = document.querySelector("div.description")
        let newCount = parseInt(tixNum.innerText) - 1
        // debugger
      

        fetch(allTickets, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({showing_id: showingId})
    })
    .then(resp => resp.json())
    .then(function(ticket) {

        tixNum.innerText = newCount
    })
    } // the end of if statement
}) // the end of event listener



