let productos = [
  { nombre: "Laptop", precio: 10000, stock: 5 },
  { nombre: "Mouse", precio: 200, stock: 16 },
  { nombre: "Monitor", precio: 5000, stock: 6 },
  { nombre: "Audifonos", precio: 1000, stock: 15 },
  { nombre: "Teclado", precio: 250, stock: 10 },
];

// 2. Agregar Productos al Carrito:
let carrito = [];

function agregarAlCarrito(productoNombre, cantidad) {
  let encontrado = false;

  for (let producto of productos) {
    if (producto.nombre.toLowerCase() === productoNombre.toLowerCase()) {
      encontrado = true;

      if (producto.stock >= cantidad) {
        carrito.push({
          nombre: productoNombre,
          cantidad: cantidad,
          precio: producto.precio,
        });

        producto.stock -= cantidad;
        console.log(`* ${cantidad} ${productoNombre}(s) agregado(s) al carrito.`);
      } else {
        console.log(`No hay suficiente stock del producto "${productoNombre}".`);
      }
      break;
    }
  }

  if (!encontrado) {
    console.log(`El producto "${productoNombre}" no está disponible en la tienda.`);
  }

  console.log(productos);
  console.log(carrito);
  console.log("***************************");
}

// 3. Calcular el Total del Carrito:
function calcularTotal() {
  let total = 0;
  for (let item of carrito) {
    total += item.precio * item.cantidad;
  }

  return total;
}

// 4. Aplicar Descuentos:
function aplicarDescuento(total) {
  if (total > 100) {
    return total * 0.9;
  }

  return total;
}

// 5. Simular el Proceso de Compra
function procesarCompra() {
  console.log("Procesando compra...");
  setTimeout(function () {
    let total = calcularTotal();
    total = aplicarDescuento(total);
    console.log(`Compra completada. Total a pagar: $${total.toFixed(2)}`);
  }, 3000);
}

// 6. Ejecuta el Código:
agregarAlCarrito("Laptop", 5);
agregarAlCarrito("Mouse", 7);
agregarAlCarrito("Teclado", 5);
// Producto no disponible
agregarAlCarrito("Zapatos", 1);

// Mostrar carrito antes de eliminar
console.log("Carrito antes de eliminar:", carrito);

// Eliminar producto
console.log("Eliminando del carrito");
eliminarProductoDelCarrito("Laptop");
CuentaRegresiva(3);
// Procesar compra
procesarCompra();

// 7. Eliminar Productos del Carrito
function eliminarProductoDelCarrito(productoEliminar) {
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].nombre.toLowerCase() === productoEliminar.toLowerCase()) {
      for (let j = 0; j < productos.length; j++) {
        if (productos[j].nombre.toLowerCase() === productoEliminar.toLowerCase()) {
          productos[j].stock += carrito[i].cantidad;
          break;
        }
      }

      carrito.splice(i, 1);
      console.log(`"${productoEliminar}" eliminado del carrito.`);
      return;
    }
  }
  console.log(`"${productoEliminar}" no está en el carrito.`);
}

// 8. Tiempo restante para confirmar la compra
function CuentaRegresiva(segundos) {
  let tiempoRestante = segundos;

  let intervalo = setInterval(() => {
    if (tiempoRestante > 0) {
      console.log(`Compra confirmada en ${tiempoRestante}...`);
      tiempoRestante--;
    } else {
      clearInterval(intervalo);
      console.log("¡Compra confirmada! :)");
    }
  }, 1000);
}