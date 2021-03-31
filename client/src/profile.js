import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";
import Uploader from "./uploader";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import GoogleMap from "./googleMap";
import "./profile.css";

import axios from "./axios";

export default function Profile({ first, image, last, bio }) {
    const [uploaderVisible, setUploaderVisible] = useState("");
    const [updateUser, setUpdateUser] = useState("");
    const [markerArr, setMarkerArr] = useState([]);

    axios.get(`/api/ownprofile/googlemap`).then((res) => {
        console.log("google maps own profile API result from server");
        console.log(res.data);
        setMarkerArr(res.data);
    });

    useEffect(() => {
        console.log("update bio");
    }, []);

    function toggleModal() {
        console.log("toggle Uploder Modal");
        setUploaderVisible(!uploaderVisible);
    }

    function updateTheUserHere(user) {
        setUpdateUser(user);
    }

    return (
        <div className="profile-page">
            <div className="profile">
                <ProfilePic
                    className="avatar"
                    first={first}
                    image={image}
                    last={last}
                    toggleModal={() => {
                        toggleModal();
                    }}
                />
                <div className="profileInfo">
                    <h2>
                        {first} {last}
                    </h2>
                    <BioEditor
                        bio={bio}
                        updateUser={() => {
                            updateTheUserHere();
                        }}
                    />
                </div>
                {uploaderVisible && (
                    <Uploader
                        toggleModal={toggleModal}
                        updateUser={() => {
                            updateTheUserHere();
                        }}
                    />
                )}
            </div>
            <div className="profileMap">
                <GoogleMap markerArr={markerArr} />
            </div>
        </div>
    );
}
