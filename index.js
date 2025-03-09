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

  // Evita el desplazamiento cuando el menú está abierto
  if (navbar.classList.contains("active")) {
      document.body.style.overflow = "hidden";
  } else {
      document.body.style.overflow = "";
  }
};

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