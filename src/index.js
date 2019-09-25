let allShowings;
let filmTitle;
let funTime;
let numTickets;
let showTime;
let remainingTickets;

let buttons;
let button;

// buttons.forEach(function(button){

//     button.addEventListener('click', function (e) {
//         console.log('Click')

//     });
// })

fetch('https://evening-plateau-54365.herokuapp.com/theatres/806')
.then(function(response){
    return response.json()
})
.then(function(data){
    allShowings = data.showings
    return allShowings
})
.then(function(allShowings) {
    let showingDiv =  document.querySelector('div.showings');

    allShowings.forEach(function(showing){
        remainingTickets = (showing.capacity) - (showing.tickets_sold)
    

       showingDiv.insertAdjacentHTML('beforeend', `<div class="card">
       <div class="content">
         <div class="header">
           ${showing.film.title}
         </div>
         <div class="meta">
            ${showing.film.runtime} minutes
         </div>
         <div class="description">
            <span data-id = ${showing.id}>${remainingTickets}</span>remaining tickets
         </div>
         <span class="ui label">
            ${showing.showtime}
         </span>
       </div>
       <div class="extra content">
        <div data-id = ${showing.id} class="ui blue button">Buy Ticket</div>
       </div>
     </div>`)

    })
    let buttons = document.querySelectorAll('div.button');

    buttons.forEach(function(button){
        button.addEventListener('click', function (e) {
            num = document.querySelector(`span[data-id = "${e.target.dataset.id}"]`);
            // console.log(e.target.dataset.id)
            // debugger
        
            num = parseInt(remainingTickets)
            if (num > 0) {
                remainingTickets = num - 1
            }



        });
    })
})


const theatreId = 806;






// `<div class="card">
//   <div class="content">
//     <div class="header">
//       (Film Title)
//     </div>
//     <div class="meta">
//       (Runtime) minutes
//     </div>
//     <div class="description">
//       (Num Tickets) remaining tickets
//     </div>
//     <span class="ui label">
//       (Showtime)
//     </span>
//   </div>
//   <div class="extra content">
//     <div class="ui blue button">Buy Ticket</div>
//   </div>
// </div>`


// let filmTitle = showing.film.title;
//         let runTime = showing.film.runtime;
//         let numTickets = showing.film.capacity;
//         let showTime = showing.film.showtime;