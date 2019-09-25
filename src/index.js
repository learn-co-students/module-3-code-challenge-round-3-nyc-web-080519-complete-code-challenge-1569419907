const theatreId = 804;

document.addEventListener("DOMContentLoaded", function() {
    const showings = document.querySelector(".showings")

    fetch(`https://evening-plateau-54365.herokuapp.com/theatres/${theatreId}`)
    .then(function(response) {
        return response.json()
    })
    .then(function(movies) {
        movies.showings.forEach(function(movie) {
            //calculate remaining tickets
            const ticketsRemaining = movie.capacity - movie.tickets_sold

            let button
            //if there are tickets left, can have regular add button
            if (ticketsRemaining > 0) {
                button = `<div data-action="buy" data-id="${movie.id}" class="ui blue button">Buy Ticket</div>`
            }
            //if there aren't tickets left, button should say sold out and be disabled
            else {
                button = `<div data-action="buy" data-id="${movie.id}" class="ui blue button disabled">Sold Out</div>`
            }

            showings.insertAdjacentHTML("beforeend",
            `<div class="card">
                <div class="content">
                <div class="header">
                    ${movie.film.title}
                </div>
                <div class="meta">
                    ${movie.film.runtime} minutes
                </div>
                <div class="description">
                    ${ticketsRemaining} remaining tickets
                </div>
                <span class="ui label">
                    ${movie.showtime}
                </span>
                </div>
                <div class="extra content">
                    ${button}
                </div>
            </div>`)
        })
    })

    showings.addEventListener("click", function(e) {
        if (e.target.dataset.action === "buy") {
            // console.log("bought ticket")
            // showing_id is the data-id in the buy ticket button
            const showing_id = e.target.dataset.id
            
            fetch('https://evening-plateau-54365.herokuapp.com/tickets', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({showing_id: showing_id})
            })
            .then(function(response) {
                return response.json()
            })
            .then(function(movie) {
                // console.log(movie)
                //decrement tickets remaining on front end
                const card = e.target.closest('.card')
                const ticketDesc = card.querySelector('.content .description')
                const tickets = parseInt(ticketDesc.innerText)
                //if there is more than 1 ticket left, decrement text
                if (tickets > 1) {
                    ticketDesc.innerText = tickets - 1 + " remaining tickets"
                }
                //if there is only one ticket left, decrement text and disable button
                else if (tickets === 1) {
                    ticketDesc.innerText = tickets - 1 + " remaining tickets"
                    e.target.innerText = "Sold Out"
                    e.target.classList.add("disabled")
                }
            })
        }
    })
})