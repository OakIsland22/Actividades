const d = document;
const $productosContainer = d.querySelector("#productos-container");
const $listaCarrito = d.querySelector("#lista-carrito");
const $totalCarrito = d.querySelector("#total-carrito");
const $btnCompra = d.querySelector("#btn-compra");
const $mensajeCompra = d.querySelector("#mensaje-compra");

let carrito = {};

// Función para obtener productos de la API
async function cargarProductos() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        const productos = await res.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        $productosContainer.innerHTML = "<p>Error al cargar los productos.</p>";
    }
}

// Función para mostrar los productos en la tienda
function mostrarProductos(productos) {
    $productosContainer.innerHTML = "";
    
    productos.forEach(producto => {
        const $producto = d.createElement("article");
        $producto.classList.add("producto");
        $producto.setAttribute("data-id", producto.id);
        $producto.setAttribute("data-nombre", producto.title);
        $producto.setAttribute("data-precio", producto.price);
        
        $producto.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}" width="100">
            <h3>${producto.title}</h3>
            <p>$${producto.price}</p>
            <button class="agregar-carrito" data-id="${producto.id}" data-nombre="${producto.title}" data-precio="${producto.price}">Agregar</button>
        `;

        $productosContainer.appendChild($producto);
    });
}

// Evento para agregar productos al carrito
d.addEventListener("click", function (e) {
    if (e.target.matches(".agregar-carrito")) {
        const id = e.target.dataset.id;
        const nombre = e.target.dataset.nombre;
        const precio = parseFloat(e.target.dataset.precio);

        if (carrito[id]) {
            carrito[id].cantidad++;
        } else {
            carrito[id] = { nombre, precio, cantidad: 1 };
        }

        actualizarCarrito();
    }
});

// Función para actualizar el carrito
function actualizarCarrito() {
    $listaCarrito.innerHTML = "";
    let total = 0;

    Object.entries(carrito).forEach(([id, producto]) => {
        const $itemCarrito = d.createElement("li");
        $itemCarrito.innerHTML = `
            ${producto.nombre} - $${producto.precio.toFixed(2)} 
            <button class="btn-disminuir" data-id="${id}">-</button>
            <input type="number" class="cantidad" data-id="${id}" value="${producto.cantidad}" min="0">
            <button class="btn-aumentar" data-id="${id}">+</button>
        `;

        $listaCarrito.appendChild($itemCarrito);
        total += producto.precio * producto.cantidad;
    });

    // Formatear el total a 2 decimales
    $totalCarrito.textContent = total.toFixed(2);
}

// Eventos para aumentar/disminuir cantidad en el carrito
d.addEventListener("click", function (e) {
    if (e.target.matches(".btn-aumentar")) {
        const id = e.target.dataset.id;
        carrito[id].cantidad++;
        actualizarCarrito();
    }

    if (e.target.matches(".btn-disminuir")) {
        const id = e.target.dataset.id;
        if (carrito[id].cantidad > 1) {
            carrito[id].cantidad--;
        } else {
            delete carrito[id];
        }
        actualizarCarrito();
    }
});

// Evento para modificar la cantidad directamente en el input
d.addEventListener("change", function (e) {
    if (e.target.matches(".cantidad")) {
        const id = e.target.dataset.id;
        let nuevaCantidad = parseInt(e.target.value, 10);

        if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
            carrito[id].cantidad = nuevaCantidad;
        } else {
            delete carrito[id]; // Si el usuario pone 0, se elimina el producto
        }

        actualizarCarrito();
    }
});

// Evento para que al hacer clic en el input, se seleccione todo el contenido
d.addEventListener("focusin", function (e) {
    if (e.target.matches(".cantidad")) {
        e.target.select();
    }
});

// Evento para procesar la compra
$btnCompra.addEventListener("click", function () {
  if (Object.keys(carrito).length > 0) {
      $btnCompra.disabled = true; // Desactivar el botón de comprar
      bloquearEdicionCarrito();
      mostrarLoader();

      setTimeout(() => {
          finalizarCompra();
      }, 5000);
  } else {
      alert("El carrito está vacío");
  }
});

// Bloquear edición del carrito mientras se paga
function bloquearEdicionCarrito() {
    const botones = d.querySelectorAll(".btn-aumentar, .btn-disminuir, .agregar-carrito");
    const inputs = d.querySelectorAll(".cantidad");

    botones.forEach(btn => btn.disabled = true);
    inputs.forEach(input => input.disabled = true);
}

// Desbloquear carrito después de la compra
function desbloquearEdicionCarrito() {
    const botones = d.querySelectorAll(".btn-aumentar, .btn-disminuir, .agregar-carrito");
    const inputs = d.querySelectorAll(".cantidad");

    botones.forEach(btn => btn.disabled = false);
    inputs.forEach(input => input.disabled = false);
}
// Función para mostrar el loader y mensaje de compra en el centro de la pantalla
function mostrarLoader() {
  $mensajeCompra.innerHTML = `
      <div class="loader"></div>
      <p>Procesando la compra...</p>
  `;
  $mensajeCompra.style.display = "flex"; // Mostrar mensaje
}

// Función para finalizar la compra y reactivar el botón
function finalizarCompra() {
  $mensajeCompra.innerHTML = `<h2>¡Compra realizada con éxito!</h2><p>Gracias por su compra.</p>`;

  setTimeout(() => {
      $mensajeCompra.style.display = "none"; // Ocultar mensaje después de 2 segundos
      carrito = {};
      actualizarCarrito();
      desbloquearEdicionCarrito();
      $btnCompra.disabled = false; // Reactivar el botón después de completar la compra
  }, 2000);
}

// Cargar productos al inicio
cargarProductos();
