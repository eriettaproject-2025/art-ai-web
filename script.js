// Μηνύματα που θα εμφανίζει ο "βοηθός" όταν ο χρήστης πλησιάζει εικόνες που βρίσκονται μέσα σε figure class="art human" // 
const aiMessage = document.getElementById("ai-message");
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

// Όταν ο χρήστης πλησιάζει ένα <figure class="art human">
humanFigures.forEach(fig => {
  fig.addEventListener("mouseenter", () => {

    const randomText = aiTexts[Math.floor(Math.random() * aiTexts.length)];
    aiMessage.textContent = randomText;
    aiMessage.classList.remove("hidden");

  });
});

// Όταν ο χρήστης φεύγει από πάνω
humanFigures.forEach(fig => {
  fig.addEventListener("mouseleave", () => {
    aiMessage.classList.add("hidden");
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
