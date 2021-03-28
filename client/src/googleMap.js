import React from "react";
import { useEffect, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import secrets from "/client/secrets.json";

import axios from "./axios";

const center = {
    lat: 37.772,
    lng: 122.214,
};

function MyComponent(markerArr) {
    const [showInfoWindow, setShowInfoWindow] = useState("");
    const [newMarkerWindow, setNewMarkerWindow] = useState("");
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [comments, setComments] = useState([]);

    console.log("Google Maps Component did mount");
    console.log(markerArr.markerArr);

    const containerStyle = {
        width: "800px",
        height: "500px",
    };

    const onLoadMarker = (marker) => {
        console.log("marker: ", marker);
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
        const lat = marker.lat;
        const lng = marker.lng;

        axios
            .get("/api/googlemap/markerAll", { params: { lat, lng } })
            .then((res) => {
                const markerId = parseInt(res.data[0].id);

                axios
                    .get("/api/googlemap/comments", { params: { markerId } })
                    .then((res) => {
                        console.log("KKKKKKKKKKKKK");
                        console.log(res.data);
                        setComments(res.data);
                    });
            });
    }

    function handleClickMap(event) {
        console.log("handle click map");
        const coordinates = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        console.log(coordinates);
        setNewMarkerWindow(coordinates);
    }

    function handleChangeImg(e) {
        setImage(e.target.files[0]);
        // console.log(e.target.files[0]);
    }

    function handleChangeTxt(e) {
        // console.log(e.target.value);
        setTitle(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const fd = new FormData();

        fd.append("image", image);
        const lat = newMarkerWindow.lat;
        const lng = newMarkerWindow.lng;

        axios
            .post("/api/googlemap", fd, { params: { title, lat, lng } })
            .then((res) => {
                console.log(res);
            });

        setNewMarkerWindow(null);
    }
    console.log("comments");
    console.log(comments);

    return isLoaded ? (
        <>
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
                                {comments.map((text) => (
                                    <li key={text.id}>
                                        <p>{text.comment}</p>
                                    </li>
                                ))}
                            </div>
                        </InfoWindow>
                    )}
                    {newMarkerWindow && (
                        <InfoWindow
                            onCloseClick={() => {
                                setNewMarkerWindow(null);
                            }}
                            position={newMarkerWindow}
                        >
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Title"
                                        onChange={handleChangeTxt}
                                    />
                                    <input
                                        type="file"
                                        onChange={handleChangeImg}
                                    />
                                    <button type="submit">
                                        Upload New Image
                                    </button>
                                </form>
                            </div>
                        </InfoWindow>
                    )}
                </>
            </GoogleMap>
        </>
    ) : (
        <></>
    );
}

export default React.memo(MyComponent);
