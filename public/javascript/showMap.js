
mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center:campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({ color: "black" })
.setLngLat(campground.geometry.coordinates)
 .setPopup(
 new mapboxgl.Popup({offset: 25})
 .setHTML(
     `<h5>${campground.title}</h5>`
 )
 )
.addTo(map)

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');