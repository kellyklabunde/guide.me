import React from "react";
import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import secrets from "/client/secrets.json";
import { Marker, InfoWindow } from "@react-google-maps/api";

function MyComponent(markerArr) {
    console.log("CHAAAAAAAAAAAAAAAAAAAAAA");

    console.log(markerArr);
    const [showInfoWindow, setShowInfoWindow] = useState("");
    // const [list1, setlist1] = useState([]);

    // setlist1([
    //     { lat: 2100, lng: 2200 },
    //     { lat: 1500, lng: 1800 },
    // ]);

    const lista2 = [
        { lat: 37.772, lng: 122.214 },
        { lat: 33.772, lng: -109.214 },
    ];

    console.log("SUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
    console.log(markerArr.markerArr);
    console.log(lista2);

    console.log("SUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");

    const containerStyle = {
        width: "800px",
        height: "500px",
    };

    const center = {
        lat: 37.772,
        lng: -122.214,
    };

    const position = {
        lat: 32.772,
        lng: -12.214,
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

    function handleClick(e) {
        setShowInfoWindow(true);
        console.log("HANDLEEEEEEEEEEEEEEEEEEEEEEEEE CLICKKKKK");
        console.log(e);
    }

    function onCloseClickInfoWindow(e) {
        setShowInfoWindow(false);
        console.log(e);
    }

    return isLoaded ? (
        <>
            {lista2.map((marker) => (
                <li key={marker.lat}>
                    {marker.lat}
                    {marker.lng}
                </li>
            ))}

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <>
                    {lista2.map((marker) => (
                        <li key={marker.lat}>
                            <Marker
                                onClick={handleClick}
                                onLoad={onLoadMarker}
                                position={marker}
                            />
                        </li>
                    ))}

                    <Marker
                        onClick={handleClick}
                        onLoad={onLoadMarker}
                        position={position}
                    />
                    {showInfoWindow == true && (
                        <InfoWindow
                            onLoad={onLoadInfoWindow}
                            onCloseClick={onCloseClickInfoWindow}
                            position={position}
                        >
                            <div>
                                <h3>hello</h3>
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
