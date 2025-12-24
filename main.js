// Create map********
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

// Create point function*********
function renderPoints(data) {
    data.forEach((point) => {
        // Check the location is valid or not
        if (!point.lat || !point.lng) return;

        // Using "==" because json file maybe return 1 or string "1"
        const isEarthquake = point.isEarthquake == 1;
        const color = isEarthquake ? "red" : "green";

        // Decide class for animation
        const classNameStr = isEarthquake ? "pulse-red" : "pulse-green";

        // Create Marker
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 10,
            className: classNameStr,
            fillColor: color,
            color: color,
            fillOpacity: 1,
            opacity: 1,
        }).addTo(map);

        // Create Popup
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

// About us logic***********
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("track");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const dots = document.querySelectorAll(".dot-item");

    let currentIndex = 0;
    const totalSlides = 3;

    // Process track
    function updateCarousel() {
        const gap = 30;
        const translateValue = `calc(-${currentIndex} * (100% + 30px))`;
        track.style.transform = `translateX(${translateValue})`;

        // Update dots
        dots.forEach((d) => d.classList.remove("active"));
        if (dots[currentIndex]) dots[currentIndex].classList.add("active");
    }

    // Next button
    nextBtn.addEventListener("click", () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    });

    // Prev button
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalSlides - 1;
        }
        updateCarousel();
    });

    // Click on dot
    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            currentIndex = parseInt(e.target.dataset.index);
            updateCarousel();
        });
    });
});
