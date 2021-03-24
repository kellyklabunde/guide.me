import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { socket } from "./socket.js";

export default function Chat() {
    const chatRef = useRef();
    const chatMessages = useSelector((state) => state.chatMessages);

    const [message, setMessage] = useState("");

    useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [chatMessages]);

    function handleSendMessage() {
        socket.emit("chatMessage", message);

        setMessage("");
    }

    function handleChange(e) {
        setMessage(e.target.value);
    }

    if (chatMessages == undefined) {
        return (
            <div>
                <h3>Community chat</h3>
                <div className="chat" ref={chatRef}></div>
                <textarea
                    placeholder="Type youre message here"
                    value={message}
                    onChange={handleChange}
                ></textarea>
                <button onClick={handleSendMessage}>Submit Message</button>
            </div>
        );
    }

    return (
        <div className="chatPage">
            <div className="chatMessages">
                <h3>Community chat</h3>
                <div className="chat" ref={chatRef}>
                    {chatMessages.map((chat) => (
                        <p key={chat.id}>
                            <img src={chat.image || "/images/profile.png"} />{" "}
                            {chat.first} {chat.last}: {chat.message_text}
                        </p>
                    ))}
                </div>
                <textarea
                    className="textarea"
                    placeholder="Type youre message here"
                    value={message}
                    onChange={handleChange}
                ></textarea>
                <button onClick={handleSendMessage}>Submit Message</button>
            </div>
            <img className="chatAves" src="/images/chatAves.png" />
        </div>
    );
}
