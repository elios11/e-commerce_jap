let isDarkModeEnabled = false;

if (!localStorage.getItem("isDarkModeEnabled")) {
    localStorage.setItem("isDarkModeEnabled", false);
  }
else { isDarkModeEnabled = JSON.parse(localStorage.getItem("isDarkModeEnabled")); }

document.addEventListener("DOMContentLoaded", () => {   
     setTheme();
})

document.getElementById("themeImg").addEventListener("click", () => {
    isDarkModeEnabled = !isDarkModeEnabled;
    localStorage.setItem("isDarkModeEnabled", isDarkModeEnabled);
    setTheme();
})

function setTheme() {
    if (isDarkModeEnabled) {
        document.body.classList.add("darkMode");
    }
    else {
        document.body.classList.remove("darkMode");
    }
}