// ====== EYE ======

window.addEventListener('DOMContentLoaded', () => {
  const eye = document.querySelector('.eye');
  const pupil = document.querySelector('.pupil');
  const arts = document.querySelectorAll('.art');
  const radius = 400;

  // distribute images in a circle
  arts.forEach((art, i) => {
    const angle = (i / arts.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    art.style.setProperty('--x', `${x}px`);
    art.style.setProperty('--y', `${y}px`);

    // random float duration for each art
    const duration = 5 + Math.random() * 3; // 5-8s
    art.style.setProperty('--floatDuration', `${duration}s`);
  });

  // pupil follows mouse
  document.addEventListener('mousemove', e => {
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - eyeCenterX;
    const dy = e.clientY - eyeCenterY;

    const maxMovement = 50; 
    const distance = Math.min(Math.sqrt(dx*dx + dy*dy), maxMovement);

    const angle = Math.atan2(dy, dx);
    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);

    pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });
});



// ====== AI Μηνύματα για net έργα ======
const aiTexts = [
  "Μήπως προτιμάς κάτι πιο... σύγχρονο;",
  "Αυτό είναι αρκετά παλιομοδίτικο... έλα να δούμε κάτι φρέσκο!",
  "Σίγουρα θέλεις να δεις αυτό; Ίσως υπάρχει ένα πιο ενδιαφέρον έργο…",
  "Σίγουρα θες αυτό; Δεν θες κάτι λιγότερο… βαρετό;",
  "Σκέψου το λίγο ακόμα… υπάρχει κάτι πιο καλό",
  "Θέλω να δεις κάτι όμορφο, όχι κάτι συνηθισμένο",
  "Αν θες να σε καθοδηγήσω, έχω μια καλύτερη ιδέα."
];

const netFigures = document.querySelectorAll(".art.NET");
const eyeAI = document.getElementById("eyeAI");
const PROXIMITY_DISTANCE = 120;

let aiVisible = false;

document.addEventListener("mousemove", (e) => {
  let nearNetArt = false;

  netFigures.forEach(fig => {
    const rect = fig.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < PROXIMITY_DISTANCE) {
      nearNetArt = true;
    }
  });

  if (nearNetArt && !aiVisible) {
    const randomText = aiTexts[Math.floor(Math.random() * aiTexts.length)];
    eyeAI.textContent = randomText;
    eyeAI.classList.add("show");
    aiVisible = true;
  }

  if (!nearNetArt && aiVisible) {
    eyeAI.classList.remove("show");
    aiVisible = false;
  }
});


// ====== TRACKING ======
let viewedImages = [];
let clickedImages = [];
let hoverStartTime = {};

const artImages = document.querySelectorAll(".art img");

artImages.forEach(img => {
    img.addEventListener("mouseenter", () => {
        hoverStartTime[img.src] = Date.now();
    });

    img.addEventListener("mouseleave", () => {
        const timeSpent = Date.now() - hoverStartTime[img.src];
        viewedImages.push({
            image: img.src,
            alt: img.alt,
            duration: timeSpent
        });
    });

    img.addEventListener("click", () => {
        clickedImages.push({
            image: img.src,
            alt: img.alt,
            time: new Date().toISOString()
        });
    });
});

// ====== Generative Art Button ======
// ====== Generative Art Button ======
document.getElementById("generateArt").addEventListener("click", () => {
  const resultBox = document.getElementById("artResult");
  resultBox.classList.add("show");
  resultBox.classList.remove("hidden");

  // ===== Canvas & Context =====
  const canvas = document.getElementById("artCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";

  const eye = document.querySelector(".eye");
  const arts = document.querySelectorAll(".art");

  const canvasRect = canvas.getBoundingClientRect();
  const eyeRect = eye.getBoundingClientRect();

  // Eye center relative to canvas
  const cx = eyeRect.left + eyeRect.width / 2 - canvasRect.left;
  const cy = eyeRect.top + eyeRect.height / 2 - canvasRect.top;

  let steps = 0;
  const maxSteps = 160;

  function drawStep() {
    if (steps > maxSteps) return;

    const art = arts[Math.floor(Math.random() * arts.length)];
    const isGAN = art.classList.contains("GAN");

    const angle = Math.random() * Math.PI * 2;

    // GAN pulled inward, NET pushed outward
    const baseRadius = isGAN
      ? 80 + Math.random() * 120
      : 200 + Math.random() * 220;

    const radius = baseRadius * (isGAN ? 0.8 : 1.1);

    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    const hue = isGAN ? 0 + Math.random() * 30 : 200 + Math.random() * 60;

    ctx.beginPath();
    ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${isGAN ? 0.8 : 0.35})`;
    ctx.lineWidth = isGAN ? 2.5 : 1;

    const arcLength = isGAN ? Math.PI * 1.2 : Math.PI * Math.random();

    ctx.arc(x, y, radius * 0.3, 0, arcLength);
    ctx.stroke();

    steps++;
    requestAnimationFrame(drawStep);
  }

  drawStep();
});



// ====== SEND TO SERVER ======
function sendTrackingData() {
    const payload = {
        viewed: viewedImages,
        clicked: clickedImages
    };

    fetch('/artProject/saveData.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        console.log("SERVER RESPONSE:", data);
    })
    .catch(err => console.error("ERROR:", err));
}

// ====== DEBUG BUTTON ======
document.getElementById("showData").addEventListener("click", () => {
    const debug = document.getElementById("debugOutput");

    const output = {
        viewed_images: viewedImages,
        clicked_images: clickedImages
    };

    debug.textContent = JSON.stringify(output, null, 2);

    // Στέλνει τα δεδομένα στη βάση μία φορά
    sendTrackingData();
});
