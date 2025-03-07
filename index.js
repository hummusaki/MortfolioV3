let isModalOpen = false;
let contrastToggle = false;
const scaleFactor = 1 / 20;
const favicon = document.getElementById("favicon");
const tod = document.getElementById("tod");
var hours = (new Date()).getHours();

function getTOD() {
  if (hours >= 12 && hours <= 17){
    return "Good afternoon,";
  } else if (hours > 17 && hours < 23){
    return "Good evening,";
  } else if (hours >= 6 && hours < 12 ){
    return "Good morning,";
  } else{
    return "Hey,";
  }
}

// time of day func
document.addEventListener("DOMContentLoaded", function() {
  if (tod) { // error prevention
    tod.innerText = getTOD();
    console.log(hours);
  }
  else{
    tod.innerText = "Hey,";
  }
});



AOS.init(); // Initialize AOS plugin
// AOS = Animate On scroll

function toggleContrast() {
  // Light mode toggler
  contrastToggle = !contrastToggle;
  if (contrastToggle) {
    document.body.classList += " dark-theme";
    favicon.setAttribute("href", "/assets/m.png");
  } else {
    document.body.classList.remove("dark-theme");
    favicon.setAttribute("href", "/assets/m2.png");
  }
}

// Decoration stuff (ignore)

function openModal() {
  // Toggle contact modal
  isModalOpen = true;
  document.body.classList += " modal--open";
  window.scrollTo(0, 0);
}

function closeModal() {
    isModalOpen = false;
    document.body.classList.remove("modal--open");
}

function toggleModal() {
  if (isModalOpen) {
    closeModal();
  }
  else {
    openModal();
  }
}



document.addEventListener('keydown', function(event){
  if(event.key == "Escape"){
    closeModal();
  }
});