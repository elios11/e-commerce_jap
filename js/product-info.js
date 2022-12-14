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
    if (!productsRes.ok) {
        throw new Error("No se pudieron obtener los datos de producto...")
    }
    const productsData = await productsRes.json();
    productInfoArray = productsData;

    let commentsRes = await fetch(PRODUCT_COMMENTS_URL);
    if (!commentsRes.ok) {
        throw new Error("No se pudieron obtener los comentarios de producto...")
    }
    const commentsData = await commentsRes.json();
    productCommentsArray = commentsData;

    addCommentsToArray();
    showProductInfo();
    showRelatedProducts(productInfoArray);
}

document.addEventListener("DOMContentLoaded", () => {
    //Valida si el usuario inició sesión para desbloquear nuevo comentario
    if (!localStorage.getItem("userEmail")) {
        sendCommentButton.setAttribute("disabled", "");
        commentTextBox.setAttribute("disabled", "");
        commentTextBox.setAttribute("placeholder", "\nPara agregar una nueva calificación, por favor inicie sesión.");
        commentTextBox.setAttribute("rows", 5);
        clearButton.setAttribute("disabled", "");
        Array.from(pickScoreHearts).forEach(element => {
            element.classList.add("unclickable");
        });
    }
    pickCommentScore();
    getData()
        .catch(err => console.log("Error: ", err.message));
});

function showProductInfo() {
    document.getElementById("productName").innerHTML = `e-Mercado - ${productInfoArray.name}`;

    let htmlContentToAppend = `
    <div class="row align-items-center">
        <div class="col-12 col-lg-7 text-center">
            ${getImages(productInfoArray)}
        </div>

        <div class="col-12 col-lg-5 col-xl-4 ps-lg-5 ps-xl-0 mt-3 mt-lg-5 mt-xl-0 ms-xl-5">
            <h1 class="display-6 text-center">
                ${productInfoArray.name}
            </h1>
            <hr>
            <div class="row mt-3 mb-3 text-muted fst-italic">
                <div class="col-6">
                    Categoría - <a class="link-secondary" href="products.html">${productInfoArray.category}</a>
                </div>
                <div class="d-flex justify-content-end col-6">
                    Artículos vendidos: <b class="ps-1">${productInfoArray.soldCount}</b>
                </div>
            </div>

            <div class="row">
                <div class="d-flex align-items-center col-6">
                    <h3 class="mb-0">
                        ${productInfoArray.currency} 
                        ${productInfoArray.currency == "UYU" ?
                            productInfoArray.cost.toLocaleString("ES") :
                            productInfoArray.cost.toLocaleString("EN")
                        }
                    </h3>
                </div>
                <div class="col-6 d-flex justify-content-end">
                    <input class="btn btn-success" type="button" id="addToCartBtn" 
                    onclick="addToCart()"
                    value="Agregar al carrito"></input>
                </div>
                <div class="col-10 offset-1 col-sm-6 offset-sm-3 offset-xl-0
                            col-xl-12 mt-4 mb-4 rounded"
                        id="addToCartAlert" role="alert">
                </div>
            </div>
    
            <div class="row">
                <h3 class="mb-3">Descripción</h3>
                <h4>${productInfoArray.description}</h4>
            </div>
        </div>
    </div>

    <div class="row mt-5">
        <h2 class="text-center">
            Opiniones
        </h2>
        <div>
            <hr>
            ${getComments(productCommentsArray)}
        </div>
    </div>
    `
    document.getElementById("productInfoContainer").innerHTML = htmlContentToAppend;
    startCarousel();
}

function getImages(array) {
    let carrouselItems = "";
    let carouselIndicators = "";
    for (let i = 0; i < array.images.length; i++) {
        let currentImg = array.images[i];
        if (i === 0) {
            carrouselItems += `
            <div class="carousel-item active">
                <img src="${currentImg}" alt="Imagen de ${array.name}" class="d-block w-100">
            </div>
            `
            carouselIndicators += `
            <button type="button" data-bs-target="#imagesCarousel" data-bs-slide-to="${i}" class="active"
            aria-current="true" aria-label="Slide 1"></button>
            `
        }
        else {
            carrouselItems += `
                <div class="carousel-item">
                    <img src="${currentImg}" alt="Imagen de ${array.name}" class="d-block w-100">
                </div>
            `
            carouselIndicators += `
            <button type="button" data-bs-target="#imagesCarousel" data-bs-slide-to="${i}" 
            aria-label="Slide ${i + 1}"></button>
            `
        }
    }
    let imagesCarousel = `
    <div id="imagesCarousel" class="carousel slide carousel-dark w-100 mt-5 d-inline-block">
        <div class="carousel-indicators">
            ${carouselIndicators}
        </div>
        <div class="carousel-inner">
            ${carrouselItems}
        </div>
        <button class="carousel-control-prev d-none d-md-block" type="button" data-bs-target="#imagesCarousel" 
        data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next d-none d-md-block" type="button" data-bs-target="#imagesCarousel" 
        data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
        </button>
    </div>
    `;
    return imagesCarousel;
}

