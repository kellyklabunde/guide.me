import { HashRouter, Route } from "react-router-dom";

import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetPassword";
import "./welcome.css";

export default function Welcome() {
    return (
        <div className="welcome">
            <div className="header">
                <h1>guide.me</h1>
                <img src="./images/Logo.png" />
            </div>
            <HashRouter>
                <>
                    <div className="form-container">
                        <Route exact path="/" component={Registration} />
                        <Route exact path="/" component={Login} />
                        <Route
                            path="/resetpassword"
                            component={ResetPassword}
                        />
                    </div>
                </>
            </HashRouter>
        </div>
    );
}
