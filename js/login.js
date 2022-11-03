const LOGIN_BUTTON = document.getElementById("loginButton");
const EMAIL_ALERT = document.getElementById("emailAlert");
const PASSWORD_ALERT = document.getElementById("passwordAlert");

function validateLoginFields() {
    let email = document.getElementById("email");
    let password = document.getElementById("pass");
    let isValidated = true; 

    if (!email.checkValidity()) {
        if (email.value.length > 0) {
            EMAIL_ALERT.innerHTML = "Ingrese un correo electrónico válido";
        }
        else {
            EMAIL_ALERT.innerHTML = "Por favor ingrese un correo electrónico";
        }
        isValidated = false;
        email.classList.add("invalid-input");
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
    return isValidated;
}

LOGIN_BUTTON.addEventListener("click", () => {
    if (validateLoginFields()) {
        localStorage.setItem("userEmail", email.value);
        window.location = "portada.html";
    }
    updateValidation();
})

function updateValidation() {
    document.querySelectorAll("#loginForm input").forEach(element => {
        element.addEventListener("input", () => {
            validateLoginFields();
        })
    })
}

function irAPortada(credential) {
    var token = credential.credential;
    var decoded = jwt_decode(token);
    localStorage.setItem("userEmail", decoded.email);
    window.location = "portada.html";
}
