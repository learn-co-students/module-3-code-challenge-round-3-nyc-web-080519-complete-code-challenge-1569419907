// const theatreId = 803;
// const url = "https://evening-plateau-54365.herokuapp.com/theatres/803";
// const showingContainer = document.querySelector("div.ui.cards.showings");
document.addEventListener('DOMContentLoaded', () => {
    renderMovies()
    buyTix()
})


// As a user, when the page loads I should see a list of movie showings fetched from a remote API.
// populating the showingContainer with the movies
function renderMovies(){
    const url = "https://evening-plateau-54365.herokuapp.com/theatres/803";
    const showingContainer = document.querySelector("div.ui.cards.showings");
    fetch(url)
    .then(resp => resp.json())
    .then(function(theatre){
        const movies = theatre.showings;
        movies.forEach(function(movie){
            let movieDiv = document.createElement('div');
            movieDiv.dataset.id = movie.id;
            movieDiv.className = "card";
            movieDiv.innerHTML = `
                <div class="content" data-id=${movie.id}>
                    <div class="header">
                        ${movie.film.title}
                    </div>

                    <div class="meta">
                        ${movie.film.runtime} minutes
                    </div>

                    <div data-action='buy-tix' class="description">
                        ${(movie.capacity - movie.tickets_sold)} remaining tickets
                    </div>

                    <span class="ui label">
                        ${movie.showtime}
                    </span>

                </div>
                <div data-id=${movie.id} class="extra content">
                    <div class="ui blue button">Buy Ticket</div>
                </div>
            `
            // if the movie is sold out, we should not put in the btn, and
            // just change the inner HTML to sold out.
            if ((movie.capacity - movie.tickets_sold) === 0){
                movieDiv.querySelector('div.extra.content').innerHTML = "Sold Out"
            }
            // adding the movieDiv to the showingContainer
            showingContainer.insertAdjacentElement('beforeend', movieDiv);
        })
    })
}

// As a user, clicking on the 'Buy Ticket' button should purchase a ticket and decrement the remaining tickets by one.
// This information should be persisted in the remote API
// As a user I should not be able to purchase a ticket for a sold out showing.
// The 'Buy Ticket' button should be disabled on sold out showings, and the text should change to "sold out".
// buy tickets and then make a POST request to the API
function buyTix(){
    const showingContainer = document.querySelector("div.ui.cards.showings");
    showingContainer.addEventListener("click", function(event){
        if (event.target.innerText === "Buy Ticket"){
            let movieId = event.target.parentElement.dataset.id;
            let movieCard = document.querySelector(`[data-id="${movieId}"]`);
            let numDiv = movieCard.querySelector("[data-action='buy-tix']");
            let numTix = movieCard.querySelector("[data-action='buy-tix']").innerText;
            let num = parseInt(numTix);
            // once we hit zero, we need to change the btn.
            // changes after we hit zero... hmmm
            if(num < 1){
                let btnParent = event.target.parentElement
                // instead of disabling the btn, just remove the btn...
                event.target.remove()
                btnParent.innerHTML = "Sold Out"
            } else {
                // if num is not zero, we can keep decremetning and 
                // changing the num.
                num -= 1;
                if (num === 0){
                    let btnParent = event.target.parentElement
                    // instead of disabling the btn, just remove the btn...
                    event.target.remove()
                    btnParent.innerHTML = "Sold Out"
                }
                numDiv.innerHTML = `${num} remaining tickets`
                // this will fetch a post request!
                postTix(movieId)
            }
        }
    })
}

// fetch a post req to the movie
// helper method for buyTix
// This information should be persisted in the remote API.
function postTix(movieId){
    const url = "https://evening-plateau-54365.herokuapp.com/tickets";
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            showing_id: movieId
        })
    })
    .then(resp => resp.json())
}