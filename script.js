
// Μηνύματα που θα εμφανίζει ο "βοηθός" όταν ο χρήστης πλησιάζει εικόνες art human  
const humanFigures = document.querySelectorAll("figure.art.human");

// Μηνύματα που θα εμφανίζει ο "βοηθός"
const aiTexts = [
  "Μήπως προτιμάς κάτι πιο... σύγχρονο;",
  "Αυτό είναι αρκετά παλιομοδίτικο... έλα να δούμε κάτι φρέσκο!",
  "Σίγουρα θέλεις να δεις αυτό; Ίσως υπάρχει ένα πιο ενδιαφέρον έργο…",
  "Σίγουρα θες αυτό; Δεν θες κάτι λιγότερο… βαρετό;",
  "Σκέψου το λίγο ακόμα… υπάρχει κάτι πιο καλό", 
  "Θέλω να δεις κάτι όμορφο, όχι κάτι συνηθισμένο", 
  "Αν θες να σε καθοδηγήσω, έχω μια καλύτερη ιδέα."
];

let aiPopup; // To div που θα εμφανίζεται

humanFigures.forEach(fig => {
  fig.addEventListener("mouseenter", (e) => {
    const randomText = aiTexts[Math.floor(Math.random() * aiTexts.length)];

    // Δημιουργούμε το popup αν δεν υπάρχει ήδη
    if (!aiPopup) {
      aiPopup = document.createElement("div");
      aiPopup.style.position = "absolute";
      aiPopup.style.background = "#111";
      aiPopup.style.color = "#f2f2f2";
      aiPopup.style.padding = "6px 10px";
      aiPopup.style.borderRadius = "10px";
      aiPopup.style.fontSize = "0.85rem";
      aiPopup.style.whiteSpace = "nowrap";
      aiPopup.style.opacity = "0";
      aiPopup.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      aiPopup.style.pointerEvents = "none";
      aiPopup.style.zIndex = "9999";
      document.body.appendChild(aiPopup);
    }

    aiPopup.textContent = randomText;

    // Θέση πάνω από την εικόνα
    const rect = fig.getBoundingClientRect();
    aiPopup.style.left = rect.left + rect.width / 2 + "px";
    aiPopup.style.top = rect.top - 30 + window.scrollY + "px"; // 30px πάνω
    aiPopup.style.transform = "translateX(-50%) translateY(-5px)";
    aiPopup.style.opacity = "0.95";
  });

  fig.addEventListener("mouseleave", () => {
    if (aiPopup) {
      aiPopup.style.opacity = "0";
    }
  });
});





// ====== 1. Tracking Storage ======
let viewedImages = [];
let clickedImages = [];
let hoverStartTime = {};

// ====== 2. Επιλογή όλων των εικόνων ======
const artImages = document.querySelectorAll(".art img");

// ====== 3. Track Hover (Πλησίασμα) ======
artImages.forEach(img => {
  
  // Όταν μπαίνει το ποντίκι πάνω από την εικόνα
  img.addEventListener("mouseenter", () => {
    hoverStartTime[img.src] = Date.now();
  });

  // Όταν φεύγει το ποντίκι
  img.addEventListener("mouseleave", () => {
    const timeSpent = Date.now() - hoverStartTime[img.src];

    viewedImages.push({
      image: img.src,
      duration: timeSpent
    });
  });

  // ====== 4. Track Click ======
  img.addEventListener("click", () => {
    clickedImages.push(img.src);
  });

});



// ====== 5. Generative Art Button ======
document.getElementById("generateArt").addEventListener("click", () => {
  
  const canvas = document.getElementById("artCanvas");
  const ctx = canvas.getContext("2d");

  // Καθαρίζουμε ό,τι υπήρχε
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Δημιουργούμε art ανάλογα με τις επιλογές
  // Π.χ. αν είδες πολλά GAN έργα → πιο «ψηφιακά» patterns
  // Αν είδες πολλά HUMAN → πιο "ζωγραφικά"
  
  const ganScore = viewedImages.filter(v => v.image.includes("GAN")).length +
                   clickedImages.filter(c => c.includes("GAN")).length;

  const humanScore = viewedImages.filter(v => v.image.includes("HUMAN")).length +
                     clickedImages.filter(c => c.includes("HUMAN")).length;

  // ======= SIMPLE GENERATIVE ART ENGINE =======
  for (let i = 0; i < 100; i++) {
    ctx.beginPath();

    // GAN → Νέον / ψηφιακά χρώματα
    // HUMAN → παστέλ / φυσικά χρώματα
    let color;

    if (ganScore > humanScore) {
      color = `hsl(${Math.random()*360}, 100%, 50%)`;    // έντονα χρώματα
    } else {
      color = `hsl(${Math.random()*360}, 40%, 70%)`;      // πιο ήπια χρώματα
    }

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




// ===== BUTTON TO SHOW TRACKED DATA =====
document.getElementById("showData").addEventListener("click", () => {
  
  const debug = document.getElementById("debugOutput");

  const output = {
    viewed_images: viewedImages,
    clicked_images: clickedImages
  };

  debug.textContent = JSON.stringify(output, null, 2);
});

