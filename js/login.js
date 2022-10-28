const LOGIN_BUTTON = document.getElementById("loginButton");
const EMAIL_ALERT = document.getElementById("emailAlert");
const PASSWORD_ALERT = document.getElementById("passwordAlert");

LOGIN_BUTTON.addEventListener("click", function() {
    let email = document.getElementById("email");
    let password = document.getElementById("pass");
    let isValidated = true; 

    if (!email.checkValidity()) {
        isValidated = false;
        email.classList.add("invalid-input");
        EMAIL_ALERT.innerHTML = "Por favor ingrese un correo electrónico";
    }
    else {
        EMAIL_ALERT.innerHTML = "";
        email.classList.remove("invalid-input");
    }
    
    if (!password.checkValidity()) {
        if (password.value.length > 0) {
            PASSWORD_ALERT.innerHTML = "La contraseña es incorrecta";
        }
        else {
            PASSWORD_ALERT.innerHTML = "Por favor ingrese su contraseña";
        }
        isValidated = false;
        password.classList.add("invalid-input");
    }
    else {
        PASSWORD_ALERT.innerHTML = "";
        password.classList.remove("invalid-input");

    }

    if (isValidated) {
        localStorage.setItem("userEmail", email.value);
        window.location = "portada.html";
    }
})

function irAPortada(credential) {
    var token = credential.credential;
    var decoded = jwt_decode(token);
    localStorage.setItem("userEmail", decoded.email);
    window.location = "portada.html";
}
