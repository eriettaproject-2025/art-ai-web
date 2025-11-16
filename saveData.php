// Δημιουργούμε ένα αντικείμενο για την επιλογή
const clickedData = {
  img: img.src,
  alt: img.alt,
  time: new Date().toISOString()
};

// Στέλνουμε τα δεδομένα στον server
fetch('saveData.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(clickedData)
})
.then(response => response.json())
.then(data => {
  if(data.status === 'success') {
    console.log("Data saved to database!");
  } else {
    console.error("Error saving data:", data.message);
  }
})
.catch(err => console.error("Fetch error:", err));
