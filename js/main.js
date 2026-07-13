const statusText = document.getElementById("status");
const shareBtn = document.getElementById("shareBtn");

shareBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    statusText.innerText = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);
});

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  showMap(latitude, longitude);

  fetch("http://127.0.0.1:5000/location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ latitude, longitude })
  })
  .then(() => {
    statusText.innerText = "Location shared successfully";
  })
  .catch(() => {
    statusText.innerText = "Failed to send location";
  });
}

function error() {
  statusText.innerText = "Permission denied";
}

function showMap(lat, lon) {
  const map = L.map("map").setView([lat, lon], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    .addTo(map);

  L.marker([lat, lon]).addTo(map);
}
