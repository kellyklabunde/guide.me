import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

import reducer from "./reducer.js";

import { init } from "./socket.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

import App from "./app";
import Welcome from "./welcome";

const userIsLoggedIn = location.pathname !== "/welcome";

console.log("userIsLoggedIn", userIsLoggedIn);

let element;

if (userIsLoggedIn) {
    init(store);

    element = (
        <Provider store={store}>
            <App />
        </Provider>
    );
} else {
    element = <Welcome />;
}

ReactDOM.render(element, document.querySelector("main"));
