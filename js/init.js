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

let showSpinner = function() {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function() {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url) {
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

function logout() {
  localStorage.removeItem("userEmail");
}

//Muestra el correo electrónico del login en la barra de navegación y dropdown de acceso a
//otras páginas del e-commerce y cierre de sesión
document.addEventListener("DOMContentLoaded", function() {
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
    navBarUl.innerHTML += `
    <li class="dropdown nav-item">
      <button class="btn dropdown-toggle nav-item userProfileButton" type="button" id="showUserEmail"
      data-bs-toggle="dropdown" aria-expanded="false">${userEmail}</button>
      <ul class="dropdown-menu dropdown-menu-end">
        <a class="dropdown-item d-flex justify-content-between align-items-center" href="my-profile.html">
            Mi perfil
            <i class="fas fa-user nav-link ps-5"></i>
        </a>
        <a class="dropdown-item d-flex justify-content-between align-items-center" href="cart.html">
            Carrito
            <i class="fas fa-shopping-cart nav-link ps-5"></i>
        </a>
        <a onclick="logout()" class="dropdown-item d-flex justify-content-between align-items-center"
        href="index.html">
            Cerrar sesión
            <i class="fas fa-sign-out-alt nav-link ps-5"></i>
        </a>
      </ul>
    </li>
    `
  }
  else {
    navBarUl.innerHTML += `
    <li class="nav-item"><a class="nav-link" href="index.html">Iniciar sesión</a></li>
    `
  }
})