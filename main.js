// Create map
const bounds = L.latLngBounds(L.latLng(-60, -180), L.latLng(85, 60));

const map = L.map("map", {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 2,
}).setView([37.0902, -95.7129], 4);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
    noWrap: true,
    bounds: bounds,
}).addTo(map);

// fetch data from json file
const jsonPath = "./earthquake_data.json";

fetch(jsonPath)
    .then((response) => {
        // Check response ok or not
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        renderPoints(data);
    })
    .catch((error) => {
        console.error(error);
        alert("Can not read data from json file");
    });

// Create point function
function renderPoints(data) {
    data.forEach((point) => {
        // Check the location is valid or not
        if (!point.lat || !point.lng) return;

        // Using "==" because json file maybe return 1 or string "1"
        const isEarthquake = point.isEarthquake == 1;
        const color = isEarthquake ? "red" : "green";

        // Decide class for animation
        const classNameStr = isEarthquake ? "pulse-red" : "pulse-green";

        // 3. Create Marker
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 10,
            className: classNameStr,
            fillColor: color,
            color: color,
            fillOpacity: 1,
            opacity: 1,
        }).addTo(map);

        // 4. Create Popup
        const popupContent = `
            <div style="font-family: sans-serif;">
                <h4 style="margin: 0 0 5px 0;">${point.location}</h4>
                <hr style="margin: 5px 0;">
                <b>Type:</b> ${
                    isEarthquake
                        ? '<span style="color:red; font-weight:bold;">Earthquake</span>'
                        : '<span style="color:green; font-weight:bold;">Other</span>'
                }<br>
                <b>Magnitude:</b> ${point.mag} Richter<br>
                <b>Deep:</b> ${point.depth} km
            </div>
        `;
        marker.bindPopup(popupContent);
    });
}
