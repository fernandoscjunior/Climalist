//Gets Theme switch button from html and document body, adds an event listener that switches to dark mode
const themeButton = document.getElementById("theme-switch");
const body = document.body;

//Gets logo and replace it with the dark mode counterpart in the 'if'
const logo = document.querySelector(".logo");
const modeButton = document.querySelector(".mode");
const celsiusButton = document.querySelector(".celsius");

if (localStorage.getItem("mode") == "dark"){
  body.classList.toggle('dark-mode');
  logo.src = "images/logo-dark.svg";
  modeButton.src = "images/dark-mode-sun.svg";

} else if (localStorage.getItem("mode" == "light")) {
  body.classList.toggle('light-mode');
  logo.src = "images/logo-light.svg";
  modeButton.src = "images/light-mode-sun.svg";
  localStorage.setItem("mode", "light")
}

themeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (logo.src.includes("images/logo-light.svg")) {
        logo.src = "images/logo-dark.svg";
        modeButton.src = "images/dark-mode-sun.svg";
        localStorage.setItem("mode", "dark");

      } else {
        logo.src = "images/logo-light.svg";
        modeButton.src = "images/light-mode-sun.svg";
        localStorage.setItem("mode", "light")

      }
});