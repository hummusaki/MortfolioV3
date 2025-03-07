const confettiWrapper = document.querySelector('.confetti-wrapper');
// Generate confetti
for (let i = 0; i < 50; i++) {
  const confetti = document.createElement('div');
  confetti.classList.add('confetti-piece');
  confetti.style.left = `${Math.random() * 100}%`;
  confetti.style.setProperty('--fall-duration', `${Math.random() * 3 + 3}s`);
  confetti.style.setProperty('--confetti-color', getRandomColor());
  confettiWrapper.appendChild(confetti);
}
function getRandomColor() {
  const colors = ['#ff6347', '#ffa500', '#32cd32', '#1e90ff', '#ff69b4'];
  return colors[Math.floor(Math.random() * colors.length)];
}

document.addEventListener("DOMContentLoaded", setTimeout(function() {
    var elements = document.querySelectorAll("[id='redirect']");
    for (var i = 0; i < elements.length; i++){
        elements[i].style.visibility='visible';
        console.log(elements[i])
    } 
    document.getElementById('redirect').style.visibility = 'visible';
    setTimeout(function() {
        window.location.replace('http://gabmort.me'); 
    }, 3500)
}, 3500));