let categoryID = localStorage.getItem("catID");
const CATEGORY_URL = PRODUCTS_URL + categoryID + EXT_TYPE;
let categoryTitle = document.getElementById("categoryTitle");
let productsArray = [];
let minCost = undefined;
let maxCost = undefined;
let inputSearch = "";
const sortDescendingBtn = document.getElementById("sortDescendingBtn");
const sortAscendingBtn = document.getElementById("sortAscendingBtn");
const sortByRelevanceBtn = document.getElementById("sortByRelevanceBtn");
const minCostField = document.getElementById("rangeFilterCostMin");
const maxCostField = document.getElementById("rangeFilterCostMax");

//Devuelve un objeto utilizando un archivo JSON y luego ejecuta la función showProductsList
function getData() {
    getJSONData(CATEGORY_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;
            showProductsList();
        }
    })
}

//Ejecuta getData cuando el contenido HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", getData());

//Obtiene los rangos de valores del filtro de precio
document.getElementById("rangeFilterCost").addEventListener("click", function() {
    if (minCostField.value !== "") {
        minCost = parseInt(minCostField.value);
    }
    else {
        minCost = undefined;
    }

    if (maxCostField.value !== "") {
        maxCost = parseInt(maxCostField.value);
    }
    else {
        maxCost = undefined;
    }
    showProductsList();
})

function setProductID(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}

//Muestra una lista de los productos del objeto "productsArray" en filas y columnas de HTML
function showProductsList() {
    categoryTitle.innerHTML = `Verás aquí todos los productos de la categoría ${productsArray.catName}`;
    let htmlContentToAppend = "";
    for (let i = 0; i < productsArray.products.length; i++) {
        let currentProduct = productsArray.products[i];
        let nameAndDescLowerCase = (currentProduct.name + currentProduct.description).toLowerCase();
        //Filtra los valores obtenidos en el for por el rango de precio definido en minCost y maxCost
        //y filtra en la barra de búsqueda respecto al nombre y descripción de los productos
        if (!(minCost > parseInt(currentProduct.cost) || maxCost < parseInt(currentProduct.cost)) &&
             (inputSearch == "" || nameAndDescLowerCase.includes(inputSearch))) {
            htmlContentToAppend += `
            <div onclick="setProductID(${currentProduct.id})" class="list-group-item list-group-item-action cursor-active">
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
            }
            document.getElementById("productsContainer").innerHTML = htmlContentToAppend;
    }
}

//Limpia los campos de filtro por rango de precio y genera un nuevo listado sin filtrado
document.getElementById("clearRangeFilter").addEventListener("click", function() {
    minCostField.value = "";
    maxCostField.value = "";
    minCost = undefined;
    maxCost = undefined;
    document.getElementById("searchBar").value = "";
    inputSearch = "";
    getData();
    showProductsList();
})

//Ordena productsArray por precio de mayor a menor
sortDescendingBtn.addEventListener("click", function() {
    productsArray.products.sort((a, b) => {
        return parseInt(b.cost) - parseInt(a.cost);
    })
    showProductsList();
})

//Ordena productsArray por precio de menor a mayor
sortAscendingBtn.addEventListener("click", function() {
    productsArray.products.sort((a, b) => {
        return parseInt(a.cost) - parseInt(b.cost);
    })
    showProductsList();
})

//Ordenar productsArray por relevancia (cantidad de items vendidos)
sortByRelevanceBtn.addEventListener("click", function() {
    productsArray.products.sort((a, b) => {
        return parseInt(b.soldCount) - parseInt(a.soldCount);
    })
    showProductsList();
})

//Inserta el contenido de la barra de búsqueda en inputSearch
document.getElementById("searchBar").addEventListener("input", function() {
    inputSearch = (document.getElementById("searchBar").value).toLowerCase();
    showProductsList();
})