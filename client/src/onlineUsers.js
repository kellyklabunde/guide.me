import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function OnlineUsers() {
    const onlineUsers = useSelector((state) => state.onlineUsers);

    return (
        <div>
            <p>Users online</p>
            {onlineUsers.map((user) => {
                <ul key={user.id}>
                    <Link to={`/user/${user.id}`}>
                        <img src={user.img_url || "/images/profile.png"} />
                        <p>
                            {user.first} {user.last}
                        </p>
                    </Link>
                </ul>;
            })}
        </div>
    );
}
