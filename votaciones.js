import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, updateDoc, increment, onSnapshot, getDocs, collection } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAavOPGteAaKSdeARDKKH1wDqksQExCczI",
    authDomain: "prueba-premios-fpi.firebaseapp.com",
    projectId: "prueba-premios-fpi",
    storageBucket: "prueba-premios-fpi.firebasestorage.app",
    messagingSenderId: "315210231985",
    appId: "1:315210231985:web:65554b20824a46cd18b290",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Detectar la categoría actual
const categoriaActual = document.body.getAttribute("data-categoria");

// 🔹 Función para votar y bloquear los otros botones en la categoría actual
async function vote(instructorId) {
    const docRef = doc(db, "votos", instructorId);

    try {
        await updateDoc(docRef, { votos: increment(1) });

        // Guardar en localStorage que el usuario ha votado en esta categoría
        localStorage.setItem(`yaVoto_${categoriaActual}`, "true");

        // Bloquear todos los botones de la categoría después del voto
        document.querySelectorAll(".vote-btn").forEach(button => {
            button.disabled = true;
            button.style.backgroundColor = "gray";
            button.style.cursor = "not-allowed";
        });

        alert("¡Voto registrado con éxito! ✅");
    } catch (error) {
        console.error("Error al votar:", error);
        alert("Hubo un error al votar. Intenta de nuevo.");
    }
}

// 🔹 Función para bloquear botones si el usuario ya votó en esta categoría
function verificarVoto() {
    if (localStorage.getItem(`yaVoto_${categoriaActual}`) === "true") {
        document.querySelectorAll(".vote-btn").forEach(button => {
            button.disabled = true;
            button.style.backgroundColor = "gray";
            button.style.cursor = "not-allowed";
        });
    }
}

// 🔹 Escuchar cambios en Firebase en tiempo real
async function escucharVotos() {
    const instructores = {
        "categoria1": ["Sandra-Grajales", "Liliana-Mejia", "Martha-Mesa", "Mariana-Restrepo"],
        "categoria2": ["Luz-Marina-Gonzalez", "Juan-Guillermo-Mosquera", "Marta-Islena-Rengifo", "Mauricio-Torres"],
        "categoria3": ["Oriana-Buitrago", "Angela-Morales", "Miguel-Seclen", "Sandra-Milena-Sarria"],
        "categoria4": ["Margarita-Vallejo", "Carlos-Carvajal", "Luis-Fernando-Ibañez", "Ana-Maria-Castro"],
        "categoria5": ["Juan-Manuel-Bustamante", "Claudia-Gil", "Jaime-Ramiro-Saavedra", "Lina-Moreno"],
        "categoria6": ["José-Dirley", "Isleny", "Gonzalo-Mosquera", "Daniel-Teatro", "Luz-Adriana-Sanz", "Carlos-Andres-Orozco", "Franklin-Zapata-Calle"]
    }[categoriaActual] || [];

    const snapshot = await getDocs(collection(db, "votos"));
    let totalVotos = 0;

    snapshot.forEach(doc => {
        totalVotos += doc.data().votos;
    });

    instructores.forEach(instructor => {
        const docRef = doc(db, "votos", instructor);

        onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const votos = docSnap.data().votos;
                document.getElementById(`votes-${instructor}`).textContent = `Votos: ${votos}`;

                // Calcular porcentaje y actualizar la barra de progreso
                const porcentaje = totalVotos > 0 ? (votos / totalVotos) * 100 : 0;
                document.getElementById(`progress-${instructor}`).style.width = `${porcentaje}%`;
            }
        });
    });
}

// 🔹 Bloquear votos si ya votó en esta categoría
document.addEventListener("DOMContentLoaded", () => {
    verificarVoto();

    document.querySelectorAll(".vote-btn").forEach(button => {
        button.addEventListener("click", () => {
            const instructorId = button.getAttribute("data-instructor");
            vote(instructorId);
        });
    });

    escucharVotos();
});

// 🔹 Función para actualizar el ganador
async function actualizarGanador() {
    const instructores = {
        "categoria1": ["Sandra-Grajales", "Liliana-Mejia", "Martha-Mesa", "Mariana-Restrepo"],
        "categoria2": ["Luz-Marina-Gonzalez", "Juan-Guillermo-Mosquera", "Marta-Islena-Rengifo", "Mauricio-Torres"],
        "categoria3": ["OtroInstructor1", "OtroInstructor2", "OtroInstructor3"]
    }[categoriaActual] || [];

    let maxVotos = 0;
    let ganadorActual = "Aún en proceso...";

    const promesas = instructores.map(async (instructor) => {
        const docRef = doc(db, "votos", instructor);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const votos = docSnap.data().votos || 0;
            if (votos > maxVotos) {
                maxVotos = votos;
                ganadorActual = instructor.replace("-", " ");
            }
        }
    });

    await Promise.all(promesas);
    document.getElementById("ganador").textContent = ganadorActual;
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
            actualizarGanador();
        }
    }, 1000);
});