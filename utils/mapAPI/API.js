//TODO: get super secret code from google so this actually works -- thought: have Jay put a credit card down so no future charges are incurred by me
require('dotenv').config();

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: {
            lat:47.6,
            lng: -122.6
        }
    });
    const geocoder = new google.maps.Geocoder();
    document.getElementById("submit").addEventListener("click", () => {
        geocodeAddress(geocoder, map);
    })
};

//exists in matchController.js
// function getMapAPIKey() {
//     const mapAPIKey = process.env.MAP_API;
//     return mapAPIKey;
// }

function geocodeAddress(geocoder, resultsMap) {
    const address = document.getElementById("address").nodeValue;
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
            resultsMap.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert("Geocode didn't work")
        }
    });
}