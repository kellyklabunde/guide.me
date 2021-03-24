import { useEffect, useState } from "react";

import axios from "./axios";

export default function FriendBtn(props) {
    const [button, setButton] = useState("");

    useEffect(() => {
        let ignore = false;

        axios
            .get(`/api/friendshipstatus/` + props.id.match.params.id)
            .then((res) => {
                console.log("server response");
                setButton(res.data.button);
            });

        return () => {
            ignore = true;
        };
    }, [button]);

    const handleClick = () => {
        if (button == "send friendship request") {
            console.log("send friendship request");
            axios
                .post("/api/send-friend-request/" + props.id.match.params.id)
                .then((res) => {
                    setButton(res.data.button);
                });
        } else if (button == "unfriend") {
            console.log("unfriend");
            axios
                .post("/api/end-friendship/" + props.id.match.params.id)
                .then((res) => {
                    setButton(res.data.button);
                });
        } else if (button == "cancel request") {
            console.log("cancel request/unfriend");
            axios
                .post("/api/end-friendship/" + props.id.match.params.id)
                .then((res) => {
                    setButton(res.data.button);
                });
        } else if (button == "accept friend request") {
            console.log("accept friend request");
            axios
                .post("/api/accept-friend-request/" + props.id.match.params.id)
                .then((res) => {
                    setButton(res.data.button);
                });
        }
    };

    return (
        <>
            <button onClick={handleClick}>{button}</button>
        </>
    );
}
