let userID = 25801;
const USER_CART = CART_INFO_URL + userID + EXT_TYPE;
let userCartArray = [];
const CART_CONTAINER = document.getElementById("cart");

// Obtiene json a partir de url y agrega su contenido a un array
async function getCartData() {
    const cartRes = await fetch(USER_CART);
    const cartData = await cartRes.json();
    userCartArray = cartData;
    updateFromLocalStorage(userCartArray);
    showUserCart(userCartArray);
    updateSubtotal(userCartArray);
    removeItemFromCartBtn(userCartArray);
}

// Verifica si el usuario inició sesión, y si lo hizo muestra el contenido de la página
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("userEmail")) {
        document.getElementById("main").innerHTML = `
        <div class="alert alert-warning text-center w-50 mt-5" role="alert">
            Para ver el carrito de compras, por favor 
            <a href="index.html" class="alert-link">inicie sesión</a>.
        </div>
        `
    }
    else {
        getCartData();
    }
})

// Muestra carrito de compra y sus elementos
function showUserCart(cartArray) {
    let htmlContentToAppend = `
    <h1 class="text-center mt-4 mb-4">Carrito de compras</h1>
    <table class="table text-center" id="table">
        <thead>
            <th></th>
            <th scope="col">
                Nombre
            </th>
            <th scope="col">
                Costo
            </th>
            <th scope="col">
                Cantidad
            </th>
            <th scope="col">
                Subtotal
            </th>
            <th scope="col"></th>
        </thead>
        <tbody>
            ${getArticles(cartArray)}
        </tbody>
    </table>
    `
    CART_CONTAINER.innerHTML = htmlContentToAppend;
}

function goToProduct(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}

// Agrega los artículos de un array como filas de tabla
function getArticles(cartArray) {
    let articlesHTMLContent = "";
    cartArray.articles.forEach(element => {
        element.subtotal = element.count * element.unitCost;
        articlesHTMLContent += `
        <tr class="align-middle">
            <td class="col-2">
                <img class="cart-img rounded" src="${element.image}" alt="${element.name}">
            </td>
            <td class="col-3">
                <span onclick="goToProduct(${element.id})" class="text-decoration-underline" role="button">
                    ${element.name}
                </span>
            </td>
            <td class="col-2">
                ${element.currency} ${element.unitCost.toLocaleString()}
            </td>
            <td class="col-1">
                <input class="form-control" type="number" value=${element.count} 
                min="1" max="99" id="${element.id}">
            </td>
            <td class="col-3">
                <b>${element.currency} ${element.subtotal.toLocaleString()}</b>
            </td>
            <td class="col-1">
                <i class="fas fa-trash" id="rmvItem_${element.id}" alt="Eliminar producto del carrito"></i>
            </td>
        </tr>
        `
    });
    return articlesHTMLContent;
}

// Agrega evento input al input de cantidad de cada producto
function updateSubtotal(objCartArray) {
    const localStorageCartItems = JSON.parse(localStorage.getItem("storedCartProducts"));

    objCartArray.articles.forEach(product => {
        const productCountInput = document.getElementById(product.id);
        productCountInput.addEventListener("input", () => {
            localStorageCartItems.forEach(item => {
                if (item.id === product.id) {
                    item.count = productCountInput.value;
                    localStorage.setItem("storedCartProducts", JSON.stringify(localStorageCartItems));
                }
            })
            updateFromLocalStorage(objCartArray);
            showUserCart(objCartArray);
            updateSubtotal(objCartArray);
        })
    })
}

// Reemplaza los productos actuales del carrito por los del almacenamiento local
function updateFromLocalStorage(array) {
    if (localStorage.getItem("storedCartProducts")) {
        array.articles = JSON.parse(localStorage.getItem("storedCartProducts"));
    }
}

// Elimina producto elegido del carrito de compras y del almacenamiento local
function removeItemFromCartBtn(objCartArray) {
    const localStorageCartItems = JSON.parse(localStorage.getItem("storedCartProducts"));

    objCartArray.articles.forEach(product => {
        const removeItemBtn = document.getElementById(`rmvItem_${product.id}`);
        removeItemBtn.addEventListener("click", () => {
            localStorageCartItems.forEach(function (item, index) {
                if (item.id === product.id) {
                    localStorageCartItems.splice(index, 1);
                    localStorage.setItem("storedCartProducts", JSON.stringify(localStorageCartItems));
                }
            })
            updateFromLocalStorage(objCartArray);
            showUserCart(objCartArray);
            removeItemFromCartBtn(objCartArray);
        })
    })
}