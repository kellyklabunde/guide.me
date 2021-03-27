import React from "react";
import { useEffect, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import secrets from "/client/secrets.json";

const center = {
    lat: 37.772,
    lng: 122.214,
};

function MyComponent(markerArr) {
    const [showInfoWindow, setShowInfoWindow] = useState("");

    console.log("Google Maps Component did mount");
    console.log(markerArr.markerArr);

    const containerStyle = {
        width: "800px",
        height: "500px",
    };

    const onLoadMarker = (marker) => {
        console.log("marker: ", marker);
    };

    const onLoadInfoWindow = (infoBox) => {
        console.log("infobox: ", infoBox);
    };

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: secrets.GOOGLE_API_KEY,
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

    function handleClickMarker(marker) {
        console.log("handle click marker");
        setShowInfoWindow(marker);
    }

    function handleClickMap(event) {
        console.log("handle click map");
        console.log(event);
    }

    return isLoaded ? (
        <>
            {/* {markerArr.markerArr.map((marker) => (
                <li key={marker.lat}>
                    {marker.lat}
                    {marker.lng}
                </li>
            ))} */}

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleClickMap}
            >
                <>
                    {markerArr.markerArr.map((marker) => (
                        <li key={marker.lat}>
                            <Marker
                                onClick={() => {
                                    handleClickMarker(marker);
                                }}
                                onLoad={onLoadMarker}
                                clickable={true}
                                position={marker}
                            />
                        </li>
                    ))}
                    {showInfoWindow && (
                        <InfoWindow
                            onCloseClick={() => {
                                setShowInfoWindow(null);
                            }}
                            position={showInfoWindow}
                        >
                            <div>
                                <h3>{showInfoWindow.title}</h3>
                                <img src={showInfoWindow.image} />
                            </div>
                        </InfoWindow>
                    )}
                </>
                {/* Child components, such as markers, info windows, etc. */}
            </GoogleMap>
        </>
    ) : (
        <></>
    );
}

export default React.memo(MyComponent);
