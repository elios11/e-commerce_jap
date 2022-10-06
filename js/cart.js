let userID = 25801;
const USER_CART = CART_INFO_URL + userID + EXT_TYPE;
let userCartArray = [];
const CART_CONTAINER = document.getElementById("cart");

// Obtiene json a partir de url y agrega su contenido a un array
async function getCartData() {
    const cartRes = await fetch(USER_CART);
    const cartData = await cartRes.json();
    userCartArray = cartData;
    showUserCart(userCartArray);
}

// Verifica si el usuario inició sesión, y si lo hizo muestra el contenido de la página
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("userEmail")) {
        CART_CONTAINER.innerHTML = `
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
        articlesHTMLContent += `
        <tr class="align-middle">
            <td class="col-1">
                <img class="cart-img rounded" src="${element.image}" alt="${element.name}">
            </td>
            <td class="col-2">
                <span onclick="goToProduct(${element.id})" class="text-decoration-underline" role="button">
                    ${element.name}
                </span>
            </td>
            <td class="col-2">
                ${element.currency} ${element.unitCost.toLocaleString()}
            </td>
            <td class="col-1">
                <input class="form-control" type="number" value=${element.count} id="quantity">
            </td>
            <td class="col-2" id="subtotal${element.id}">
                <b>${element.currency} ${(element.unitCost * element.count).toLocaleString()}</b>
            </td>
        </tr>
        `
    });
    return articlesHTMLContent;
}