export default function reducer(state = {}, action) {
    console.log("start of reducer:", action, state);
    console.log(action);
    console.log(state);

    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
        console.log(state);
    } else if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((user) => {
                if (user.accepted == true) {
                    return user;
                }
            }),
        };
    } else if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((user) => {
                if (user.accepted == false) {
                    return user;
                }
            }),
        };
    }

    if (action.type == "CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages,
        };
    }

    if (action.type == "ADD_CHAT_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessages[0]],
        };
    }

    if (action.type == "RECEIVE_FRIENDS_OF_FRIEND") {
        state = {
            ...state,
            friendsOfFriend: action.friendsOfFriend,
        };
    }

    return state;
}
