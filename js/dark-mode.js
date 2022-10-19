let isDarkModeEnabled = false;

if (!localStorage.getItem("isDarkModeEnabled")) {
    localStorage.setItem("isDarkModeEnabled", false);
  }
else { isDarkModeEnabled = JSON.parse(localStorage.getItem("isDarkModeEnabled")); }

//Intercambia modo oscuro y modo claro
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("themeImg").addEventListener("click", () => {
        isDarkModeEnabled = !isDarkModeEnabled;
        localStorage.setItem("isDarkModeEnabled", isDarkModeEnabled);
        setTheme();
    })
    setTheme();
})

function setTheme() {
    if (isDarkModeEnabled) {
        if (document.querySelector(".jumbotron")) {
            document.querySelector(".jumbotron").style.backgroundImage="url(img/cover_back-dark.png)";
        }
        document.getElementById("themeImg").src = "img/bx-sun.svg";
        document.body.classList.add("darkMode");
        document.querySelector("nav").classList.remove("navbar-light");
        document.querySelector("nav").classList.add("navbar-dark");

        document.querySelectorAll(".bg-light").forEach(element => {
            element.classList.remove("bg-light");
            element.classList.add("bg-dark");
        });

        document.querySelectorAll(".card").forEach(element => {
            element.classList.add("bg-dark");
        });

        document.querySelector("nav").classList.add("bg-dark");
        
        document.querySelectorAll(".btn-light").forEach(element => {
            element.classList.remove("btn-light");
            element.classList.add("btn-dark");
        });

        document.querySelectorAll(".btn-close").forEach(element => {
            element.classList.add("btn-close-white");
        });
    }
    else {
        if (document.querySelector(".jumbotron")) {
            document.querySelector(".jumbotron").style.backgroundImage="url(img/cover_back.png)";
        }
        document.getElementById("themeImg").src = "img/bx-moon.svg";
        document.body.classList.remove("darkMode");
        document.querySelector("nav").classList.remove("navbar-dark");
        document.querySelector("nav").classList.add("navbar-light");

        document.querySelectorAll(".bg-dark").forEach(element => {
            element.classList.remove("bg-dark");
            element.classList.add("bg-light");
        });

        document.querySelectorAll(".btn-close").forEach(element => {
            element.classList.remove("btn-close-light");
        });

        document.querySelectorAll(".btn-dark").forEach(element => {
            element.classList.remove("btn-dark");
            element.classList.add("btn-light");
        });
    }
}