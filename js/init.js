const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";
let navBarUl = document.getElementById("navBarUl");
let userEmail = "";
let darkMode = false;

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//Muestra el correo electrónico del login en la barra de navegación
document.addEventListener("DOMContentLoaded", function() {
  if (sessionStorage.getItem("userEmail")) {
    userEmail = sessionStorage.getItem("userEmail");
    navBarUl.innerHTML += `
    <li class="dropdown nav-item">
      <button class="btn dropdown-toggle nav-item userProfileButton" type="button" id="showUserEmail"
      data-bs-toggle="dropdown" aria-expanded="false">${userEmail}</button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
        <li><a class="dropdown-item" href="cart.html">Carrito</a></li>
        <li><a onclick="logout()" class="dropdown-item" href="index.html">Cerrar sesión</a></li>
      </ul>
    </li>
    `
  }
  else {
    navBarUl.innerHTML += `
    <li class="nav-item"><a class="nav-link" href="index.html">Iniciar sesión</a></li>
    `
  }
  document.getElementById("themeImg").addEventListener("click", () => {
    console.log("hola");
    darkMode = !darkMode;
    toggleTheme();
  })
  toggleTheme();
})

function logout() {
    sessionStorage.removeItem("userEmail");
}

function toggleTheme() {
  if (darkMode) {
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
  }
  else {
    document.getElementById("themeImg").src = "img/bx-moon.svg";
    document.body.classList.remove("darkMode");
    document.querySelector("nav").classList.remove("navbar-dark");
    document.querySelector("nav").classList.add("navbar-light");

    document.querySelectorAll(".bg-dark").forEach(element => {
      element.classList.remove("bg-dark");
      element.classList.add("bg-light");
    });

    document.querySelectorAll(".btn-dark").forEach(element => {
      element.classList.remove("btn-dark");
      element.classList.add("btn-light");
    });
  }
}