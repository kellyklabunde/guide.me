import { BrowserRouter, Route, Link } from "react-router-dom";
import { Component } from "react";

import axios from "./axios";

import Profile from "./profile";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import Friends from "./friends";
import GoogleMap from "./googleMap";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first: "",
            last: "",
            email: "",
            image: "",
            bio: "",
            uploaderVisible: false,
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    componentDidMount() {
        console.log("App Component did mount");

        axios
            .get("/api/user")
            .then((res) => {
                this.setState(res.data);
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    }

    toggleModal() {
        console.log("toggle Uploder Modal");
        this.setState({ uploaderVisible: !this.state.uploaderVisible });
    }

    updateUser(user) {
        this.setState(user);
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <header>
                        <Link to="/chat">
                            <img src="/images/chat.png" />
                        </Link>
                        <Link to="/friends">
                            <img src="/images/friends.png" />
                        </Link>
                        <Link to="/findPeople">
                            <img src="/images/search.png" />
                        </Link>
                        <Link to="/">
                            <img src="/images/homepage.png" />
                        </Link>
                        <ProfilePic
                            first={this.state.first}
                            image={this.state.image}
                            last={this.state.last}
                            toggleModal={this.toggleModal}
                        />
                    </header>
                    <>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    image={this.state.image}
                                    bio={this.state.bio}
                                    toggleModal={this.toggleModal}
                                    updateUser={this.updateUser}
                                />
                            )}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/findPeople" component={FindPeople} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/googleMap" component={GoogleMap} />
                    </>
                </BrowserRouter>
                {this.state.uploaderVisible && (
                    <Uploader
                        toggleModal={this.toggleModal}
                        updateUser={this.updateUser}
                    />
                )}
            </>
        );
    }
}
