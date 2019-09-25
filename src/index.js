document.addEventListener("DOMContentLoaded", () => {

    const showingsUL = document.querySelector(".showingsUL")
    const cards = document.querySelector(".showings")
    const theatreId = 816;
    let data = []

    getMovies().then(theatre => {
        data = theatre.showings
        renderAllMovies(data)
    })


    function getMovies() {
        return fetch(`https://evening-plateau-54365.herokuapp.com/theatres/${theatreId}`)
        .then(resp => resp.json())
    }


    function renderAllMovies(moviesArray) {
        while (showingsUL.firstChild) {
            showingsUL.removeChild(showingsUL.firstChild)
            console.log("removed")
        }
        // debugger
        // showingsUL.innerHTML = ""

        moviesArray.forEach(movie => {  // for each movie...
            // show relevant info...
            showingsUL.insertAdjacentHTML("beforeend", `
                <li id=${movie.id}>
                Movie Name: ${movie.film.title} <br>
                Showtime: ${movie.showtime} <br>
                </li>
            `)


            // I didnt see that there was specific formatting provided for us,
            // so I built my own. I started at the end to try and rebuild it 
            //  with the given code but I ran out of time

                // < div class="card" >
                //     <div class="content">
                //         <div class="header">
                //             ${movie.film.title}
                //         </div>
                //         <div class="meta">
                //             ${movie.film.runtime} minutes
                //         </div>
                //         <span class="ui label">
                //             ${movie.showtime}
                //         </span>
                //     </div>
                //     <div class="extra content">
                //         <div class="ui blue button">Buy Ticket</div>
                //     </div>
                // </div >




            // and render the buy tix button if not sold out
            let tixRemaining = movie.capacity - movie.tickets_sold

            // console.log(movie)
            // console.log(tixRemaining)

            if (tixRemaining > 0) {
                showingsUL.insertAdjacentHTML("beforeend", `
                    <p id="${movie.id}"> tickets remaining: ${ tixRemaining } </p>
                    <button class="buyBtn" id="${movie.id}"> Buy Ticket! </button> <br><br>
                `)
            } else {
                showingsUL.insertAdjacentHTML("beforeend", `
                    Sold Out! <br><br>
                `)
            }
        })
    }




    function buyTicket(movieID) {
        movieOBJ = data.find(movie => { return movie.id === parseInt(movieID) })
        newSold = movieOBJ.tickets_sold + 1
        // debugger
        return fetch("https://evening-plateau-54365.herokuapp.com/tickets", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({showing_id: movieID, tickets_sold: newSold})
        })
    }


    document.addEventListener("click", e => {
        let pTag = e.target.previousElementSibling
        // debugger
        buyTicket(e.target.id)
        .then(result => {
            movie = data.find(movie => { return movie.id === parseInt(e.target.id) })
            movieTix = movie.capacity - movie.tickets_sold
            pTag.innerText = `tickets remaining: ${movieTix}`
            console.log("hi")
            // debugger
            renderAllMovies(data)
        })
        .then(console.log("done"))
    })
    

})