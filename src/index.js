const theatreId = null;
const cardShowings = document.querySelector("body > div.ui.cards.showings")
const buttonArea = document.querySelector("body > div.ui.cards.showings > div:nth-child(1) > div.extra.content")
const eachID = document.querySelector("#\\38 117")
const runTime = document.querySelector("body > div.ui.cards.showings > div:nth-child(1) > div:nth-child(1) > div.meta")
const ticketsLeft = document.querySelector("body > div.ui.cards.showings > div:nth-child(1) > div:nth-child(1) > div.description")



fetch("https://evening-plateau-54365.herokuapp.com/theatres/811")
.then(resp => resp.json())
.then(function(data){
    data.showings.forEach(function(movie){
       let ticketsRemaining = parseInt(movie.capacity) - parseInt(movie.tickets_sold)
        const str =
        `
        <div class="card">
            <div class="content">
                <div class="header" id=${movie.id}>
                ${movie.film.title}
                </div>
                <div class="meta">
                ${movie.film.runtime} minutes
                </div>
                <div class="description">
                ${ticketsRemaining} tickets left
                </div>
                <span class="ui label">
                Showing at: ${movie.showtime}
                </span>
            </div>
            <div class="extra content">
                <div class="ui blue button" id=${movie.id}>Buy Ticket</div>
            </div>
        </div>
        `
        cardShowings.insertAdjacentHTML("afterbegin", str)
      
    })

    cardShowings.addEventListener("click", function(event){
            event.preventDefault()
            if(event.target.id === eachID && ticketsLeft.innerText != 0){ //find event target
                //must be equal to parentElement --> childElement.id // && parseInt()

                //&& movie.capacity > movie.tickets_sold
                ticketsRemaining - 1
            }
            //let thatShowing = {showing_id: `${event.target.id}`}
            fetch("https://evening-plateau-54365.herokuapp.com/tickets", {
                //how to post to a non existing get?
                //make new elements for different show page..?

                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: ({showing_id: `${event.target.id}`})
                //can't send data.
            .then(resp => resp.json())
            .then(function(showing){
                //if not sold out add to tickets index
                const string = 
                `
                <p>number</p>
                <p>showing_id</p>
                <p>current date</p>
                `
                //if sold out produce error

            cardShowings.insertAdjacentHTML("afterbegin", string)
            })
                
            })

        })

})//end of first fetch




 
