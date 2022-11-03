let userCartArray = [];
let currentUSDPrice;
let shippingTaxes;
let alreadyTriedSubmitting = false;
const BROU_COTIZATION_API = "https://cotizaciones-brou.herokuapp.com/api/currency/latest";
const CART_CONTAINER = document.getElementById("cart");
const PRODUCTS_COST_TEXT = document.getElementById("productsCost");
const SHIPPING_COST_TEXT = document.getElementById("shippingCost");
const TOTAL_COST_TEXT = document.getElementById("totalCost");

// Guarda el precio actual del dólar en una variable
async function getLatestCotizations(url) {
    const cotizationRes = await fetch(url);
    const cotizationData = await cotizationRes.json();
    currentUSDPrice = cotizationData.rates.USD.buy;
}

function getCartData() {
    updateFromLocalStorage(userCartArray);
    showUserCart(userCartArray);
    removeItemFromCartBtn(userCartArray.articles);
    updateSubtotal(userCartArray.articles);
    getShippingTypeTax("shippingType");
    showCostsValues();
}

// Verifica si el usuario inició sesión, y si lo hizo muestra el contenido de la página
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("userEmail")) {
        document.getElementById("main").innerHTML = `
        <div class="alert alert-warning lead text-center w-50 mt-5" role="alert">
            Para ver el carrito de compras, por favor 
            <a href="index.html" class="alert-link">inicie sesión</a>.
        </div>
        `
        return false;
    }
    getCartData();
    paymentMethodFields();
    checkFormValidity();
})

// Muestra carrito de compra y sus elementos
function showUserCart(cartArray) {
    if (!cartArray.articles || cartArray.articles.length === 0) {
        document.getElementById("shippingDetails").innerHTML = "";
        document.getElementById("costsContainer").innerHTML = "";
        document.getElementById("paymentMethodContainer").innerHTML = "";
        CART_CONTAINER.innerHTML = `
        <h2 class="text-center mt-5">
            El carrito de compras se encuentra vacío, mirá nuevos productos para agregar en
            <a href="categories.html" class="alert-link">categorías</a>.
        </h2>
        `
        return false;
    }
    let htmlContentToAppend = `
    <h1 class="text-center mt-4 mb-4">Carrito de compras</h1>
    <div class="table-responsive">
        <table class="table text-center" id="table">
            <thead>
                <th></th>
                <th scope="col">
                    Nombre
                </th>
                <th scope="col">
                    Costo
                </th>
                <th class="w-8" scope="col">
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
    </div>
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
            <td>
                <img class="cart-img rounded" src="${element.image}" alt="${element.name}">
            </td>
            <td>
                <span onclick="goToProduct(${element.id})" class="text-decoration-underline" role="button">
                    ${element.name}
                </span>
            </td>
            <td>
                ${element.currency} 
                ${element.currency == "UYU" ? 
                    element.unitCost.toLocaleString("ES") : 
                    element.unitCost.toLocaleString("EN")
                }
            </td>
            <td>
                <input class="form-control" type="number" value=${element.count} 
                min="1" max="99" id="${element.id}" required>
            </td>
            <td>
                <b>
                    ${element.currency} 
                    ${element.currency == "UYU" ? 
                        element.subtotal.toLocaleString("ES") : 
                        element.subtotal.toLocaleString("EN")
                    }
                </b>
            </td>
            <td>
                <i class="fas fa-trash" id="rmvItem_${element.id}" alt="Eliminar producto del carrito"></i>
            </td>
        </tr>
        `
    });
    return articlesHTMLContent;
}

// Muestra el subcosto de los productos, el costo de envío, y el costo total
async function showCostsValues() {
    let subcost = await getSubtotalValue();
    let shippingCost = calculateShippingCost(subcost, shippingTaxes);
    let totalCost = subcost + shippingCost;
    PRODUCTS_COST_TEXT.innerHTML = `USD ${subcost.toLocaleString("EN")}`;
    if (shippingTaxes) {
        SHIPPING_COST_TEXT.innerHTML = `USD ${shippingCost.toLocaleString("EN")}`;
        TOTAL_COST_TEXT.innerHTML = `USD ${totalCost.toLocaleString("EN")}`;
    }
}

// Reemplaza los productos actuales del carrito por los del almacenamiento local
function updateFromLocalStorage(array) {
    if (localStorage.getItem("storedCartProducts")) {
        array.articles = JSON.parse(localStorage.getItem("storedCartProducts"));
    }
    else {
        array.articles = [];
    }
}

// Agrega evento input al input de cantidad de cada producto
function updateSubtotal(objCartArticles) {
    const localStorageCartItems = JSON.parse(localStorage.getItem("storedCartProducts"));
    objCartArticles.forEach(product => {
        const productCountInput = document.getElementById(product.id);
        productCountInput.addEventListener("change", () => {
            localStorageCartItems.forEach(item => {
                if (item.id === product.id) {
                    if (productCountInput.value) {
                        item.count = productCountInput.value;
                        localStorage.setItem("storedCartProducts", JSON.stringify(localStorageCartItems));
                    }
                }
            })
            getCartData();
            if (alreadyTriedSubmitting) {
                validateProductsQuantity();
            }
        })
    })
}

