const d = document;
const $listaCarrito = d.querySelector("#lista-carrito");
const $totalCarrito = d.querySelector("#total-carrito");
const $btnCompra = d.querySelector("#btn-compra");
const $mensajeCompra = d.querySelector("#mensaje-compra");

let bloqueoCarrito = false;
let carrito = {}; // Objeto para almacenar los productos y sus cantidades

$btnCompra.addEventListener("click", function () {
  if (Object.keys(carrito).length > 0) {
    bloqueoCarrito = true;
    bloquearEdicionCarrito(); // Deshabilita los controles del carrito
    mostrarLoader(); // Muestra el loader

    setTimeout(() => {
      finalizarCompra();
    }, 5000);
  } else {
    alert("El carrito está vacío");
  }
});

d.addEventListener("click", function (e) {
  if (e.target.matches(".producto") && !bloqueoCarrito) {
    const id = e.target.getAttribute("data-id");
    const nombre = e.target.getAttribute("data-nombre");
    const precio = parseFloat(e.target.getAttribute("data-precio"));

    if (carrito[id]) {
      carrito[id].cantidad++;
    } else {
      carrito[id] = {
        nombre,
        precio,
        cantidad: 1,
      };
    }

    actualizarCarrito();
  }

  // Aumentar cantidad
  if (e.target.matches(".btn-aumentar") && !bloqueoCarrito) {
    const id = e.target.dataset.id;
    carrito[id].cantidad++;
    actualizarCarrito();
  }

  // Disminuir cantidad
  if (e.target.matches(".btn-disminuir") && !bloqueoCarrito) {
    const id = e.target.dataset.id;
    if (carrito[id].cantidad > 1) {
      carrito[id].cantidad--;
    } else {
      delete carrito[id]; // Si la cantidad es 0, eliminar el producto del carrito
    }
    actualizarCarrito();
  }
});

// Detectar cambios en el input de cantidad cuando el usuario termina de escribir
d.addEventListener("change", function (e) {
  if (e.target.matches(".cantidad") && !bloqueoCarrito) {
    const id = e.target.dataset.id;
    let nuevaCantidad = parseInt(e.target.value, 10);

    if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
      carrito[id].cantidad = nuevaCantidad;
    } else {
      delete carrito[id]; // Si el usuario pone 0 o un valor inválido, eliminar el producto
    }

    actualizarCarrito(id);
  }
});

// Seleccionar automáticamente todo el contenido cuando el usuario hace clic en el input
d.addEventListener("focusin", function (e) {
  if (e.target.matches(".cantidad")) {
    e.target.select(); // Selecciona automáticamente el valor actual para sobreescribirlo
  }
});

function actualizarCarrito(focusId = null) {
  let total = 0;

  $listaCarrito.innerHTML = "";

  Object.entries(carrito).forEach(([id, producto]) => {
    const $itemCarrito = d.createElement("li");
    $itemCarrito.innerHTML = `
      ${producto.nombre} - $${producto.precio} 
      <button class="btn-disminuir" data-id="${id}">-</button>
      <input type="number" class="cantidad" data-id="${id}" value="${producto.cantidad}" min="0">
      <button class="btn-aumentar" data-id="${id}">+</button>
    `;

    $listaCarrito.appendChild($itemCarrito);
    total += producto.precio * producto.cantidad;
  });

  $totalCarrito.textContent = total;
}

// Bloquear la edición del carrito
function bloquearEdicionCarrito() {
  const botones = d.querySelectorAll(".btn-aumentar, .btn-disminuir");
  const inputs = d.querySelectorAll(".cantidad");

  botones.forEach(btn => btn.disabled = true);
  inputs.forEach(input => input.disabled = true);
}

// Desbloquear el carrito después de la compra
function desbloquearEdicionCarrito() {
  const botones = d.querySelectorAll(".btn-aumentar, .btn-disminuir");
  const inputs = d.querySelectorAll(".cantidad");

  botones.forEach(btn => btn.disabled = false);
  inputs.forEach(input => input.disabled = false);
}

// Función para mostrar el loader
function mostrarLoader() {
  $mensajeCompra.innerHTML = `
    <div class="loader"></div>
    <p>Procesando la compra...</p>
  `;
  $mensajeCompra.classList.remove("hidden");
}

// Función para finalizar la compra
function finalizarCompra() {
  $mensajeCompra.innerHTML = `<p>¡Compra realizada con éxito!</p>`;

  setTimeout(() => {
    $mensajeCompra.classList.add("hidden");
    limpiarCarrito();
    desbloquearEdicionCarrito();
  }, 2000);
}

function limpiarCarrito() {
  carrito = {};
  actualizarCarrito();
  bloqueoCarrito = false;
}