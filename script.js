// Sección Servicios //

function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.add('activo');
        document.body.classList.add('modal-abierto');
    }
}

function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.remove('activo');
        document.body.classList.remove('modal-abierto');
    }
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('activo');
        document.body.classList.remove('modal-abierto');
    }
}

// Sección Tienda //
let cantidadActual = 1;
let precioBaseActual = 0;
let nombreActual = "";
let carrito = [];
let imagenesProductos = [];
let indiceImagen = 0;


const btnFarmacia = document.getElementById('btn-farmacia');
const seccionFarmacia = document.getElementById('seccion-farmacia');

const btnAccesorios = document.getElementById('btn-accesorios');
const seccionAccesorios = document.getElementById('seccion-accesorios');

if (btnFarmacia) {
    btnFarmacia.addEventListener('click', function() {
        seccionFarmacia.classList.add('activo');
        seccionAccesorios.classList.remove('activo');
    });
}

if (btnAccesorios) {
    btnAccesorios.addEventListener('click', function() {
        seccionAccesorios.classList.add('activo');
        seccionFarmacia.classList.remove('activo');
    });
}

function abrirModalProducto(nombre, precio, descripcion, arrayFotos) {
    cantidadActual = 1;
    precioBaseActual = precio;
    nombreActual = nombre;
    imagenesProductos = arrayFotos;
    indiceImagen = 0;
    const nombreProd = document.getElementById('nombreProd');
    const descripcionProd = document.getElementById('descripcionProd');
    const precioProd = document.getElementById('total-prod');
    const imagenProd = document.getElementById('imgPrincipalProd');
    const cantidadProd = document.getElementById("cantidad-prod");
    nombreProd.textContent = nombre;
    descripcionProd.textContent = descripcion;
    precioProd.textContent = precio.toFixed(2);
    imagenProd.src = arrayFotos[0];
    imagenProd.alt = nombre;
    cantidadProd.textContent = cantidadActual;
    abrirModal('modal-producto');
}

function cargarProductos() {
    
    fetch('productos.json')
        .then(respuesta => respuesta.json())
        .then(productos => {           
            productos.forEach(producto => { 
                const plantillaHtml= 
                    `<div class="producto-item" onclick="abrirModalProducto('${producto.nombre}', ${producto.precio}, '${producto.descripcion}', ['${producto.imagenes[0]}', '${producto.imagenes[1]}'])">
                    <div class="producto-img-container">
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                    </div>
                    <div class="producto-info">
                    <h4>${producto.nombre}</h4>              
                    <p class="precio">$${producto.precio.toFixed(2)}</p>               
                    </div>
                    </div>`;
                if(producto.categoria === "farmacia") {
                    seccionFarmacia.innerHTML += plantillaHtml;
                    
                } else {
                    seccionAccesorios.innerHTML += plantillaHtml;                    
                }
            })
        })
        .catch(error => console.log("Hubo un error cargando los productos:", error));

}
cargarProductos();

function cambiarCantidad(cambio) {
    cantidadActual += cambio;
    if (cantidadActual < 1) {
        cantidadActual = 1
    }
    const cantidadProd = document.getElementById("cantidad-prod");
    cantidadProd.textContent = cantidadActual;
    const nuevoTotal = precioBaseActual * cantidadActual;
    const precioProd = document.getElementById('total-prod');
    precioProd.textContent = nuevoTotal.toFixed(2);
}

function agregarAlCarrito() {
    const nuevoArticulo = {
        nombre : nombreActual,
        cantidad : cantidadActual,
        precioUnitario : precioBaseActual,
        total : cantidadActual * precioBaseActual
        }
    const indice = carrito.findIndex((element) => element.nombre === nombreActual);
    if (indice != -1) {
        carrito[indice].cantidad += cantidadActual;
        carrito[indice].total = carrito[indice].cantidad * carrito[indice].precioUnitario;
    } else {
        carrito.push(nuevoArticulo);
    }
    actualizarContadorCarrito();
    renderizarCarrito();
}

function actualizarContadorCarrito() {
    let total = 0;
    carrito.forEach(element => total += element.cantidad);
    const contadorCarrito = document.getElementById("contador");
    contadorCarrito.textContent = total;
}

const btnAbrirCarrito = document.getElementById('btn-abrir-carrito');
const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
const carritoLateral = document.getElementById('carrito-lateral');
const overlayCarrito = document.getElementById('overlay-carrito');

if (btnAbrirCarrito) {
    btnAbrirCarrito.addEventListener('click', function() {
        carritoLateral.classList.add('activo');
        overlayCarrito.classList.add('activo');
    });
}

if (btnCerrarCarrito) {
    btnCerrarCarrito.addEventListener('click', function() {
        carritoLateral.classList.remove('activo');
        overlayCarrito.classList.remove('activo');
    });
}

