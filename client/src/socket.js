import { io } from "socket.io-client";

import { chatMessages, chatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("test", (payload) => {
            console.log("received test event with ", payload);
        });

        socket.on("chatMessages", (msgs) => {
            console.log("chatMessages", msgs);
            store.dispatch(chatMessages(msgs));
        });

        socket.on("chatMessage", (msg) => {
            console.log("chatMessage", msg);
            store.dispatch(chatMessage(msg));
        });
    }
};
