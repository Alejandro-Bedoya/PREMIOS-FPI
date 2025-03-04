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

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

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
const analytics = getAnalytics(app);
const db = getFirestore(app);

const instructores = [
    "Sandra-Grajales", "Liliana-Mejia", "Martha-Mejia", "Mariana-Restrepo",
    "Luz-Marina-Gonzalez", "Juan-Guillermo-Mosquera", "Marta-Islena-Rengifo",
    "Mauricio-Torres", "Oriana-Buitrago", "Angela-Morales", "Miguel-Seclen",
    "Sandra-Milena-Sarria", "Margarita-Vallejo", "Carlos-Carvajal",
    "Luis-Fernando-Ibañez", "Ana-Maria-Castro", "Juan-Manuel-Bustamante",
    "Claudia-Gil", "Jaime-Ramiro-Saavedra", "Lina-Moreno", "José-Dirley",
    "Isleny", "Gonzalo-Mosquera", "Daniel-Teatro"
];

// 🔹 Función para votar
window.vote = async function (instructorId) {
    if (timeLeft <= 0) return;

    const docRef = doc(db, "votos", instructorId);
    await updateDoc(docRef, { votos: increment(1) });

    const message = document.getElementById("vote-message");
    message.style.display = "block";
    setTimeout(() => message.style.display = "none", 2000);
};

// 🔹 Escuchar cambios en Firebase en tiempo real y actualizar en la página
function escucharVotos() {
    instructores.forEach(instructor => {
        const docRef = doc(db, "votos", instructor);
        
        onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const votos = docSnap.data().votos;
                const voteCountElement = document.getElementById(`votes-${instructor}`);
                const progressBarElement = document.getElementById(`progress-${instructor}`);
                
                if (voteCountElement) {
                    voteCountElement.textContent = `Votos: ${votos}`;
                }
                if (progressBarElement) {
                    progressBarElement.style.width = `${votos * 5}px`; // Ajusta según la escala que quieras
                }
            }
        });
    });
}

// 🔹 Temporizador de votación
let timeLeft = 60;
document.addEventListener("DOMContentLoaded", () => {
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
    
    escucharVotos();   // Escuchar actualizaciones en tiempo real
});

// 🔹 Función para cambiar de categoría
window.cambiarCategoria = function () {
    alert("Cambiando de categoría...");
};
