import { Component } from "react";
import { Link } from "react-router-dom";
import "./login.css";

import axios from "./axios";

export default class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
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

        axios
            .post("/api/login", this.state)
            .then(() => {
                location.replace("/");
            })
            .catch(() => {
                this.setState({ error: true });
            });
    }
    render() {
        return (
            <div className="login">
                {this.state.error && <p>OH OH something went wrong</p>}
                <form onSubmit={this.handleSubmit}>
                    <h2>Please login:</h2>
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
                    <button type="submit">Login</button>
                    <p>Forgot your password?</p>
                    <p>
                        <Link to="/resetpassword">Reset Password</Link>
                    </p>
                </form>
            </div>
        );
    }
}
