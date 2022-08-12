let loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", function() {
    let email = document.getElementById("email");
    let password = document.getElementById("pass");
    
    if (email.value !== "" && password.value !== "") {
        window.location = "portada.html";
    }
})