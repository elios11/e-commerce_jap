let loginButton = document.getElementById("loginButton");
let dataAlert = document.querySelector(".dataAlert");

loginButton.addEventListener("click", function() {
    let email = document.getElementById("email");
    let password = document.getElementById("pass");

    if (email.value !== "" && password.value !== "") {
        localStorage.setItem("userEmail", email.value);
        window.location = "portada.html";
    }
    else {
        dataAlert.innerHTML = "Por favor rellene todos los campos";
    }
})

function irAPortada(credential) {
    var token = credential.credential;
    var decoded = jwt_decode(token);
    localStorage.setItem("userEmail", decoded.email);
    window.location = "portada.html";
}
