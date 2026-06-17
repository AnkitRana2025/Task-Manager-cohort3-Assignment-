const steps = document.querySelectorAll(".step");
const infoBox = document.querySelector(".info-box");

steps.forEach(step => {

  step.addEventListener("click", () => {

    // remove active
    steps.forEach(s => s.classList.remove("active"));

    // add active
    step.classList.add("active");

    // show info
    infoBox.textContent = step.dataset.info;

  });

});
let i = 0;

setInterval(() => {

  steps.forEach(s => s.classList.remove("active"));

  steps[i].classList.add("active");

  infoBox.textContent = steps[i].dataset.info;

  i = (i + 1) % steps.length;

}, 2000);