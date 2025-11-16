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


// ---- AI αντιδρά στο click ----
images.forEach(img => {
  img.addEventListener("click", () => {
    aiMessage.textContent = "Ενδιαφέρουσα επιλογή... αλλά έχω κάτι καλύτερο!";

    setTimeout(() => {
      window.location.href = "https://www.midjourney.com/showcase"; 
    }, 1500);
  });
});
