let productID = localStorage.getItem("productID");
let PRODUCT_URL = PRODUCT_INFO_URL + productID + EXT_TYPE;
let PRODUCT_COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + productID + EXT_TYPE;
let productInfoArray = "";
let productCommentsArray = "";
const productTitle = document.getElementById("productTitle");

//Devuelve un objeto utilizando un archivo JSON y luego ejecuta la función showProductInfo
function getProdInfo() {
    getJSONData(PRODUCT_URL).then(function(resultObj) {
        productInfoArray = resultObj.data;
    })
}

function getProdComments() {
    getJSONData(PRODUCT_COMMENTS_URL).then(function(resultObj) {
        productCommentsArray = resultObj.data;
        showProductInfo();
    })
}

document.addEventListener("DOMContentLoaded", function() {
    getProdInfo();
    getProdComments();
});

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
            <strong>
                Imágenes ilustrativas
            </strong>
            <div class="row pt-3 d-flex justify-content-center" id="imagesContainer">
                ${getImages(productInfoArray)}
            </div>
        </div>
        <div class="row pt-5">
            <h2 class="d-flex justify-content-center pb-4">
                Opiniones
            </h2>
            <div class="">
            <hr>
                ${getComments(productCommentsArray)}
            </div>
        </div>
    </div>
    `
    document.getElementById("productInfoContainer").innerHTML = htmlContentToAppend;
}

function getImages(array) {
    let imagesHTML = ``;
    for(let i = 0; i < array.images.length; i++) {
        let currentImg = array.images[i];
        imagesHTML += `
            <img src="${currentImg}" alt="Imagen de ${array.name}" class="img-thumbnail w-20 m-2">
        `
    }
    return imagesHTML;
}

function getComments(array) {
    let commentsHTML = ``;
    for (let i = 0; i < array.length; i++) {
        let currentComment = array[i];
        commentsHTML += `
        <div class="row-lg-12">
            <div class="col pt-1">
                <div>
                    <div class="mb-2">
                        ${getScore(currentComment)}
                    </div>
                    </div>
                        <strong>${currentComment.user}</strong>
                        <span class="text-muted">&nbsp- ${currentComment.dateTime}</span>
                    </div>
                    <div>
                        ${currentComment.description}
                    </div>
                    <hr class="mb-4 mt-4">
            </div>
        </div>
        `
    }
    return commentsHTML;
}

function getScore(comment) {
    let fiveHearts = [
        `<span class="fa fa-heart"></span>`,
        `<span class="fa fa-heart"></span>`,
        `<span class="fa fa-heart"></span>`,
        `<span class="fa fa-heart"></span>`,
        `<span class="fa fa-heart"></span>`
    ]

    for (let i = 0; i < parseInt(comment.score); i++) {
        fiveHearts[i] = `<span class="fa fa-heart checked"></span>`;
    }
    return fiveHearts.join(" ");
}