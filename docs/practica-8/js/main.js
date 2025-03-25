const d = document;
const $form = d.querySelector("#register-form");
const $nameInput = d.querySelector("#name");
const $nameError = d.querySelector("#name-error");
const $emailInput = d.querySelector("#email");
const $emailError = d.querySelector("#email-error");
const $passwordInput = d.querySelector("#password");
const $passwordError = d.querySelector("#password-error");
const $confirmPasswordInput = d.querySelector("#confirm-password");
const $confirmPasswordError = d.querySelector("#confirm-password-error");
const $successMessage = d.querySelector("#success-message");
const $errorsMessages = d.querySelectorAll(".error");

// Captura todos los inputs en orden
const inputs = [$nameInput, $emailInput, $passwordInput, $confirmPasswordInput];

// Deshabilitar validación automática del navegador en el email
$emailInput.setAttribute("novalidate", true);

// Crear loader dinámicamente
const $loader = document.createElement("div");
$loader.classList.add("loader");
$loader.style.display = "none";
$form.appendChild($loader);

// Barra de seguridad con tres secciones
const $passwordStrengthContainer = document.createElement("div");
$passwordStrengthContainer.classList.add("password-strength-container");

const $strengthBars = [];
for (let i = 0; i < 3; i++) {
  const bar = document.createElement("div");
  bar.classList.add("password-strength-bar");
  $passwordStrengthContainer.appendChild(bar);
  $strengthBars.push(bar);
}

// Texto de nivel de seguridad
const $passwordStrengthText = document.createElement("div");
$passwordStrengthText.classList.add("password-strength-text");

// Agregar elementos al DOM
$passwordInput.parentNode.appendChild($passwordStrengthContainer);
$passwordInput.parentNode.appendChild($passwordStrengthText);

// Función para agregar el ojo en los campos de contraseña
function addEyeIcon(inputField) {
  const eyeIcon = document.createElement("span");
  eyeIcon.classList.add("eye-icon");
  eyeIcon.innerHTML = "👁";
  inputField.parentNode.appendChild(eyeIcon);

  eyeIcon.addEventListener("click", () => {
    if (inputField.type === "password") {
      inputField.type = "text";
      eyeIcon.innerHTML = "👁‍🗨";
    } else {
      inputField.type = "password";
      eyeIcon.innerHTML = "👁";
    }
  });
}

// Agregar ojo en ambos campos de contraseña
addEyeIcon($passwordInput);
addEyeIcon($confirmPasswordInput);

// Validar fortaleza de la contraseña
$passwordInput.addEventListener("input", () => {
  let password = $passwordInput.value;
  let strength = 0;

  if (password.length >= 8) strength++; // Longitud mínima
  if (/[A-Z]/.test(password)) strength++; // Tiene mayúscula
  if (/[0-9]/.test(password)) strength++; // Tiene número
  if (/[@$!%*?&.,]/.test(password)) strength++; // Ahora incluye . y ,

  // Resetear colores de la barra
  $strengthBars.forEach(bar => bar.style.background = "#ddd");

  if (strength === 1) {
    $strengthBars[0].style.background = "red";
    $passwordStrengthText.textContent = "Debil";
    $passwordStrengthText.style.color = "red";
  } else if (strength === 2) {
    $strengthBars[0].style.background = "orange";
    $strengthBars[1].style.background = "orange";
    $passwordStrengthText.textContent = "Medio";
    $passwordStrengthText.style.color = "orange";
  } else if (strength === 3 || strength === 4) {
    $strengthBars.forEach(bar => bar.style.background = "green");
    $passwordStrengthText.textContent = "Fuerte";
    $passwordStrengthText.style.color = "green";
  } else {
    $passwordStrengthText.textContent = "";
  }
});

// Función para validar cada campo individualmente
function validateField(input) {
  let isValid = true;
  let errorElement = input.nextElementSibling; // Captura el div de error asociado

  if (input === $nameInput) {
    let namePattern = /^[A-Za-z\s]+$/;
    if (input.value.trim() === "") {
      errorElement.textContent = "El nombre es obligatorio";
      isValid = false;
    } else if (!namePattern.test(input.value.trim())) {
      errorElement.textContent = "El nombre solo puede contener letras y espacios";
      isValid = false;
    } else {
      errorElement.textContent = "";
    }
  }

  if (input === $emailInput) {
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (input.value.trim() === "") {
      errorElement.textContent = "El correo es obligatorio";
      isValid = false;
    } else if (!emailPattern.test(input.value.trim())) {
      errorElement.textContent = "El formato del correo es inválido. Debe incluir '@' y un dominio válido.";
      isValid = false;
    } else {
      errorElement.textContent = "";
    }
  }

  if (input === $passwordInput) {
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,])[A-Za-z\d@$!%*?&.,]{8,}$/;
    if (input.value.trim() === "") {
      errorElement.textContent = "La contraseña es obligatoria";
      isValid = false;
    } else if (!passwordPattern.test(input.value.trim())) {
      errorElement.textContent = "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@ $ ! % * ? & . ,).";
      isValid = false;
    } else {
      errorElement.textContent = "";
    }
  }

  if (input === $confirmPasswordInput) {
    if (input.value.trim() === "") {
      errorElement.textContent = "La confirmación es obligatoria";
      isValid = false;
    } else if (input.value.trim() !== $passwordInput.value.trim()) {
      errorElement.textContent = "Las contraseñas no coinciden";
      isValid = false;
    } else {
      errorElement.textContent = "";
    }
  }

  return isValid;
}

// Navegación con ENTER entre campos (solo avanza si es válido)
inputs.forEach((input, index) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el envío automático del formulario

      if (validateField(input)) {
        if (index < inputs.length - 1) {
          inputs[index + 1].focus(); // Mueve el foco al siguiente input
        } else {
          $form.querySelector("input[type='submit']").focus(); // Si es el último, enfoca el botón de enviar
        }
      }
    }
  });
});

// Reseteo completo del formulario
function resetForm() {
  $form.reset();
  $passwordStrengthText.textContent = "";
  $strengthBars.forEach(bar => bar.style.background = "#ddd");
  $errorsMessages.forEach(error => error.textContent = ""); // Limpia los mensajes de error
}

// Función para validar y enviar el formulario
function validateForm(e) {
  e.preventDefault();

  let isValid = true;

  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  if (isValid) {
    $loader.style.display = "block"; 

    setTimeout(() => {
      $loader.style.display = "none"; 
      $successMessage.textContent = "Formulario enviado exitosamente";
      resetForm();

      setTimeout(() => {
        $successMessage.textContent = "";
      }, 3000);
    }, 5000);
  }
}

$form.addEventListener("submit", validateForm);
