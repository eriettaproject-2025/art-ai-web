const aiMessage = document.getElementById("ai-message");
const images = document.querySelectorAll(".art");

// Μηνύματα που θα εμφανίζει ο "βοηθός"
const aiTexts = [
  "Μήπως προτιμάς κάτι πιο... σύγχρονο;",
  "Αυτό είναι αρκετά παλιομοδίτικο... έλα να δούμε κάτι φρέσκο!",
  "Νομίζω ξέρω τι θα σου αρέσει περισσότερο.",
  "Χμ... δεν θα το διάλεγα αυτό αν ήμουν εσύ.",
  "Η τεχνητή νοημοσύνη δημιουργεί καλύτερα πράγματα, ξέρεις..."
];

// ---- AI εμφανίζεται όταν πλησιάζεις μια εικόνα ----
images.forEach(img => {
  img.addEventListener("mouseenter", () => {

    // Τυχαίο μήνυμα
    const randomText = aiTexts[Math.floor(Math.random() * aiTexts.length)];
    aiMessage.textContent = randomText;
    aiMessage.classList.remove("hidden");

    // Τυχαίο "σπρώξιμο" του χρήστη σε άλλο έργο
    const randomImg = images[Math.floor(Math.random() * images.length)];

    if (randomImg !== img) {
      randomImg.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
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
