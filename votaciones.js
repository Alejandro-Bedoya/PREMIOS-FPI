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