import { HashRouter, Route } from "react-router-dom";

import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetPassword";

export default function Welcome() {
    return (
        <>
            <h1 className="title">connecta</h1>
            <h3 className="subtitle">
                Welcome to our Brazilian community in Germany!
            </h3>
            <HashRouter>
                <>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </>
            </HashRouter>
        </>
    );
}
