let loginButton = document.getElementById("loginButton");
let alertaDatos = document.getElementById("alertaDatos");

loginButton.addEventListener("click", function() {
    let email = document.getElementById("email");
    let password = document.getElementById("pass");
    
    if (email.value !== "" && password.value !== "") {
        window.location = "portada.html";
    }
    else {
        alertaDatos.innerHTML = "Por favor rellene todos los campos";
    }
})

function irAPortada() {
    window.location = "portada.html";
}