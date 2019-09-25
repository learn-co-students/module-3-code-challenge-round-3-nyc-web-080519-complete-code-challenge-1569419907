window.addEventListener('DOMContentLoaded', (event) => {
    const theatreId = 809;
    const showingsList = document.querySelector("div.ui.cards.showings")
    
    fetch(`https://evening-plateau-54365.herokuapp.com/theatres/${theatreId}`)
    .then(response => response.json())
    .then(json => listTheatres(json))

    showingsList.addEventListener("click", function(e) {
        if (e.target.className === "ui blue button") {
            fetch(`https://evening-plateau-54365.herokuapp.com/tickets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    showing_id: e.target.dataset.showing_id
                })
            }).then(response => response.json())
            .then(json => adjustRemainingTickets(json))
        }
    })

    function listTheatres(theatre) {
        theatre.showings.forEach(function(showing) {
            let buttonStatus = ""
            let buttonText = ""
            if (showing.capacity - showing.tickets_sold < 1) {
                buttonStatus = "disabled"
                buttonText = "Sold Out"
            }
            else {
                buttonStatus = "blue"
                buttonText = "Buy Ticket"
            }
            showingsList.insertAdjacentHTML("beforeend", 
            `<div class="card">
            <div class="content">
                <div class="header">
                ${showing.film.title}
                </div>
                <div class="meta">
                Runtime: ${showing.film.runtime} Minutes
                </div>
                <div class="description">
                Remaining Tickets: ${showing.capacity - showing.tickets_sold}
                </div>
                <span class="ui label">
                Showtime: ${showing.showtime}
                </span>
            </div>
            <div class="extra content">
                <div class="ui ${buttonStatus} button" data-showing_id="${showing.id}">${buttonText}</div>
            </div>
            </div>`)
        })
    }

    function adjustRemainingTickets(ticket) {
        const myCard = showingsList.querySelector(`[data-showing_id="${ticket.showing_id}"]`).closest(".card")
        const myButton = myCard.querySelector(".ui.blue.button")
        const currentDesc = myCard.querySelector(".description").innerHTML
        let currentNum = parseInt(currentDesc.split(":")[1])
        myCard.querySelector(".description").innerHTML = `Remaining Tickets: ${currentNum - 1}`
        if (currentNum <= 1) {
            myButton.innerText = "Sold Out"
            myButton.className = "ui disabled button"
        }
    }
});


