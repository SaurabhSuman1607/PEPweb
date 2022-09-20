var uid = new ShortUniqueId();
const addBtn=document.querySelector(".Action-btn");
const modalCont=document.querySelector(".model-content");
const textArea=document.querySelector(".textcourt");
const colors=["lightpink" ,"lightgreen" ,"lightBlue" ,"Black" ];
var  modalPriorityColor=colors[colors.length-1];
const mainCont=document.querySelector(".main-cont");
const allPriorityColors=document.querySelectorAll(".priority-color");
const toolBoxColors=document.querySelectorAll(".ToolBox-color-cont>*");
const removebtn=document.querySelector(".fa-xmark");   
let ticketsArr=[];
// console.log(allPriorityColors);
var isModelPresent=false;
addBtn.addEventListener('click' , function() {

    if (!isModelPresent) { 
        // display modal
        modalCont.style.display = "flex";
    }
    
    // case 2 -> if modal is Present
    //           then hide modal

    else if(isModelPresent) {
        // display none
        modalCont.style.display = "none";
    }

    isModelPresent = !isModelPresent;
})


modalCont.addEventListener("keydown", function(e){
     
    if(e.key == "Shift")   
      {
      //1.call createTicket
        console.log(textArea.value);
        createTicket(modalPriorityColor,textArea.value);
      //2.alter display and update isModalPresent
        modalCont.style.display="none";
        isModelPresent=false;
       textArea.value="";
   
      }    
})


  function createTicket(ticketColor , data , ticketId){
      // generate uid
      // let id=uid();
      let id= ticketId || uid();
      let ticketCont=document.createElement("div");
      ticketCont.setAttribute("class" , "ticket-cont");
      ticketCont.innerHTML = `
         <div class="ticket-color ${ticketColor}">  </div>
         <div class="ticket-id"> ${id}   </div>
         <div class="task-Area">${data}  </div>
         <div  class="ticket-lock">
             <i class="fa-solid fa-lock"></i>
         </div>
      `;
      mainCont.appendChild(ticketCont);
  //if ticket is being generated for the first time save it in local Storage
 

  if (!ticketId) {
    ticketsArr.push({
      ticketId: id,
      ticketColor,
      ticketTask: data,
    });
    localStorage.setItem("tickets", JSON.stringify(ticketsArr)); 
// //   }
   handleRemoval(ticketCont , id );
}
  }
 // getting data from localStorage, for re rendering of tickets

if (localStorage.getItem("tickets")) {
  ticketsArr = JSON.parse(localStorage.getItem("tickets"));
  ticketsArr.forEach(ticketObj => createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId))
}

allPriorityColors.forEach(colorElement => {
  //  console.log(colorElement);
  colorElement.addEventListener("click", function () {
      allPriorityColors.forEach(el => {
          el.classList.remove("active");
      })
      colorElement.classList.add("active");
      modalPriorityColor = colorElement.classList[0];
  })
});


    //geting tickets on the basis of ticketColor
  for (let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener("click", function () {
    let currColor = toolBoxColors[i].classList[0];
    let filteredTickets = ticketsArr.filter(ticketObj => ticketObj.ticketColor == currColor);
    // console.log(filteredTickets);


    //remove all tickets
    let allTickets = document.querySelectorAll(".ticket-cont");
    allTickets.forEach(ticket => ticket.remove());

    //display filtered tickets 
    filteredTickets.forEach(ticket => createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId));
 
  })
    
    // display all the tickets of all priorities
   toolBoxColors[i].addEventListener("dblclick", function () {
       
    // remove tickets of specific color from ui
   let allTickets = document.querySelectorAll(".ticket-cont");
       
    allTickets.forEach((ticket) => ticket.remove());

    //display all tickets
   ticketsArr.forEach( ticket => createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId));
  })
}


var isRemoveBtnActive=false;
removebtn.addEventListener('click' , function(e) {

   // case 1: If isremovebtn is not active then make it active
    if (!isRemoveBtnActive) { 
        // display modal
       
       removebtn.style.color="red";
    }
    
    // case 2 -> 
        
        // case 2 -> if isremovebtn is  active then make it inactive
   else if(isRemoveBtnActive) { 
       
        removebtn.style.color="white";
    }
   isRemoveBtnActive=!isRemoveBtnActive;

})
  
 function handleRemoval(ticketCont , id){
  ticketsArr.forEach((ticket) =>{
  ticket.addEventListener("click" , function(){

   if(!isRemoveBtnActive) return;

     // remove from ticketarr
    let idx=getTicketIdx(ticketCont);
     ticketsArr.splice(idx , 1);
     //set in local storage
     localStorage.setItem("tickets" , JSON.stringify(ticketsArr));
      // remove from ui
     ticketCont.remove();
       
  })
  })
 }

   function getTicketIdx(id){
      let idx=ticketsArr.findIndex(ticketObj=>{
      return ticketObj.ticketId==id;
   
     }) 
    return idx;
   }