import { Component } from "react";
import { Link } from "react-router-dom";
import "./resetPassword.css";

import axios from "./axios";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            code: "",
            password: "",
            error: false,
            step: 1,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.verifyPassword = this.verifyPassword.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        axios
            .post("/api/password/reset/start", { email: this.state.email })
            .then(() => {
                this.setState({ error: false, step: 2 });
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    }

    verifyPassword(e) {
        e.preventDefault();
        console.log(this.state.code);
        console.log(this.state.password);

        axios
            .post("/api/password/reset/verify", {
                code: this.state.code,
                password: this.state.password,
            })
            .then(() => {
                this.setState({ error: false, step: 3 });
            })
            .catch(() => {
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <>
                {this.state.error && <p>OH OH something went wrong</p>}
                {this.state.step === 1 && (
                    <div className="resetPassword">
                        <h3>Insert your e-mail</h3>
                        <form
                            className="sendEmail"
                            onSubmit={this.handleSubmit}
                        >
                            <input
                                type="email"
                                name="email"
                                placeholder="E-Mail address"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                            <button type="submit">Send E-mail</button>
                        </form>
                    </div>
                )}
                {this.state.step === 2 && (
                    <form
                        className="resetPassword"
                        onSubmit={this.verifyPassword}
                    >
                        <input
                            type="text"
                            name="code"
                            placeholder="Insert your secret code"
                            value={this.state.secretCode}
                            onChange={this.handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="New Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <button type="submit">Submit</button>
                    </form>
                )}
                {this.state.step === 3 && (
                    <div>
                        <h3>Success!</h3>
                        <p>
                            You can <Link to="/login">Login</Link> with your new
                            Password now.
                        </p>
                    </div>
                )}
            </>
        );
    }
}
