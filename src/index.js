    const theatreId = null;
    // define the movieContainer where all the movies from API should be going
    const movieContainer = document.querySelector("#showings")

    // This is the fetch which defaults to a "GET" request for getting all the movies
        fetch("https://evening-plateau-54365.herokuapp.com/theatres/814")
        // parse response to json
            .then(response => response.json())
            // use parsed response to do dom manipulation
            .then(data => {
                // for each showing render dom content
                data["showings"].forEach(function (showing){
                    let remainingTickets = showing.capacity - showing.tickets_sold
                            movieContainer.insertAdjacentHTML('beforeend', `<div class="card">
                            <div class="content">
                                <div class="header">
                                ${showing["film"].title}
                                </div>
                                <div class="meta">
                                ${showing["film"].runtime}
                                </div>
                                <div id="description" class="description">
                                ${remainingTickets}
                                </div>
                                <span class="ui label">
                                ${showing.showtime}
                                </span>
                            </div>
                            <div class="extra content">
                                <div data-id=${showing.id} class="ui blue button">Buy Ticket</div>
                            </div>
                            </div>`)
                    })
            })
            // this is where the fetch for data to render on the page ends
    
    // add an event listener to the entire container for all the movies to listen for a click
    movieContainer.addEventListener('click', function(e){
        // check to make sure the event was a click on a button
        if (e.target.className === "ui blue button") {
            // send the post fetch request
            fetch(`https://evening-plateau-54365.herokuapp.com/tickets`, {
                method: "POST",
                headers:
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(
                {
                    showing_id: e.target.dataset.id
                })
            })
            // After the fetch runs successfully, this is the HTML manipulation portion, this is an example of pessimistic rendering
            .then(response => response.json())
            // Now that we have a parsed response we need to run the DOM manipulation
            .then(data => {
                // define your two nodes to be accessed for DOM manipulation as variables
                let button = e.target
                let span = e.target.parentElement.parentElement.querySelector("#description")
                // check to see if there was an error message thrown from the fetch
                if (data.error) {
                    // ... if so .... disable the button and make it say sold out after alerting the user
                    button.disabled = true
                    button.innerText = "Sold Out"
                    alert("Sorry That showing is Sold Out")
                } else {
                    // Otherwise just change the new ticket count to the old one - 1
                    let newTicketCount = parseInt(span.innerText) - 1
                    span.innerText = `${newTicketCount}`
                    }
                })
        }
})


// THATS ALL FOLKS!!!!!!!!!!!!!
