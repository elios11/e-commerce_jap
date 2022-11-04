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

//Permite modificar el correo
MODIFY_EMAIL_BTN.addEventListener("click", () => {
    EMAIL.toggleAttribute("disabled");
    checkProfileInfoValidity();
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
    if (LSProfileData[EMAIL.value] && EMAIL.value != userEmail) {
        allValid = false;
        EMAIL.classList.add("invalid-input");
        EMAIL_IN_USE_MSG.classList.add("d-block");
    }
    else {
        EMAIL.classList.remove("invalid-input");
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
        if (!window.confirm("¿Estás seguro de que quieres cambiar los datos de tu perfil?")) {
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
        FIRST_NAME.value = currentUserPath.first_name;
        SECOND_NAME.value = currentUserPath.second_name;
        FIRST_SURNAME.value = currentUserPath.first_surname;
        SECOND_SURNAME.value = currentUserPath.second_surname;
        PHONE_NUMBER.value = currentUserPath.phone_number;
        PROFILE_IMAGE.src = currentUserPath.profile_image;
    }
}