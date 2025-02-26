'use strict';



/**
 * add event listener on multiple elements
 */
const addEventListener = function (elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}




/**
 * NAVBAR TOGGLE FOR MOBILE
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
}

// Agregar evento de clic a todos los botones que activan el menú
navTogglers.forEach((btn) => {
    btn.addEventListener("click", toggleNavbar);
});

// Cerrar el menú cuando se hace clic en el overlay
overlay.addEventListener("click", toggleNavbar);

/**
 * HEADER
 * Activa el header cuando el usuario baja más de 100px
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
        header.classList.add("active");
    } else {
        header.classList.remove("active");
    }
});



/**
 * SLIDER FUNCIONAL
 */

document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll("[data-slider-container]");

    sliders.forEach((sliderContainer) => {
        const sliderPrevBtn = sliderContainer.closest(".hero-slider").querySelector("[data-slider-prev]");
        const sliderNextBtn = sliderContainer.closest(".hero-slider").querySelector("[data-slider-next]");

        let currentSlidePos = 0;

        const moveSliderItem = function () {
            sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
        };

        /**
         * FUNCIÓN PARA PASAR AL SIGUIENTE SLIDE
         */
        const slideNext = function () {
            if (currentSlidePos >= sliderContainer.childElementCount - 1) {
                currentSlidePos = 0;
            } else {
                currentSlidePos++;
            }
            moveSliderItem();
        };

        sliderNextBtn.addEventListener("click", slideNext);

        /**
         * FUNCIÓN PARA PASAR AL SLIDE ANTERIOR
         */
        const slidePrev = function () {
            if (currentSlidePos <= 0) {
                currentSlidePos = sliderContainer.childElementCount - 1;
            } else {
                currentSlidePos--;
            }
            moveSliderItem();
        };

        sliderPrevBtn.addEventListener("click", slidePrev);

        /**
         * OCULTAR BOTONES SI SOLO HAY UN SLIDE
         */
        if (sliderContainer.childElementCount <= 1) {
            sliderNextBtn.style.display = "none";
            sliderPrevBtn.style.display = "none";
        }
    });
});


// ABOUT ACCORDION
document.addEventListener("DOMContentLoaded", function () {
    const accordions = document.querySelectorAll("[data-accordion]");
  
    accordions.forEach((accordion) => {
      const accordionBtn = accordion.querySelector("[data-accordion-btn]");
  
      accordionBtn.addEventListener("click", function () {
        // Cerrar todos los acordeones antes de abrir el seleccionado
        accordions.forEach((item) => {
          if (item !== accordion) {
            item.classList.remove("expanded");
          }
        });
  
        // Alternar el acordeón actual
        accordion.classList.toggle("expanded");
      });
    });
});

// SISTEMA DE VOTACION TIEMPO REAL
document.addEventListener("DOMContentLoaded", () => {
  let timeLeft = 60;
  const timerElement = document.getElementById("timer");
  const nextCategoryBtn = document.getElementById("next-category");
  const categories = [
    "Calidad Humana", "Dinámico", "Mejor enseñanza", 
    "Innovación en la enseñanza", "Más paciente", "Cursos complementarios"
  ];
  let currentCategory = 0;

  // Iniciar cronómetro
  const countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Tiempo restante: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerElement.textContent = "El tiempo de votación ha terminado";
      document.querySelectorAll(".vote-btn").forEach(btn => btn.disabled = true);
    }
  }, 1000);

  // Función de votación
  window.vote = function (instructorId) {
    if (timeLeft <= 0) return;

    const docRef = db.collection("votos").doc(instructorId);
    
    docRef.get().then((doc) => {
      if (doc.exists) {
        docRef.update({ votos: firebase.firestore.FieldValue.increment(1) });
      } else {
        docRef.set({ votos: 1 });
      }
    });

    // Mostrar mensaje emergente
    const message = document.getElementById("vote-message");
    message.style.display = "block";
    setTimeout(() => message.style.display = "none", 2000);
  };

  // Actualizar votos y barra de progreso
  function actualizarVotos(instructorId, elemento, barra) {
    db.collection("votos").doc(instructorId).onSnapshot((doc) => {
      if (doc.exists) {
        const votos = doc.data().votos;
        elemento.textContent = `Votos: ${votos}`;
        barra.style.width = `${Math.min(votos * 10, 100)}%`;
      } else {
        elemento.textContent = "Votos: 0";
        barra.style.width = "0%";
      }
    });
  }

  // Configurar eventos de votación y actualización en tiempo real
  document.querySelectorAll(".project-card").forEach((card) => {
    const instructorId = card.querySelector("h3 p").textContent;
    const contador = card.querySelector(".vote-count");
    const barra = card.querySelector(".progress-bar");

    actualizarVotos(instructorId, contador, barra);

    card.addEventListener("click", () => vote(instructorId));
  });

  // Cambiar de categoría
  nextCategoryBtn.addEventListener("click", () => {
    currentCategory = (currentCategory + 1) % categories.length;
    document.getElementById("project-label").textContent = categories[currentCategory];
  });

  // FIREBASE PRUEBA
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAavOPGteAaKSdeARDKKH1wDqksQExCczI",
    authDomain: "prueba-premios-fpi.firebaseapp.com",
    projectId: "prueba-premios-fpi",
    storageBucket: "prueba-premios-fpi.firebasestorage.app",
    messagingSenderId: "315210231985",
    appId: "1:315210231985:web:65554b20824a46cd18b290",
    measurementId: "G-8LGQSFTDTD"
  };
});