// Elimina producto elegido del carrito de compras y del almacenamiento local
function removeItemFromCartBtn(objCartArticles) {
    const localStorageCartItems = JSON.parse(localStorage.getItem("storedCartProducts"));

    objCartArticles.forEach(product => {
        const removeItemBtn = document.getElementById(`rmvItem_${product.id}`);
        removeItemBtn.addEventListener("click", () => {
            localStorageCartItems.forEach(function (item, index) {
                if (item.id === product.id) {
                    localStorageCartItems.splice(index, 1);
                    localStorage.setItem("storedCartProducts", JSON.stringify(localStorageCartItems));
                }
            })
            getCartData();
        })
    })
}

// Devuelve un array con todos los subtotales en dólares
function extractSubtotals(objCartArticles) {
    let subtotalsArray = [];
    objCartArticles.forEach(element => {
        if (element.currency === "UYU") {
            subtotalsArray.push(Math.round((element.subtotal / currentUSDPrice)*100) / 100);
        }
        else {
            subtotalsArray.push(element.subtotal);
        }
    });
    return subtotalsArray;
}

// Devuelve la suma de todos los números de un array
function sumOfSubtotals(arrayOfNumbers) {
    let result = 0;
    arrayOfNumbers.forEach(element => {
        result += element;
    });
    return result;
}

// Devuelve el impuesto añadido por el tipo de envío elegido
function getShippingTypeTax(inputName) {
    let radioButtons = document.getElementsByName(inputName);

    radioButtons.forEach(element => {
        element.addEventListener("click", () => {
            shippingTaxes = element.value;
            showCostsValues();
        });
    })
}

function calculateShippingCost(subcost, shippingTax) {
    let shippingCost = 0;
    shippingCost = Math.round((subcost * shippingTax / 100) * 100) / 100;
    return shippingCost;
}

// Espera cotización del dolar y devuelve el subtotal sumado de todos los elementos en dólares
async function getSubtotalValue() {
    await getLatestCotizations(BROU_COTIZATION_API);
    let subtotal = sumOfSubtotals(extractSubtotals(userCartArray.articles));
    return subtotal;
}

// Deshabilita los campos del método de pago no elegido
function paymentMethodFields() {
    const paymentMethods = document.getElementsByName("paymentMethod");
    const creditCardFields = document.getElementsByName("creditCardItem");
    const bankTransferField = document.getElementById("accoutNumber");
    const selectedPaymentMethod = document.getElementById("selectedPaymentMethod");
    const paymentMethodMessage = document.getElementById("paymentMethodMessage");

    paymentMethods.forEach(element => {
        element.addEventListener("change", () => {
            paymentMethodMessage.classList.remove("d-block");
            selectedPaymentMethod.classList.add("fw-bold");
            if (element.id === "creditCard") {
                selectedPaymentMethod.innerHTML = "Tarjeta de crédito";
                bankTransferField.setAttribute("disabled", "");
                creditCardFields.forEach(element => {
                    element.removeAttribute("disabled");
                })
            }
            else {
                selectedPaymentMethod.innerHTML = "Transferencia bancaria";
                bankTransferField.removeAttribute("disabled");
                creditCardFields.forEach(element => {
                    element.setAttribute("disabled", "");
                })
            }
        })
    })
}

// Verifica si todos los input de cantidad de producto son válidos
function validateProductsQuantity() {
    const quantityInputs = document.querySelectorAll("table input[type='number']");
    let allValid = true;

    quantityInputs.forEach(element => {
        if (!element.checkValidity()) {
            element.classList.add("invalid-input");
            allValid = false;
        }
    })
    return allValid;
}

// Muestra mensaje de método de pago no elegido
function unselectedPaymentMethodMsg() {
    let checkedPaymentMethod = document.querySelector("input[name='paymentMethod']:checked");
    if (checkedPaymentMethod === null) {
        document.getElementById("paymentMethodMessage").classList.add("d-block");
    }
}

// Verifica la validez de los input y del formulario
function checkFormValidity() {
    const paymentMethodForm = document.getElementById("paymentMethodForm");
    const purchasedAlert = document.getElementById("successfulPurchaseAlert");

    paymentMethodForm.addEventListener("submit", function (event) {
        alreadyTriedSubmitting = true;
        event.preventDefault();
        if (!paymentMethodForm.checkValidity() || !validateProductsQuantity()) {
            unselectedPaymentMethodMsg();
        }
        else {
            purchasedAlert.classList.remove("d-none");
            purchasedAlert.innerHTML = `
            <div class="alert alert-success text-center" role="alert">
                ¡La compra ha sido realizada con éxito!
            </div>
            `;
            setTimeout(() => {
                showSpinner();
            }, 1000);
            setTimeout(() => {
                localStorage.removeItem("storedCartProducts");
                paymentMethodForm.submit();
            }, 2000);
        }
        validateProductsQuantity();
        paymentMethodForm.classList.add("was-validated");
    })
}