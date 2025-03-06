/**
 * FIREBASE
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // 🔹 Aquí se inicializa correctamente Firestore
const analytics = getAnalytics(app);


// ID único del usuario (se almacena en localStorage para evitar votos repetidos)
const userId = localStorage.getItem("userId") || Math.random().toString(36).substr(2, 9);
localStorage.setItem("userId", userId);

// 🔹 Lista de instructores
const instructores = [
    "Sandra-Grajales", "Liliana-Mejia", "Martha-Mejia", "Mariana-Restrepo",
    "Luz-Marina-Gonzalez", "Juan-Guillermo-Mosquera", "Marta-Islena-Rengifo",
    "Mauricio-Torres", "Oriana-Buitrago", "Angela-Morales", "Miguel-Seclen",
    "Sandra-Milena-Sarria", "Margarita-Vallejo", "Carlos-Carvajal",
    "Luis-Fernando-Ibañez", "Ana-Maria-Castro", "Juan-Manuel-Bustamante",
    "Claudia-Gil", "Jaime-Ramiro-Saavedra", "Lina-Moreno", "José-Dirley",
    "Isleny", "Gonzalo-Mosquera", "Daniel-Teatro"
];

// 🔹 Función para votar (con validación de voto único)
window.vote = async function (instructorId) {
    if (!instructorId) return;

    const userRef = doc(db, "usuarios", userId); // Documento único del usuario
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        alert("⚠️ Ya has votado, no puedes votar nuevamente.");
        return;
    }

    // Registrar voto en la colección "usuarios" para evitar votos repetidos
    await setDoc(userRef, { voto: instructorId });

    // Incrementar voto en la colección "votos"
    const docRef = doc(db, "votos", instructorId);
    await updateDoc(docRef, { votos: increment(1) });

    alert("✅ ¡Voto registrado con éxito!");
};

// 🔹 Escuchar cambios en Firebase en tiempo real y actualizar la página
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

                // Actualizar ganador en la UI
                actualizarGanador();
            }
        });
    });
}

// 🔹 Función para calcular el ganador en tiempo real
async function actualizarGanador() {
    let maxVotos = 0;
    let ganador = "Nadie aún";

    for (const instructor of instructores) {
        const docRef = doc(db, "votos", instructor);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const votos = docSnap.data().votos;
            if (votos > maxVotos) {
                maxVotos = votos;
                ganador = instructor.replace("-", " "); // Formato bonito
            }
        }
    }

    document.getElementById("ganador").textContent = `Ganador: ${ganador}`;
}

// 🔹 Iniciar la escucha de votos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    escucharVotos();
    actualizarGanador(); // Para mostrar el ganador al refrescar la página
});


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
