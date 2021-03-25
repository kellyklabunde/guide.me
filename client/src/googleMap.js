import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_API_KEY } from "/client/secrets.json";
import { Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "800px",
    height: "500px",
};

const center = {
    lat: 37.772,
    lng: -122.214,
};

const position = {
    lat: 37.772,
    lng: -122.214,
};

const onLoadMarker = (marker) => {
    console.log("marker: ", marker);
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: GOOGLE_API_KEY,
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <Marker onLoad={onLoadMarker} position={position} />
            {/* Child components, such as markers, info windows, etc. */}
            <></>
        </GoogleMap>
    ) : (
        <></>
    );
}

export default React.memo(MyComponent);
