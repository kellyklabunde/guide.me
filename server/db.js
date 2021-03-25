const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.addUser = (first, last, email, password) => {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [first, last, email, password]
    );
};

module.exports.checkEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

module.exports.getUserData = (id) => {
    return db.query("SELECT * FROM users WHERE id = $1", [id]);
};

module.exports.addSecretCode = (email, code) => {
    return db.query(
        "INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING *",
        [email, code]
    );
};

module.exports.updatePassword = (password, email) => {
    return db.query("UPDATE users SET password = $1 WHERE email = $2", [
        password,
        email,
    ]);
};

module.exports.getResetCode = (code) => {
    return db.query(
        "SELECT * FROM reset_codes WHERE code = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'",
        [code]
    );
};

module.exports.updateImage = (image, userId) => {
    return db.query("UPDATE users SET image = $1 WHERE id = $2 RETURNING *", [
        image,
        userId,
    ]);
};

module.exports.updateBio = (bio, userId) => {
    return db.query("UPDATE users SET bio = $1 WHERE id = $2 RETURNING *", [
        bio,
        userId,
    ]);
};

module.exports.getUserSearch = (first) => {
    return db.query(
        "SELECT id, first, last, image FROM users WHERE first ILIKE $1",
        [first + "%"]
    );
};

module.exports.checkFriendship = (sender_id, recipient_id) => {
    return db.query(
        "SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)",
        [recipient_id, sender_id]
    );
};

module.exports.addFriendship = (sender_id, recipient_id) => {
    return db.query(
        "INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2) RETURNING *",
        [sender_id, recipient_id]
    );
};

module.exports.acceptFriendship = (sender_id, recipient_id) => {
    return db.query(
        "UPDATE friendships SET accepted = true WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1) RETURNING *",
        [sender_id, recipient_id]
    );
};

module.exports.deleteFriendship = (sender_id, recipient_id) => {
    return db.query(
        "DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)",
        [sender_id, recipient_id]
    );
};

module.exports.getFriendsAndWannabes = (userId) => {
    return db.query(
        `SELECT * FROM friendships
        JOIN users
            ON (sender_id=users.id AND recipient_id=$1      AND accepted=false)
            OR (sender_id=users.id AND recipient_id=$1      AND accepted=true)
            OR (sender_id=$1      AND recipient_id=users.id AND accepted=true)`,
        [userId]
    );
};

module.exports.getRecentMessages = () => {
    return db.query(
        `SELECT
        users.first,
        users.last,
        users.image, 
        chat_messages.message_text,
        chat_messages.id
        FROM chat_messages 
        JOIN users
        ON chat_messages.user_id = users.id
        ORDER BY chat_messages.id DESC
        LIMIT 10`
    );
};

module.exports.addNewMessage = (message_text, user_id) => {
    return db.query(
        "INSERT INTO chat_messages (message_text, user_id) VALUES ($1, $2) RETURNING *",
        [message_text, user_id]
    );
};

module.exports.getFriendsById = (id) => {
    return db.query(
        `SELECT users.id, users.first, users.last, users.image 
        FROM friendships 
        JOIN users 
        ON (friendships.accepted = true
            AND friendships.recipient_id = $1
            AND friendships.sender_id = users.id)
        OR (friendships.accepted = true
            AND friendships.sender_id = $1
            AND friendships.recipient_id = users.id)`,
        [id]
    );
};