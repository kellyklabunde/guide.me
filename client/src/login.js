import { Component } from "react";
import { Link } from "react-router-dom";

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
                <img src="/images/pattern.png" />
                <h2>Please login:</h2>
                {this.state.error && <p>OH OH something went wrong</p>}
                <form className="registration" onSubmit={this.handleSubmit}>
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
                    <p>
                        Forgot your password?
                        <Link to="/resetpassword"> Reset Password</Link>
                    </p>
                    <p>
                        New here?
                        <Link to="/"> Sign up for new Account</Link>
                    </p>
                </form>
            </div>
        );
    }
}
