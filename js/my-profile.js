const FIRST_NAME = document.getElementById("first-name");
const SECOND_NAME = document.getElementById("second-name");
const FIRST_SURNAME = document.getElementById("first-surname");
const SECOND_SURNAME = document.getElementById("second-surname");
const EMAIL = document.getElementById("email");
const PHONE_NUMBER = document.getElementById("phone-number");
const IMAGE_INPUT = document.getElementById("uploadProfileImage");
const PROFILE_IMAGE = document.getElementById("profile-image");
const SAVE_CHANGES = document.getElementById("saveChangesBtn");
const INVALID_FB_MSG = document.getElementById("invalidDataFB");
const EMAIL_IN_USE_MSG = document.getElementById("emailAlreadyExists");
const MODIFY_EMAIL_BTN = document.getElementById("modifyEmail");

const DELETE_ACCOUNT_PW_FIELD = document.getElementById("deleteAccountPassword");
const DELETE_ACCOUNT_EMAIL_FIELD = document.getElementById("deleteAccountEmail");
const DELETE_ACCOUNT_BTN = document.getElementById("deleteAccountBtn");
let deleteAccountModal = new bootstrap.Modal(document.getElementById("deleteAccountModal"), {});

let LSProfileData = JSON.parse(localStorage.getItem("profile-data"));

document.addEventListener("DOMContentLoaded", () => {
    if (!userEmail) {
        document.querySelector("main").innerHTML = `
        <div class="alert alert-warning lead text-center w-50 mt-5" role="alert">
            Para ver su perfil, por favor
            <a href="index.html" class="alert-link">inicie sesión</a>.
        </div>
        `
        return false;
    }
    EMAIL.value = userEmail;
    fillDataFromLocalStorage();
})

//Habilita el campo de modificación de correo electrónico
MODIFY_EMAIL_BTN.addEventListener("click", () => {
    EMAIL.removeAttribute("disabled");
})

//Transforma imagen elegida en el input a URL
IMAGE_INPUT.addEventListener("change", () => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(IMAGE_INPUT.files[0]);

    fileReader.addEventListener("load", () => {
        const imageURL = fileReader.result;
        PROFILE_IMAGE.src = imageURL;
    })
})

//Verifica si los campos obligatorios fueron validados
function checkProfileInfoValidity() {
    let allValid = true;
    if (!FIRST_NAME.checkValidity()) {
        allValid = false;
        FIRST_NAME.classList.add("invalid-input");
        INVALID_FB_MSG.classList.add("d-block");
    }
    else {
        FIRST_NAME.classList.remove("invalid-input");
    }
    if (!FIRST_SURNAME.checkValidity()) {
        allValid = false;
        FIRST_SURNAME.classList.add("invalid-input");
        INVALID_FB_MSG.classList.add("d-block");
    }
    else {
        FIRST_SURNAME.classList.remove("invalid-input");
    }
    if (!EMAIL.checkValidity()) {
        allValid = false;
        EMAIL.classList.add("invalid-input");
        INVALID_FB_MSG.classList.add("d-block");
    }
    else {
        EMAIL.classList.remove("invalid-input");
    }
    if (LSProfileData !== null && LSProfileData[EMAIL.value] && EMAIL.value != userEmail) {
        allValid = false;
        EMAIL.classList.add("invalid-input");
        EMAIL_IN_USE_MSG.classList.add("d-block");
    }
    else {
        EMAIL_IN_USE_MSG.classList.remove("d-block");
    }
    if (allValid) {
        INVALID_FB_MSG.classList.remove("d-block");
    }
    return allValid;
}

//Chequea validación con evento input en los campos obligatorios
function continuallyCheckValidity() {
    const requiredInputs = [FIRST_NAME, FIRST_SURNAME, EMAIL];
    requiredInputs.forEach(element => {
        element.addEventListener("input", () => {
            checkProfileInfoValidity();
        })
    })
}

