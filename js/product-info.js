let productID = localStorage.getItem("productID");
let PRODUCT_URL = PRODUCT_INFO_URL + productID + EXT_TYPE;
let productInfoArray = "";
const productTitle = document.getElementById("productTitle");

//Devuelve un objeto utilizando un archivo JSON y luego ejecuta la función showProductInfo
function getProdInfo() {
    getJSONData(PRODUCT_URL).then(function(resultObj) {
        productInfoArray = resultObj.data;
        console.log(productInfoArray);
        showProductInfo();
    })
}
document.addEventListener("DOMContentLoaded", getProdInfo());

function showProductInfo() {
    let htmlContentToAppend = `
    <div class="col-lg-12">
        <div class="row">
            <h1 class="pb-4 display-5">
                ${productInfoArray.name}
            </h1>
            <hr>
            <div>
                <strong>
                    Precio
                </strong>
            </div>
            <div>
                ${productInfoArray.cost}
            </div>
        </div>
        <div class="row pt-3">
            <div>
                <strong>
                    Descripción
                </strong>
            </div>
            <div>
                ${productInfoArray.description}
            </div>
        </div>
        <div class="row pt-3">
            <div>
                <strong>
                    Categoría
                </strong>
            </div>
            <div>
                ${productInfoArray.category}
            </div>
        </div>
        <div class="row pt-3">
            <div>
                <strong>
                    Cantidad de vendidos
                </strong>
            </div>
            <div>
                ${productInfoArray.soldCount}
            </div>
        </div>
        <div class="row pt-3">
            <div>
                <strong>
                    Imágenes ilustrativas
                </strong>
            </div>
        </div>
        <div class="row pt-3 d-flex justify-content-center">
            `
            for(let i = 0; i < productInfoArray.images.length; i++) {
                let currentImg = productInfoArray.images[i];
                htmlContentToAppend += `
                <img src="${currentImg}" alt="Imagen de ${productInfoArray.name}" class="img-thumbnail w-20 m-2">
                `
            }
            `
        </div>
    </div>
    `
    document.getElementById("productInfoContainer").innerHTML = htmlContentToAppend;
}
