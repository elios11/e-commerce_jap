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
    if (productsArray.products.length === 0) {
        document.getElementById("pageContent").innerHTML = `
        <h2 class="text-center mt-5 lh-base">
            Lo sentimos, actualmente no se encuentran productos en la categoría de ${productsArray.catName},
            seguí explorando otros productos en <a href="categories.html" class="alert-link">categorías</a>.
        </h2>
        `;
        return false;
    }
    document.getElementById("categoryName").innerHTML = `e-Mercado - ${productsArray.catName}`;
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
            <div class="col-6 col-md-4 col-xxl-3 d-flex">
                <div class="card" role="button" onclick="setProductID(${currentProduct.id})">
                    <img src="${currentProduct.image}" alt="Imagen de ${currentProduct.name}" 
                         class="card-img-top">
                    <div class="card-body">
                        <div class="card-title text-center fs-5">
                            <b>${currentProduct.name}</b>
                            <div class="mt-2 fs-6">
                                ${currentProduct.currency}
                                ${currentProduct.currency == "UYU" ?
                                    currentProduct.cost.toLocaleString("ES") :
                                    currentProduct.cost.toLocaleString("EN")
                                }
                            </div>
                        </div>
                        <div class="card-text mt-1 text-center">
                            <p class="mb-1">${currentProduct.description}</p>
                        </div>
                        <p class="mb-0 text-center text-muted">${currentProduct.soldCount} artículos</p>
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
    if (document.querySelector("input:checked")) {
        document.querySelector("input:checked").checked = false;
    }
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