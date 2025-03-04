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

// VOTACIONES TIEMPO REAL

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAavOPGteAaKSdeARDKKH1wDqksQExCczI",
    authDomain: "prueba-premios-fpi.firebaseapp.com",
    projectId: "prueba-premios-fpi",
    storageBucket: "prueba-premios-fpi.firebasestorage.app",
    messagingSenderId: "315210231985",
    appId: "1:315210231985:web:65554b20824a46cd18b290",
    measurementId: "G-8LGQSFTDTD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    let timeLeft = 60;
    const timerElement = document.getElementById("timer");

    const countdown = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Tiempo restante: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerElement.textContent = "El tiempo de votación ha terminado";
            document.querySelectorAll(".vote-btn").forEach(btn => btn.disabled = true);
        }
    }, 1000);

    window.vote = async function (instructorId) {
        if (timeLeft <= 0) return;

        const docRef = doc(db, "votos", instructorId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, { votos: increment(1) });
        } else {
            await setDoc(docRef, { votos: 1 });
        }

        const message = document.getElementById("vote-message");
        message.style.display = "block";
        setTimeout(() => message.style.display = "none", 2000);
    };

    window.cambiarCategoria = function () {
        alert("Cambiando de categoría...");
    };
});