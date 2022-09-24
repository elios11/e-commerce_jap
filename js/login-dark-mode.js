let isDarkModeEnabled = false;

if (!localStorage.getItem("isDarkModeEnabled")) {
    localStorage.setItem("isDarkModeEnabled", false);
  }
else { isDarkModeEnabled = JSON.parse(localStorage.getItem("isDarkModeEnabled")); }

document.addEventListener("DOMContentLoaded", () => {   
     setTheme();
})

function setTheme() {
    if (isDarkModeEnabled) {
        document.body.classList.add("darkMode");
        document.querySelector(".g_id_signin").setAttribute("data-theme", "filled_black");
    }
}