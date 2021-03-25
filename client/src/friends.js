import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { receiveFriendsWannabes, unfriend, acceptFriend } from "./actions";
import "./friends.css";

export default function Friends() {
    const dispatch = useDispatch();

    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => !user.accepted)
    );

    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted)
    );

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    function handleClickAccept() {
        acceptFriend(wannabes[0].id);
        dispatch(receiveFriendsWannabes());
    }

    function handleClickUnfriend() {
        unfriend(friends[0].id);
        dispatch(receiveFriendsWannabes());
    }

    if (!friends || !wannabes) {
        return <p>Loading page</p>;
    }

    console.log("friends");
    console.log(friends);

    return (
        <div className="friendsandwannabes">
            <div className="wannabeFriends">
                <div className="friendsDescription">
                    <h3>Friendship requests:</h3>
                </div>
                {wannabes.length == 0 && <p>No friend requests.</p>}
                {wannabes.map((wannabe) => (
                    <div key={wannabe.id}>
                        <Link to={`/user/${wannabe.id}`}>
                            <img src={wannabe.image || "/images/profile.png"} />
                            {wannabe.first} {wannabe.last}
                        </Link>
                        <button onClick={handleClickAccept}>
                            Accept friend request
                        </button>
                    </div>
                ))}
            </div>
            <div className="friends">
                <div className="friendsDescription">
                    <h3>Your friends:</h3>
                </div>
                {friends.length == 0 && <p>No friends yet.</p>}
                {friends.map((friend) => (
                    <div key={friend.id}>
                        <Link to={`/user/${friend.id}`}>
                            <img src={friend.image || "/images/profile.png"} />
                            {friend.first} {friend.last}
                        </Link>
                        <button onClick={handleClickUnfriend}>Unfriend</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
