const express = require('express');
const routes = require('./routes/users.js');
const jwt = require('jsonwebtoken');
const session = require('express-session')

const app = express();
const PORT = 5000;

// Set up session middleware
app.use(session({ secret: "fingerpint", resave: true, saveUninitialized: true }));

// Parse JSON request bodies
app.use(express.json());

// Middleware to check if the user is authenticated
app.use("/user", (req, res, next) => {
    // Check if the user is authenticated
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token

        // Verify the access token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware or route handler
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
})

// Use the user routes
app.use("/user", routes);

// Handle login requests
app.post("/login", (req, res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }
    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });

    // Store the access token in the session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Start the server
app.listen(PORT, () => console.log("Server is running at port " + PORT));