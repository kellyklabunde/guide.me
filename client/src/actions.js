import axios from "./axios";

export async function receiveFriendsWannabes() {
    console.log("receiveFriendsWannabes");
    const { data } = await axios.get("/api/friends-wannabes");
    console.log("data", data);

    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsWannabes: data,
    };
}

export async function acceptFriend(id) {
    await axios.post("/api/accept-friend-request/" + id);

    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id,
    };
}

export async function unfriend(id) {
    await axios.post("/api/end-friendship/" + id);

    return {
        type: "UNFRIEND",
        id,
    };
}

export function chatMessages(data) {
    return {
        type: "CHAT_MESSAGES",
        chatMessages: data,
    };
}

export function chatMessage(data) {
    return {
        type: "ADD_CHAT_MESSAGE",
        chatMessages: data,
    };
}

export async function receiveFriendsOfFriend(profileId) {
    const { data } = await axios.get("/api/friends-of-friend/" + profileId);
    console.log("data in receiveFriendsOfFriend", data);

    return {
        type: "RECEIVE_FRIENDS_OF_FRIEND",
        friendsOfFriend: data,
    };
}