if (overlayCarrito) {
    overlayCarrito.addEventListener('click', function() {
        carritoLateral.classList.remove('activo');
        overlayCarrito.classList.remove('activo');
    });
}

function renderizarCarrito() {
    const carritoItems = document.getElementById('contenedor-items-carrito');
    carritoItems.innerHTML = "";
    let granTotal = 0;
    carrito.forEach(producto => {
        granTotal += producto.total;
        const plantillaHtml = `
        <div class="item-en-carrito">
            <div class="item-carrito-info">
                <h4 class="item-carrito-nombre">${producto.nombre}</h4>
                <div class="item-carrito-controles">
                    <button class="btn-cantidad-carrito" onclick="modificarCantidadCarrito('${producto.nombre}', -1)">-</button>
                    <span class="item-carrito-cantidad">${producto.cantidad}</span>
                    <button class="btn-cantidad-carrito" onclick="modificarCantidadCarrito('${producto.nombre}', 1)">+</button>
                    <span class="item-carrito-precio-unitario">x $${producto.precioUnitario.toFixed(2)}</span>
                </div>
            </div>
            <div class="item-carrito-acciones">
                <span class="item-carrito-total">$${producto.total.toFixed(2)}</span>
                <button class="btn-eliminar-carrito" onclick="eliminarDelCarrito('${producto.nombre}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>`;
        carritoItems.innerHTML += plantillaHtml;
    })
    const granTotalCarrito = document.getElementById('gran-total-carrito');
    granTotalCarrito.textContent = granTotal.toFixed(2);
}

function eliminarDelCarrito(nombreProducto) {
    carrito = carrito.filter((producto) => producto.nombre !== nombreProducto);
    actualizarContadorCarrito();
    renderizarCarrito();
}

function modificarCantidadCarrito(nombre, cambio) {
    const indice = carrito.findIndex((element) => element.nombre === nombre); 
    carrito[indice].cantidad += cambio;
    if (carrito[indice].cantidad < 1) {
        carrito[indice].cantidad = 1;
    } else {
        carrito[indice].total = carrito[indice].cantidad * carrito[indice].precioUnitario;
        actualizarContadorCarrito();
        renderizarCarrito();
    }
}

function cambiarImagen(cambio) {
    indiceImagen += cambio;
    if (indiceImagen < 0) {
        indiceImagen = imagenesProductos.length -1;
    } else if (indiceImagen >= imagenesProductos.length) {
        indiceImagen = 0;
    }
    const imagenActual = document.getElementById("imgPrincipalProd");
    imagenActual.src = imagenesProductos[indiceImagen];
}

const btnpagar = document.getElementById('btn-pagar');
const modalCheckout = document.getElementById('modal-checkout');
const btnCerrarCheckout = document.getElementById('btn-cerrar-checkout');

if (btnpagar) {
    btnpagar.addEventListener('click', function() {
        if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
        }
        modalCheckout.classList.add('activo');
        carritoLateral.classList.remove('activo');
        document.body.classList.add('modal-abierto');
    });
}

if (btnCerrarCheckout) {
    btnCerrarCheckout.addEventListener('click', function() {
        modalCheckout.classList.remove('activo');      
        document.body.classList.remove('modal-abierto');        
        overlayCarrito.classList.remove('activo');
    });
}

const selectentrega = document.getElementById("select-entrega");
const cajadireccion = document.getElementById("caja-direccion");

if (selectentrega) {
    selectentrega.addEventListener("change", opcion => {
        let selectopcion = opcion.target.value;
        if ( selectopcion === "delivery") {
            cajadireccion.classList.remove('oculto');
        }
        else if ( selectopcion === "recojo") {
            cajadireccion.classList.add('oculto');
        }
    })
}

const btnEnviarPedido = document.getElementById('btn-enviar-pedido');
const modalExito = document.getElementById('modal-exito');

if (btnEnviarPedido) {
    btnEnviarPedido.addEventListener('click', function() {
        const inputNombre = document.getElementById('input-nombre').value;
        const campoDireccion = document.getElementById('caja-direccion');
        const inputDireccion = document.getElementById('input-direccion').value;
        if (inputNombre.trim() === "") {
            alert("Por favor, ingrese su nombre para proceder con el pedido.");
            return;
        } else if (!campoDireccion.classList.contains("oculto") && inputDireccion.trim() === "" ) {
            alert("Por favor, ingrese su dirección para proceder con el pedido.");
            return;
        }
        modalCheckout.classList.remove('activo');
        modalExito.classList.add('activo');
    });
}

if (modalExito) {
    modalExito.addEventListener('click', function() {
        window.location.reload();
    });
}