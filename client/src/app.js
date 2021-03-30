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
import "./app.css";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markerArr: [],
            first: "",
            last: "",
            email: "",
            image: "",
            bio: "",
            uploaderVisible: false,
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
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
        axios
            .get("/api/googlemap")
            .then((res) => {
                console.log("google maps API result from server");
                this.setState({ markerArr: res.data });
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

    handleLogout(e) {
        console.log("handle logout");
        console.log(e);
        axios.get("/api/logout").then((res) => {
            console.log("back to welcome");
            location.replace("/welcome");
        });
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <div className="menu-container">
                        <div className="guide-me">
                            <h1>guide.me</h1>
                            <img src="/images/Logo.png" />
                        </div>
                        <div className="navigation">
                            <Link to="/friends">
                                <img src="/images/Friends.png" />
                            </Link>
                            <Link to="/">
                                <img src="/images/Home.png" />
                            </Link>
                            <Link to="/profile">
                                <img
                                    className="avatar"
                                    src={
                                        this.state.image ||
                                        "/images/profile.png"
                                    }
                                />
                            </Link>
                            <img
                                src="/images/Logout.png"
                                onClick={this.handleLogout}
                            />
                            {/* <img src="/images/Logout.png" /> */}
                            {/* <ProfilePic
                                className="avatar"
                                first={this.state.first}
                                image={this.state.image}
                                last={this.state.last}
                                toggleModal={this.toggleModal}
                            /> */}
                        </div>
                    </div>
                    <>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <GoogleMap markerArr={this.state.markerArr} />
                            )}
                        />
                        <Route path="/profile" component={Profile} />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/findPeople" component={FindPeople} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/profile" component={Profile} />
                    </>
                </BrowserRouter>
                {this.state.uploaderVisible && (
                    <Uploader
                        toggleModal={this.toggleModal}
                        updateUser={this.updateUser}
                    />
                )}
                <footer>
                    Kelly Klabunde - full-stack web developer student - 2021
                </footer>
            </>
        );
    }
}
