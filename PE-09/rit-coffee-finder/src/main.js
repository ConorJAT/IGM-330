export const init = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY3RyOTY2NCIsImEiOiJjbG9laTF0emkwMnBjMmtueWFqeWFyZ2l4In0.thmoOrvDCmVt9RHQadyrqw';
        
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-96, 37.8],
        zoom: 3
    });

    // Create a list of points to be marked on the map.
    const geojson = {
        type: 'FeatureCollection',
        features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-77.032, 38.913]
            },
            properties: {
                title: 'Mapbox',
                description: 'Washington, D.C.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-122.414, 37.776]
            },
            properties: {
                title: 'Mapbox',
                description: 'San Francisco, California'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-87.860, 41.979]
            },
            properties: {
                title: 'Mapbox',
                description: 'Donald E. Stephens Convention Center\n(Rosemont, Illinois)'
            }
        }
      ]
    };

    // add markers to map
    for (const feature of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
    
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                    `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                )
            )
            .addTo(map);
    }
};