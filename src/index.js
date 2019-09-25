const theatreId = 808;
const BASEURL = `https://evening-plateau-54365.herokuapp.com/theatres/${theatreId}`;
const POSTURL = "https://evening-plateau-54365.herokuapp.com/tickets"

const showingsPage = document.querySelector("body > div.ui.cards.showings");

// Get all showings from api
fetch(BASEURL)
.then(resp => resp.json())
.then(response => {
    response.showings.forEach(showing => {
        const ticketsLeft = showing.capacity - showing.tickets_sold;
        const buyTicketClass = (ticketsLeft === 0) ? "" : "ui blue button"
        showingsPage.insertAdjacentHTML("beforeend",
            `
            <div class="card">
                <div class="content">
                    <div class="header">
                        ${showing.film.title}
                    </div>
                    <div class="meta">
                        ${showing.film.runtime} minutes
                    </div>
                    <div class="description">
                        ${ticketsLeft} remaining tickets
                    </div>
                    <span class="ui label">
                        ${showing.showtime}
                    </span>
                </div>
                <div class="extra content">
                    <div class="${buyTicketClass}" data-showing-id="${showing.id}">
                        ${(ticketsLeft) === 0 ? "Sold Out" : "Buy Tickets"}
                    </div>
                </div>
            </div>
            `
        )
    })
});

// Buy Ticket functionality
showingsPage.addEventListener("click", e => {
    // If we are clicking on "Buy Ticket" button
    if(e.target.dataset.showingId){
        const card = e.target.closest("div.card");
        const description = card.querySelector(".description")
        // Create a NewTicket Object
        fetch(POSTURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                showing_id: e.target.dataset.showingId
            })
        })
        .then(resp => resp.json())
        .then(() => {
            // Render new ticket amount
            if(parseInt(description.innerText) > 1){
                description.innerText = `${parseInt(description.innerText) - 1} remaining tickets`;
            }else{
                description.innerText = "0 remaining tickets";
                e.target.innerHTML = "Sold Out";
                e.target.className = "";
            }
        })
    }
});