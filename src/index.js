//-----------------------------Requirements----------------------------------------------------//
// * As a user, when the page loads I should see a list of movie showings fetched from a remote API.
    // Fetch the data from 'https://evening-plateau-54365.herokuapp.com/theatres/812'.
    // ForEach movie push it to the DOM with the correct HTML. 
// * As a user, clicking on the 'Buy Ticket' button should purchase a ticket and decrement the remaining tickets by one. This information should be persisted in the remote API.
    // Set up an event listener on the "But Ticket" button. 
    // The callbak should be a fetch(patch) that will update the database and decrement the value on the card by one. 
// * As a user I should not be able to purchase a ticket for a sold out showing. The 'Buy Ticket' button should be disabled on sold out showings, and the text should change to "sold out".

//-----------------------------------code------------------------------------------------------//


document.addEventListener('DOMContentLoaded', (event) => {
    const showings = document.querySelector('body > div.ui.cards.showings')
    const theatreId = 812;
    let all_movies

    fetch('https://evening-plateau-54365.herokuapp.com/theatres/812')
    .then(function(response){
        return response.json()
    })
    .then(function(json){
        all_movies = json.showings
        json.showings.forEach(function(movie) {
        showings.insertAdjacentHTML('beforeend',`
            <div class="card">
                <div class="content">
                    <div class="header">
                        ${movie.film.title}
                    </div>
                    <div class="meta">
                        ${movie.film.runtime}
                    </div>
                    <div data-action = "buttonClick", data-id = "${movie.id}", class="description">
                        ${movie.capacity-movie.tickets_sold}
                    </div>
                    <span class="ui label">
                        ${movie.showtime}
                    </span>
                </div>
                <div class="extra content">
                <div data-action = "buttonClick", data-id = "${movie.id}", class="ui blue button">Buy Ticket</div>
            </div>
            </div>
        `)
        })
    })  

    
    document.addEventListener("click", function(e){
        if (e.target.dataset.action === "buttonClick"){
            fetch('https://evening-plateau-54365.herokuapp.com/tickets',{
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body:JSON.stringify({
                    showing_id: e.target.dataset.id
                }) 
            })
        .then(function(response){
            return response.json()
        })
        .then(function(json){
            showings.innerHTML = ""
            all_movies.forEach(function(movie) {
                showings.insertAdjacentHTML('beforeend',`
                    <div class="card">
                        <div class="content">
                            <div class="header">
                                ${movie.film.title}
                            </div>
                            <div class="meta">
                                ${movie.film.runtime}
                            </div>
                            <div data-action = "buttonClick", data-id = "${movie.id}", class="description">
                                ${movie.capacity-movie.tickets_sold}
                            </div>
                            <span class="ui label">
                                ${movie.showtime}
                            </span>
                        </div>
                        <div class="extra content">
                        <div data-action = "buttonClick", data-id = "${movie.id}", class="ui blue button">Buy Ticket</div>
                    </div>
                    </div>
                    `)
                })
            })
        }
    })
});


