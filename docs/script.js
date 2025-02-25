// Mostrar botón para volver arriba
window.onscroll = function() {
    let btn = document.getElementById("btnArriba");
    if (document.documentElement.scrollTop > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

// Volver arriba al hacer clic
document.getElementById("btnArriba").addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Validación del formulario
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Mensaje enviado correctamente");
});