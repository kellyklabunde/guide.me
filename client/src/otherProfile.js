import { HashRouter, Route } from "react-router-dom";
import { Component } from "react";
import Button from "./button";
import FriendsOfFriend from "./friendsOfFriend";
import GoogleMap from "./googleMap";
import "./otherProfile.css";

import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first: "",
            last: "",
            image: "",
            bio: "",
            markerArr: [],
        };
    }

    componentDidMount() {
        console.log(
            "going to fetch information about user with id",
            this.props.match.params.id
        );

        axios
            .get(`/api/otherprofile/googlemap/${this.props.match.params.id}`)
            .then((res) => {
                console.log("google maps other profile API result from server");
                this.setState({ markerArr: res.data });
            });

        axios
            .get(`/api/user/${this.props.match.params.id}`)
            .then((res) => {
                if (res.data.ownProfile) {
                    location.replace("/profile");
                } else {
                    this.setState(res.data);
                }
            })
            .catch(() => {
                location.replace("/");
            });
    }

    render() {
        return (
            <div className="otherprofile-container">
                <div className="otherProfile">
                    <img src={this.state.image || "/images/profile.png"} />
                    <div className="otherProfileInfo">
                        <h2>
                            {" "}
                            {this.state.first} {this.state.last}{" "}
                        </h2>
                        <p> {this.state.bio} </p>
                    </div>
                    <div className="buttonOtherProfile">
                        <Button id={this.props} />
                    </div>
                    <div className="friendsOf">
                        <h3>Friends of {this.state.first}</h3>
                    </div>
                    <FriendsOfFriend props={this.props} />
                </div>
                <div className="otherProfileMap">
                    <GoogleMap markerArr={this.state.markerArr} />
                </div>
            </div>
        );
    }
}
