const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");

const config = require("../config");
const db = require("./db");
const ses = require("./ses");
const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

exports.hash = (password) => {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
};

const cookieSessionMiddleware = cookieSession({
    secret: "super secret",
    maxAge: 30 * 24 * 60 * 60,
});

app.use(cookieSessionMiddleware);

app.use(express.json());

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/api/password/reset/start", (req, res) => {
    db.checkEmail(req.body.email).then((result) => {
        if (result.rows.length === 0) {
            return ses.sendStatus(404);
        } else {
            const secretCode = cryptoRandomString({
                length: 6,
            });

            db.addSecretCode(req.body.email, secretCode)
                .then(() => {
                    return ses.sendEmail(
                        req.body.email,
                        secretCode,
                        "Your Reset Password Secret Code"
                    );
                })
                .then(() => {
                    res.sendStatus(200);
                })
                .catch((err) => {
                    console.log(err);

                    res.sendStatus(500);
                });
        }
    });
});

app.post("/api/password/reset/verify", (req, res) => {
    db.getResetCode(req.body.code).then((result) => {
        if (result.rows.length === 0) {
            return res.sendStatus(404);
        } else {
            console.log(req.body.password);
            bcrypt
                .hash(req.body.password, 12)
                .then((hash) => {
                    console.log("reset password verify");
                    console.log(hash);
                    console.log(result.rows[0].email);
                    return db.updatePassword(hash, result.rows[0].email);
                })
                .then(() => {
                    res.sendStatus(200);
                })
                .catch((err) => {
                    console.log(err);

                    res.sendStatus(500);
                });
        }
    });
});

app.get("/welcome", (req, res) => {
    if (!req.session.userId) {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    } else {
        res.redirect("/");
    }
});

app.post("/api/login", (req, res) => {
    db.checkEmail(req.body.email)
        .then((result) => {
            const user = result.rows[0];
            console.log(user);
            console.log(req.body.password);

            if (!user) {
                return res.sendStatus(401);
            }

            return bcrypt
                .compare(req.body.password, user.password)
                .then((match) => {
                    if (match) {
                        req.session.userId = user.id;

                        res.sendStatus(200);
                    } else {
                        res.sendStatus(401);
                    }
                });
        })
        .catch((err) => {
            console.log(err);

            res.sendStatus(500);
        });
});

app.post("/api/register", (req, res) => {
    bcrypt
        .hash(req.body.password, 12)
        .then((hash) => {
            console.log(hash);

            return db
                .addUser(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    hash
                )
                .then((result) => {
                    req.session.userId = result.rows[0].id;
                    req.session.signatureId = undefined;

                    res.json(result.rows[0]);
                });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/api/user/:id", (req, res) => {
    console.log("made into user/id route");
    db.getUserData(req.params.id)
        .then((result) => {
            delete result.rows[0].password;
            delete result.rows[0].email;

            const user = result.rows[0];

            user.ownProfile = user.id === req.session.userId;

            res.json(user);
        })
        .catch((err) => {
            console.log("Error", err);
            res.sendStatus(404);
        });
});

app.get("/api/user", (req, res) => {
    return db.getUserData(req.session.userId).then((result) => {
        delete result.rows[0].password;
        res.json(result.rows[0]);
    });
});

app.post("/api/user/bio", (req, res) => {
    db.updateBio(req.body.bio, req.session.userId)
        .then((result) => {
            delete result.rows[0].password;
            res.json(result.rows[0]);
        })
        .catch((e) => {
            console.log(e);

            res.sendStatus(500);
        });
});

app.post("/api/upload", uploader.single("image"), s3.upload, (req, res) => {
    const url = config.s3Url + req.file.filename;
    db.updateImage(url, req.session.userId)
        .then((result) => {
            const user = result.rows[0];
            delete user.password;
            res.json(user);
        })
        .catch((e) => {
            console.log(e);

            res.sendStatus(500);
        });
});

app.get("/api/users/:input?", function (req, res) {
    console.log(req.params.input);
    db.getUserSearch(req.params.input)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log(e);

            res.sendStatus(500);
        });
});

app.get("/api/friendshipstatus/:id", function (req, res) {
    console.log("made into friendshipstatus/:id");
    console.log(req.session.userId);
    console.log(req.params.id);
    db.checkFriendship(req.session.userId, req.params.id)
        .then((result) => {
            if (result.rows.length == 0) {
                res.json({ button: "send friendship request" });
            } else {
                if (result.rows[0].accepted) {
                    res.json({ button: "unfriend" });
                } else {
                    if (result.rows[0].sender_id == req.session.userId) {
                        res.json({ button: "cancel request" });
                    } else {
                        res.json({ button: "accept friend request" });
                    }
                }
            }
        })
        .catch((e) => {
            console.log(e);

            res.sendStatus(500);
        });
});

app.post("/api/send-friend-request/:id", function (req, res) {
    db.addFriendship(req.session.userId, req.params.id).then((result) => {
        res.json({ button: "cancel request" });
    });
});

app.post("/api/accept-friend-request/:id", function (req, res) {
    db.acceptFriendship(req.session.userId, req.params.id).then((result) => {
        res.json({ button: "unfriend" });
    });
});

app.post("/api/end-friendship/:id", function (req, res) {
    db.deleteFriendship(req.session.userId, req.params.id).then((result) => {
        res.json({ button: "send friendship request" });
    });
});

app.get("/api/friends-wannabes", function (req, res) {
    console.log("friends-wannabe server");
    db.getFriendsAndWannabes(req.session.userId).then((result) => {
        res.json(result.rows);
    });
});

app.get("/api/friends-of-friend/:profileId", function (req, res) {
    console.log("friends-of-frind server", req.params.profileId);
    db.getFriendsById(req.params.profileId).then((result) => {
        res.json(result.rows);
    });
});

app.get("/api/googlemap", function (req, res) {
    db.getMarkersFromFriends(req.session.userId).then((result) => {
        res.json(result.rows);
    });
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
