const CARS_URL = `${PRODUCTS_URL}101.json`;
let productsArray = [];

//Devuelve un objeto utilizando un archivo JSON y luego ejecuta la función showProductsList
document.addEventListener("DOMContentLoaded", function() {
    getJSONData(CARS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;
            showProductsList();
        }
    })
})

//Muestra una lista de los productos del objeto "productsArray" en filas y columnas de HTML
function showProductsList() {
    let htmlContentToAppend = "";
    for (let i = 0; i < productsArray.products.length; i++) {
        let currentProduct = productsArray.products[i];
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action cursor-active">
            <div class="row">
                <div class="col-3">
                    <img src="${currentProduct.image}" alt="${currentProduct.description}" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">${currentProduct.name} - ${currentProduct.currency} ${currentProduct.cost}</h4>
                        <small class="text-muted">${currentProduct.soldCount} artículos</small>
                    </div>
                    <p class="mb-1">${currentProduct.description}</p>
                </div>
            </div>
        </div>
        `
        document.getElementById("carProductsContainer").innerHTML = htmlContentToAppend;
    }
}