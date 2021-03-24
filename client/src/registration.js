import { Component } from "react";
import { Link } from "react-router-dom";

import axios from "./axios";

export default class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            error: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            error: false,
        });
        console.log("SUBMITTED THE FORM", this.state);

        const { firstname, lastname, email, password } = this.state;

        axios
            .post("/api/register", this.state)
            .then(() => {
                location.replace("/");
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <>
                <div className="register">
                    <form className="registration" onSubmit={this.handleSubmit}>
                        <h2>Please register</h2>
                        {this.state.error && <p>OH OH something went wrong</p>}
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            value={this.state.firstname}
                            onChange={this.handleChange}
                        />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            value={this.state.lastname}
                            onChange={this.handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="E-Mail address"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <button type="submit">Register</button>
                        <Link to="/login">
                            Log in
                            <img id="login" src="/images/login.png" />
                        </Link>
                    </form>

                    <img className="logo" src="/images/logo.png" />
                </div>
            </>
        );
    }
}
