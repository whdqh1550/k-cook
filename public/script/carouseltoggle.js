const hamburgerButton = document.querySelector(".menu-button");
const carousel = document.querySelector("#carouselExampleAutoplaying");

function toggling() {
  let carouselDisplay = window.getComputedStyle(carousel).display;
  console.log(carouselDisplay);
  if (carouselDisplay == "block") {
    carousel.style.display = "none";
  } else {
    carousel.style.display = "block";
  }
}