function startCarousel() {
    let imagesCarousel = document.querySelector('#imagesCarousel')
    let carousel = new bootstrap.Carousel(imagesCarousel, {
        interval: 3000,
        wrap: true
    })
}

function getComments(array) {
    let commentsHTML = ``;
    for (let i = 0; i < array.length; i++) {
        let currentComment = array[i];
        commentsHTML += `
        <div class="col pt-1">
            <div>
                <div class="mb-2 heartScoreContainer">
                    ${getScore(currentComment)}
                </div>
                <strong>${currentComment.user}</strong>
                <span class="text-muted">&nbsp- ${currentComment.dateTime}</span>
            </div>
            <div>
                ${currentComment.description}
            </div>
            <hr class="mb-4 mt-4">
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
sendCommentButton.addEventListener("click", function () {
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
        getData()
            .catch(err => console.log("Error: ", err.message));
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
    //Asigna a cada elemento de clase pickScore un evento de click
    for (let i = 0; i < pickScoreHearts.length; i++) {
        const element = pickScoreHearts[i];

        element.addEventListener("click", function () {
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
        element.addEventListener("mouseover", function () {
            for (let i = 0; i < hoveredScore; i++) {
                pickScoreHearts[i].classList.add("hoverHeart");
            }
        })

        element.addEventListener("mouseout", function () {
            for (let i = 0; i < hoveredScore; i++) {
                pickScoreHearts[i].classList.remove("hoverHeart");
            }
        })
    }
}

//Agrega comentarios del localStorage al array de comentarios original
function addCommentsToArray() {
    let localStorageComments = JSON.parse(localStorage.getItem(`${productID}_userComments`));
    if (localStorageComments) {
        localStorageComments.forEach(element => {
            productCommentsArray.push(element);
        });
    }
}

function goToRelatedProd(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}

function showRelatedProducts(array) {
    let relatedProductsString = "";
    array.relatedProducts.forEach(element => {
        relatedProductsString += `
        <div class="col-6 col-md-5 col-lg-5 col-xl-3">
            <div class="card" onclick="goToRelatedProd(${element.id})" 
            role="button">
                <img src="${element.image}" class="card-img-top" alt="${element.name}">
                <div class="card-body">
                    <h5 class="card-title text-center">${element.name}</h5>
                </div>
            </div>
        </div>
        `
    })
    document.getElementById("relatedProducts").innerHTML = relatedProductsString;
}

// Agrega producto al carrito de compras si aún no está incluído
function addToCart() {
    const addToCartAlert = document.getElementById("addToCartAlert");
    const localStorageCartItems = JSON.parse(localStorage.getItem("storedCartProducts"));
    let cartItems = {};
    cartItems[userEmail] = {};
    let alreadyInCart = false;

    if (localStorageCartItems) {
        cartItems = localStorageCartItems;
        if (!localStorageCartItems[userEmail]) {
            cartItems[userEmail] = {};
        }
    }

    if (cartItems[userEmail][`productID_${productInfoArray.id}`]) {
        alreadyInCart = true;
        addToCartAlert.classList.add("alert-warning");
        addToCartAlert.classList.add("alert-warning");
        addToCartAlert.innerHTML = `
        <h6 class="pb-1 pt-2 px-2 text-center">¡Este producto ya está en el 
        <a class="link-secondary fst-italic" href="cart.html">carrito</a> de compras!</h6>
        `
        setTimeout(() => {
            addToCartAlert.innerHTML = "";
            addToCartAlert.classList.remove("alert-warning");
        }, 4000);
    }
    if (!alreadyInCart) {
        cartItems[userEmail][`productID_${productInfoArray.id}`] =
        {
            id: productInfoArray.id,
            name: productInfoArray.name,
            count: 1,
            unitCost: productInfoArray.cost,
            currency: productInfoArray.currency,
            image: productInfoArray.images[0]
        }
        addToCartAlert.classList.add("alert-success");
        addToCartAlert.innerHTML = `
        <h6 class="pb-1 pt-2 px-2 text-center">¡El producto fue añadido al 
        <a class="link-secondary fst-italic" href="cart.html">carrito</a> de compras!</h6>
        `
        setTimeout(() => {
            addToCartAlert.innerHTML = "";
            addToCartAlert.classList.add("alert-success");
        }, 4000);
    }
    localStorage.setItem("storedCartProducts", JSON.stringify(cartItems));
}