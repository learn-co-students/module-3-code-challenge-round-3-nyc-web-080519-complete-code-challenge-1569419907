const theatreId = null;
let allShowings = [];
// main.querySelector(`[data-movie-id="${movie.id}"]`)
document.addEventListener("DOMContentLoaded", function(){
    fetch("https://evening-plateau-54365.herokuapp.com/theatres/801`")
    .then(convertJson)
    .then(renderMovies)

    document.addEventListener("click", function(e){
        if (e.target.innerText == "Buy Ticket") { // padding makes this work if the button is not clicked.
            // console.log(e)
            fetch("https://evening-plateau-54365.herokuapp.com/tickets",{
                method: "POST",
                headers: 
                {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify(
                {
                    showing_id: e.target.dataset.movieid
                })
            })
            .then(response => response.json())
            .then(function(){
                newValue = parseInt(e.target.previousElementSibling.innerText) - 1
                if(newValue < 1 ){
                    alert("We're Sorry No Seats Available")
                }
                else{
                    e.target.previousElementSibling.innerText = `${newValue}  Seats Left`
                }
                
            }) //closes then
        } //closes IF
    }) //closes click
})// closes domcontentloaded

function convertJson(response){ 
    // console.log(response)
    return response.json()
}

function renderMovies(theater){
    // console.log(theater)
    theater.showings.forEach(renderOneMovie)
}

function renderOneMovie(movie){
    allShowings.push(movie)
    let str = 
    `<div class="card">
        <div class="content">
            <div class="title">
                ${movie.film.title}
            </div>

            <div class="runtime">
                ${movie.film.runtime} Minutes Long
            </div>
            <span class="ui label">
                ${movie.showtime}
            </span>

            <div class="capactiy">
                ${movie.capacity - movie.tickets_sold} Seats Left
            </div>
            
            <div data-movieid=${movie.id} class="ui blue button">Buy Ticket</div>
        </div>
        
    </div>`
document.querySelector("body > div.ui.cards.showings").insertAdjacentHTML("beforeend", str)
}

// function disableButton(movie){
//     if (movie.capacity === 0) {
//         e.target.innerText = "Sold Out"
//         e.target.disabled = "true"
//     }
//     else {
//         e.target.previousElementSibling.innerText = `${newValue}  Seats Left`
//     }
// }