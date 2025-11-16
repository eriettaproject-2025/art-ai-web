// ====== AI Μηνύματα για Human έργα ======
const humanFigures = document.querySelectorAll("figure.art.human");

const aiTexts = [
    "Μήπως προτιμάς κάτι πιο... σύγχρονο;",
    "Αυτό είναι αρκετά παλιομοδίτικο... έλα να δούμε κάτι φρέσκο!",
    "Σίγουρα θέλεις να δεις αυτό; Ίσως υπάρχει ένα πιο ενδιαφέρον έργο…",
    "Σίγουρα θες αυτό; Δεν θες κάτι λιγότερο… βαρετό;",
    "Σκέψου το λίγο ακόμα… υπάρχει κάτι πιο καλό", 
    "Θέλω να δεις κάτι όμορφο, όχι κάτι συνηθισμένο", 
    "Αν θες να σε καθοδηγήσω, έχω μια καλύτερη ιδέα."
];

humanFigures.forEach(fig => {
    const aiSpan = fig.querySelector(".ai-message");
    if (!aiSpan) {
        console.warn("Δεν βρέθηκε span για AI μήνυμα στο figure:", fig);
        return;
    }

    fig.addEventListener("mouseenter", () => {
        const randomText = aiTexts[Math.floor(Math.random() * aiTexts.length)];
        aiSpan.textContent = randomText;
        aiSpan.classList.add("show");
    });

    fig.addEventListener("mouseleave", () => {
        aiSpan.classList.remove("show");
    });
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
document.getElementById("generateArt").addEventListener("click", () => {
    const canvas = document.getElementById("artCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ganScore = viewedImages.filter(v => v.image.includes("GAN")).length +
                     clickedImages.filter(c => c.image.includes("GAN")).length;

    const humanScore = viewedImages.filter(v => v.image.includes("HUMAN")).length +
                       clickedImages.filter(c => c.image.includes("HUMAN")).length;

    for (let i = 0; i < 100; i++) {
        ctx.beginPath();

        let color = ganScore > humanScore
            ? `hsl(${Math.random()*360}, 100%, 50%)`
            : `hsl(${Math.random()*360}, 40%, 70%)`;

        ctx.fillStyle = color;
        const size = Math.random() * 80;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    console.log("Viewed:", viewedImages);
    console.log("Clicked:", clickedImages);
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
