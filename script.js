mapboxgl.accessToken = "pk.eyJ1IjoicmFreSIsImEiOiJja3YxdzI5cjEzeTd0MnhwZ2tpMXE0bHBpIn0.j3A74v6kyzm-wQT2dm9gxA";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true } );

function successLocation(position) {
    setUpMap([position.coords.longitude, position.coords.latitude])
}

function errorLocation() {
    setUpMap([-113.4938, 53.5461])
}

function setUpMap(center) {
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: center, // starting position [lng, lat]
        zoom: 12 // starting zoom
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
      });

            
    map.addControl(directions, 'top-left');

    // marks where the intersection safety devices and scheduled photo enforcements are
    let intersectionDevices = "https://data.edmonton.ca/resource/7fnd-72gr.json";
    let enforcementZones = "https://data.edmonton.ca/resource/4cqz-cd52.json";

    let intersectionDevicesIcon = "url(./assets/traffic-light.png)";
    let enforcementZonesIcon = "url(./assets/camera.png)";

    setUpMarkers(map, intersectionDevices, intersectionDevicesIcon);
    setUpMarkers(map, enforcementZones, enforcementZonesIcon);
}

function setUpMarkers(map, url, icon) {
    $.ajax({
        url: url,
        type: "GET",
        data: {
          "$limit" : 5000,
        }
    }).done(function(data) {
        data.forEach((item) => {
            const el = document.createElement('div');
            el.style.backgroundImage = icon;
            el.style.width = "24px";
            el.style.height = "24px";
            el.style.backgroundSize = '100%';

            let location = item.approach || item.road_name || item.location_description;
            let speedLimit = item.posted_speed || item.speed_limit;
            if (speedLimit.search("km/h")===-1)
                speedLimit = speedLimit + " km/h"


            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                "<div><b>"+ location +"</b>"+"<p>The speed limit is "+ speedLimit +"</p></div>"
            );

            el.addEventListener('mouseenter', () => marker.togglePopup());
            el.addEventListener('mouseleave', () => marker.togglePopup());

            const marker = new mapboxgl.Marker(el)
                .setLngLat([item.longitude, item.latitude])
                .setPopup(popup)
                .addTo(map);


            
        }) 
    });
}



