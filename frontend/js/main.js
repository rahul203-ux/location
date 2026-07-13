const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const shareButton = document.getElementById("share-btn");
const statusText = document.getElementById("status");

// Share location
shareButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        statusText.textContent = "Geolocation not supported!";
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
            const response = await fetch("http://127.0.0.1:5000/location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude, longitude })
            });
            const result = await response.json();
            statusText.textContent = result.message;
            loadLocations(); // refresh markers
        } catch (err) {
            statusText.textContent = "Error sending location!";
        }
    }, () => {
        statusText.textContent = "Permission denied!";
    });
});

// Load all stored locations
async function loadLocations() {
    const response = await fetch("http://127.0.0.1:5000/locations");
    const locations = await response.json();

    // Clear existing markers
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    // Add new markers
    locations.forEach(loc => {
        const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
        marker.bindPopup(`Lat: ${loc.latitude}, Lon: ${loc.longitude}<br>${loc.timestamp}`);
    });
}

// Auto-refresh every 10 seconds
setInterval(loadLocations, 10000);

// Initial load
loadLocations();
