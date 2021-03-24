import { Component } from "react";
import Button from "./button";
import FriendsOfFriend from "./friendsOfFriend";

import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first: "",
            last: "",
            image: "",
            bio: "",
        };
    }

    componentDidMount() {
        console.log(
            "going to fetch information about user with id",
            this.props.match.params.id
        );

        axios
            .get(`/api/user/${this.props.match.params.id}`)
            .then((res) => {
                if (res.data.ownProfile) {
                    location.replace("/");
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
            <div className="otherProfile">
                <img src={this.state.image || "/images/profile.png"} />
                <div className="otherProfileContainer">
                    <div className="otherProfileInfo">
                        <p>
                            {" "}
                            {this.state.first} {this.state.last}{" "}
                        </p>
                        <p> {this.state.bio} </p>
                        <Button id={this.props} />
                    </div>
                    <FriendsOfFriend props={this.props} />
                </div>
            </div>
        );
    }
}
