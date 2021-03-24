import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { receiveFriendsOfFriend } from "./actions";

export default function friendsOfFriend(props) {
    const dispatch = useDispatch();
    const friendsOfFriend = useSelector((state) => state.friendsOfFriend);
    console.log("friends of friends");
    console.log(friendsOfFriend);

    useEffect(() => {
        console.log("friendsOfFriend component mounted!");
        console.log(props.props.match.params.id);
        dispatch(receiveFriendsOfFriend(props.props.match.params.id));
    }, []);

    if (!friendsOfFriend) {
        return "Loading";
    }

    return (
        <div className="friendsOfFriend">
            {friendsOfFriend.length == 0 && <p>No friends yet.</p>}
            {friendsOfFriend.map((friend) => (
                <ul key={friend.id}>
                    <Link to={`/user/${friend.id}`}>
                        <img src={friend.image || "/images/profile.png"} />{" "}
                        <p>
                            {" "}
                            {friend.first} {friend.last}
                        </p>
                    </Link>
                </ul>
            ))}
        </div>
    );
}
