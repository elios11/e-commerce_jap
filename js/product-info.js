let productID = localStorage.getItem("productID");
let PRODUCT_URL = PRODUCT_INFO_URL + productID + EXT_TYPE;
let PRODUCT_COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + productID + EXT_TYPE;
let productInfoArray = [];
let productCommentsArray = [];
let pickScoreHearts = document.getElementsByClassName("pickScore");
let pickScore = 0;
const productTitle = document.getElementById("productTitle");
const sendCommentButton = document.getElementById("sendCommentButton");
const clearButton = document.getElementById("clearButton");

async function getData() {
    const productsRes = await fetch(PRODUCT_URL);
    const productsData = await productsRes.json();
    productInfoArray = productsData;

    const commentsRes = await fetch(PRODUCT_COMMENTS_URL);
    const commentsData = await commentsRes.json();
    productCommentsArray = commentsData;

    addCommentsToArray();
    showProductInfo();
    showRelatedProducts(productInfoArray);
}

document.addEventListener("DOMContentLoaded", () => {
    //Valida si el usuario inició sesión para desbloquear nuevo comentario
    if (!sessionStorage.getItem("userEmail")) {
        sendCommentButton.setAttribute("disabled", "");
        commentTextBox.setAttribute("disabled", "");
        commentTextBox.setAttribute("placeholder", "\n\nPara agregar una nueva calificación, por favor inicie sesión.");
        commentTextBox.setAttribute("rows", 5);
        clearButton.setAttribute("disabled", "");
        Array.from(pickScoreHearts).forEach(element => {
            element.classList.add("unclickable");
        });
    }
    pickCommentScore();
    getData();
});

function showProductInfo() {
    let htmlContentToAppend = `
    <div class="col-lg-12">
        <div class="d-flex flex-row pt-3">
                ${getImages(productInfoArray)}
            <div class="ms-5 d-flex flex-column">
                <div class="row">
                    <h1 class="pb-4 pt-4 display-5">
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
            </div>
        </div>
        <div class="row pt-5">
            <h2 class="d-flex justify-content-center pb-4">
                Opiniones
            </h2>
            <div>
            <hr>
                ${getComments(productCommentsArray)}
            </div>
        </div>
    </div>
    `
    document.getElementById("productInfoContainer").innerHTML = htmlContentToAppend;
}

function getImages(array) {
    let carrouselItems = "";
    for(let i = 0; i < array.images.length; i++) {
        let currentImg = array.images[i];
        if (i > 0) {
            carrouselItems += `
                <div class="carousel-item">
                    <img src="${currentImg}" alt="Imagen de ${array.name}" class="d-block w-100">
                </div>
            `
        }
        else {
            carrouselItems += `
            <div class="carousel-item active">
                <img src="${currentImg}" alt="Imagen de ${array.name}" class="d-block w-100">
            </div>
        `
        }
    }
    let imagesHTML = `
    <div id="imagesCarousel" class="carousel mt-5 slide w-50 h-25 d-inline-block" data-bs-ride="carousel" data-bs-interval="200">
    <div class="carousel-indicators">
        <button type="button" data-bs-target="#imagesCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#imagesCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#imagesCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">
        ${console.log(carrouselItems)}
        ${carrouselItems}
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#imagesCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#imagesCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
    </div>
    `;
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
                    <div class="mb-2 heartScoreContainer">
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

//Envia nuevo comentario al localStorage
sendCommentButton.addEventListener("click", function() {
    let commentTextBox = document.getElementById("commentTextBox");
    let nuevosComentarios = [];
    if (localStorage.getItem(`${productID}_userComments`)) {
        nuevosComentarios = JSON.parse(localStorage.getItem(`${productID}_userComments`));
    }
    let currentDate = new Date();
    let seconds = ("0" + currentDate.getSeconds()).slice(-2);
    let minutes = ("0" + currentDate.getMinutes()).slice(-2);
    let hours = ("0" + currentDate.getHours()).slice(-2);
    let day = ("0" + currentDate.getDate()).slice(-2);
    let month = (("0" + (currentDate.getMonth() + 1)).slice(-2));

    let fullDate = `${currentDate.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`
    if (commentTextBox.value.length > 20) {
        document.querySelector(".dataAlert").innerHTML = "";
        Array.from(pickScoreHearts).forEach(element => {
            element.classList.remove("checked");
        });
        nuevosComentarios.push(
        {
            product: productID,
            score: pickScore + 1,
            description: commentTextBox.value,
            user: userEmail,
            dateTime: fullDate
        });
        localStorage.setItem(`${productID}_userComments`, JSON.stringify(nuevosComentarios));
        commentTextBox.value = "";
        getData();
    }
    else {
        document.querySelector(".dataAlert").innerHTML = "Su comentario debe contener al menos 20 caracteres."
    }
})

//Limpia los valores de la caja de nuevo comentario
clearButton.addEventListener("click", () => {
    let commentTextBox = document.getElementById("commentTextBox");
    commentTextBox.value = "";
    Array.from(pickScoreHearts).forEach(element => {
        element.classList.remove("checked");
    });
    document.querySelector(".dataAlert").innerHTML = "";
})

//Selecciona calificación de nuevo comentario en base a elección del usuario
function pickCommentScore() {
    const heartScoreContainer = document.getElementById("pickScoreHearts");
    //Asigna a cada elemento de clase pickScore un evento de click
    for (let i = 0; i < pickScoreHearts.length; i++) {
        const element = pickScoreHearts[i];

        element.addEventListener("click", function() {
            //Despinta los corazones actualmente seleccionados
            for (let i = 0; i <= pickScore; i++) {
                pickScoreHearts[i].classList.remove("checked");
            }

            pickScore = i;

            //Pinta corazones según número de corazón clickeado
            for (let i = 0; i <= pickScore; i++) {
                pickScoreHearts[i].classList.add("checked");
            }
        })

        //Pinta y despinta corazones al pasar el ratón sobre ellos
        let hoveredScore = i + 1;
        element.addEventListener("mouseover", function() {
            for (let i = 0; i < hoveredScore; i++) {
                pickScoreHearts[i].classList.add("hoverHeart");
            }
        })

        element.addEventListener("mouseout", function() {
            for (let i = 0; i < hoveredScore; i++) {
                pickScoreHearts[i].classList.remove("hoverHeart");
            }
        })
    }
}

//Agrega comentarios del localStorage al array de comentarios original
function addCommentsToArray() {
    let localStorageComments = JSON.parse(localStorage.getItem(`${productID}_userComments`));
    if(localStorageComments) {
        localStorageComments.forEach(element => {
            productCommentsArray.push(element);
        });
    }
}

function getRelatedProdID(id) {
    localStorage.setItem("productID", id);
    PRODUCT_URL = PRODUCT_INFO_URL + id + EXT_TYPE;
    getData();
    window.location = "product-info.html";
}

function showRelatedProducts(array) {
    let relatedProductsString = "";
    array.relatedProducts.forEach(element => {
        relatedProductsString += `
        <div onclick="getRelatedProdID(${element.id})" class="row border rounded m-4 w-25 justify-content-center relatedProduct">
            <h6 class="pt-3 text-center w-50">${element.name}</h6>
            <img src="${element.image}" class="m-2 rounded" alt="${element.name}">
        </div>
        `
    })
    document.getElementById("relatedProducts").innerHTML = relatedProductsString;
}