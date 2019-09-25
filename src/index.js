const theatreId = 802;
const contrainer = document.querySelector(".ui.cards.showings")
let movies;

fetch(`https://evening-plateau-54365.herokuapp.com/theatres/${theatreId}`)
.then(response => response.json())
.then(renderMovies)

function renderMovies(theatre) {
    movies = theatre.showings
    movies.forEach(function(movie) {
        let html = 
        `<div class="card">
            <div class="content">
                <div class="header">${movie.film.title}</div>
                <div class="meta">${movie.film.runtime} minutes</div>
                <div class="description" data-showing-id="${movie.id}">${movie.capacity - movie.tickets_sold} remaining tickets</div>
                <span class="ui label">${movie.showtime}</span>
            </div>
            <div class="extra content" data-movie-id="${movie.id}">
                <div class="ui blue button" data-movie-id="${movie.id}">Buy Ticket</div>
            </div>
        </div>`

        contrainer.insertAdjacentHTML("beforeend", html)
    })
    console.log(theatre)
}

contrainer.addEventListener("click", function(event) {
    if (event.target.innerHTML === "Buy Ticket") {
        let showing_id = parseInt(event.target.dataset.movieId)
        let movie = movies.find(function(movie) {return movie.id === showing_id})
        let remaining =document.querySelector(`[data-showing-id="${showing_id}"]`)
        // debugger
        // console.log(document.querySelector(`[data-showing-id="${showing_id}"]`))

        // remaining.innerHTML = ''

        fetch(`https://evening-plateau-54365.herokuapp.com/tickets`, {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'    
            },
            body: JSON.stringify({showing_id: showing_id})
        })
        .then(response => response.json())
        .then(function(data) {
            if (movie.tickets_sold < movie.capacity) {
                remaining.innerHTML = ''
                movie.tickets_sold++
                remaining.insertAdjacentHTML("beforeend", `<div class="description" data-showing-id="{${movie.id}}">${movie.capacity - movie.tickets_sold} remaining tickets</div>`)
            } else {
                document.querySelector(`[data-movie-id="${showing_id}"]`).innerHTML = ''
                alert("This movie is sold out")
                document.querySelector(`[data-movie-id="${showing_id}"]`).insertAdjacentHTML("beforeend",
                `<div class="extra content" data-movie-id="${movie.id}">Sold Out</div>`)
            }
        })
    }
})
