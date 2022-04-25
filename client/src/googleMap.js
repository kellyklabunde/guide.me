import React from "react";
import { useEffect, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import secrets from "/client/secrets.json";
import googleMapsStyling from "../googleMapsStyling";
import "./googleMap.css";

import axios from "./axios";

const center = {
    lat: 48.779045,
    lng: 9.189562,
};

const containerStyle = {
    width: "900px",
    height: "600px",
};

function MyComponent(markerArr) {
    const [showInfoWindow, setShowInfoWindow] = useState("");
    const [newMarkerWindow, setNewMarkerWindow] = useState("");
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [clickedMarkerId, setclickedMarkerId] = useState("");

    console.log("Google Maps Component did mount");
    console.log(markerArr.markerArr);

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
        // map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    function handleClickMarker(marker) {
        console.log("handle click marker");
        console.log(marker);
        setShowInfoWindow(marker);
        const lat = marker.lat;
        const lng = marker.lng;

        axios
            .get("/api/googlemap/markerAll", { params: { lat, lng } })
            .then((res) => {
                const markerId = parseInt(res.data[0].id);

                setclickedMarkerId(markerId);

                axios
                    .get("/api/googlemap/comments", { params: { markerId } })
                    .then((res) => {
                        console.log("going to comments route");
                        setComments(res.data);
                        console.log(typeof res.data.user_id);
                        axios
                            .get(`/api/user/${res.data[0].user_id}`)
                            .then((res) => {
                                console.log(res.data);
                            });
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

    function handleChangeComment(e) {
        setNewComment(e.target.value);
    }

    function handleChangeCategory(e) {
        setCategory(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const fd = new FormData();

        fd.append("image", image);
        const lat = newMarkerWindow.lat;
        const lng = newMarkerWindow.lng;

        axios
            .post("/api/googlemap", fd, {
                params: { title, lat, lng, category },
            })
            .then((res) => {
                console.log(res);
            });

        setNewMarkerWindow(null);
    }

    function handleCommentSubmit(event) {
        console.log(event);

        axios
            .post("/api/googlemap/newcomment", null, {
                params: { newComment, clickedMarkerId },
            })
            .then((res) => {
                console.log(res);
            });
    }

    return isLoaded ? (
        <div className="googleMap">
            <GoogleMap
                key="googleMap"
                mapContainerStyle={containerStyle}
                center={center}
                zoom={3}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{ styles: googleMapsStyling }}
                onDblClick={handleClickMap}
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
                                icon={"/images/Marker.png"}
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
                            <div className="infoWindow">
                                <h3>{showInfoWindow.title}</h3>
                                <img
                                    className="marker-image"
                                    src={showInfoWindow.marker_image}
                                />
                                <div className="infoWindow-userinfo">
                                    <img
                                        className="user-image"
                                        src={showInfoWindow.image}
                                    />
                                    <div className="userInfo-container">
                                        <p>
                                            {showInfoWindow.first}{" "}
                                            {showInfoWindow.last}
                                        </p>
                                        <p>at {showInfoWindow.created_at}</p>
                                    </div>
                                </div>
                                <div className="comments-session">
                                    <p className="comments-title">Comments:</p>
                                    <ul>
                                        {comments.map((text) => (
                                            <li key={text.id}>
                                                <img src={text.image} />
                                                <div className="comments-info">
                                                    <p>
                                                        {text.first} {text.last}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        at {
                                                            text.created_at
                                                        }:{" "}
                                                    </p>
                                                    <p> {text.comment}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <form onSubmit={handleCommentSubmit}>
                                    <input
                                        type="text"
                                        name="comment"
                                        autocomplete="off"
                                        placeholder="Insert your comment here..."
                                        onChange={handleChangeComment}
                                    />
                                    <button type="submit">Submit</button>
                                </form>
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
                            <div className="new-pin">
                                <p>Create a pin:</p>
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
                                    {/* <select
                                        name="category"
                                        onChange={handleChangeCategory}
                                    >
                                        <option>Restaurant</option>
                                        <option>Accomodation</option>
                                        <option>Shopping</option>
                                        <option>Museum</option>
                                        <option>Hiking</option>
                                        <option>Park</option>
                                        <option>Beach</option>
                                    </select> */}
                                    <button type="submit">Add new Pin</button>
                                </form>
                            </div>
                        </InfoWindow>
                    )}
                </>
            </GoogleMap>
        </div>
    ) : (
        <></>
    );
}

export default React.memo(MyComponent);