//Guarda información de usuario en el localStorage
SAVE_CHANGES.addEventListener("click", () => {
    if (checkProfileInfoValidity()) {
        if (!window.confirm("¿Estás segur@ de que quieres cambiar los datos de tu perfil?")) {
            return false;
        }
        const successMessage = document.getElementById("successMessage");
        let profileData = {};
        if (LSProfileData) {
            profileData = LSProfileData;
        }
        if (userEmail != EMAIL.value) {
            delete profileData[userEmail];
        }
        profileData[EMAIL.value] = {
            "first_name": FIRST_NAME.value,
            "second_name": SECOND_NAME.value,
            "second_surname": SECOND_SURNAME.value,
            "first_surname": FIRST_SURNAME.value,
            "second_surname": SECOND_SURNAME.value,
            "phone_number": PHONE_NUMBER.value,
            "profile_image": PROFILE_IMAGE.src
        }
        localStorage.setItem("userEmail", EMAIL.value);
        localStorage.setItem("profile-data", JSON.stringify(profileData));

        successMessage.innerHTML = "¡Tus datos se actualizaron correctamente!";
        successMessage.classList.remove("d-none");
        setTimeout(() => {
            showSpinner();
        }, 1000)
        setTimeout(() => {
            window.location = "my-profile.html";
        }, 2200)
    }
    else {
        continuallyCheckValidity();
    }
})

//Rellena campos de datos si ya fueron guardados anteriormente
function fillDataFromLocalStorage() {
    if (LSProfileData) {
        let currentUserPath = LSProfileData[userEmail];
        if (currentUserPath) {
            FIRST_NAME.value = currentUserPath.first_name;
            SECOND_NAME.value = currentUserPath.second_name;
            FIRST_SURNAME.value = currentUserPath.first_surname;
            SECOND_SURNAME.value = currentUserPath.second_surname;
            PHONE_NUMBER.value = currentUserPath.phone_number;
            PROFILE_IMAGE.src = currentUserPath.profile_image;
        }
    }
}

document.getElementById("deleteAccountModal").addEventListener("input", () => {
    if (DELETE_ACCOUNT_EMAIL_FIELD.value.length > 0 && DELETE_ACCOUNT_PW_FIELD.value.length > 0) {
        DELETE_ACCOUNT_BTN.removeAttribute("disabled");
    }
    else {
        DELETE_ACCOUNT_BTN.setAttribute("disabled", "");
    }
})


DELETE_ACCOUNT_BTN.addEventListener("click", () => {
    let pwInvalidFeedback = document.getElementById("pwInvalidFeedback");
    let deletedAccountAlert = document.getElementById("deletedAccountAlert");
    let validatedFields = true;

    document.getElementById("deleteAccountModal").classList.add("hidden");
    if (DELETE_ACCOUNT_EMAIL_FIELD.value !== userEmail) {
        validatedFields = false;
        DELETE_ACCOUNT_EMAIL_FIELD.classList.add("invalid-input");
        document.querySelector("#deleteAccountEmail + .invalid-feedback").classList.add("d-block");
    }
    else {
        DELETE_ACCOUNT_EMAIL_FIELD.classList.remove("invalid-input");
        document.querySelector("#deleteAccountEmail + .invalid-feedback").classList.remove("d-block");
    }
    if (!DELETE_ACCOUNT_PW_FIELD.checkValidity()) {
        validatedFields = false;
        if (DELETE_ACCOUNT_PW_FIELD.length > 0) {
            pwInvalidFeedback.innerHTML = "Tienes que ingresar tu contraseña";
        }
        else {
            pwInvalidFeedback.innerHTML = "La contraseña ingresada es incorrecta";
        }
        DELETE_ACCOUNT_PW_FIELD.classList.add("invalid-input");
        pwInvalidFeedback.classList.add("d-block");
    }
    else {
        DELETE_ACCOUNT_PW_FIELD.classList.remove("invalid-input");
        pwInvalidFeedback.classList.remove("d-block");
    }

    if (validatedFields) {
        let userCartData = JSON.parse(localStorage.getItem("storedCartProducts"));
        let userProfileData = JSON.parse(localStorage.getItem("profile-data"));
        
        if (userCartData[userEmail]) {
            delete userCartData[userEmail];
            localStorage.setItem("storedCartProducts", JSON.stringify(userCartData));
        }
        if (userProfileData[userEmail]) {
            delete userProfileData[userEmail];
            localStorage.setItem("profile-data", JSON.stringify(userProfileData));
        }

        deleteAccountModal.hide();
        deletedAccountAlert.innerHTML = "Tu cuenta ha sido eliminada con éxito."
        deletedAccountAlert.classList.remove("d-none");
        setTimeout(() => {
            showSpinner();
        }, 1200)
        setTimeout(() => {
            logout();
            window.location = "index.html";
        }, 2000)
    }
})