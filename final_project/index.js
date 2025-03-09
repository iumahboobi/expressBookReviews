const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    //Write the authentication mechanism here

    if (req.session && req.session.accessToken) {

        jwt.verify(req.session.accessToken, 'your_secret_key', (err, decoded) => {

            if (err) {

                // Token is invalid or expired 
                return res.status(403).json({ message: 'Unauthorized: Token expired or invalid' });
            }

            else { // Token is valid, proceed to the newx middleware or router handler

                req.user = decoded;
                next();

            }
        });
    }

    else {
        // Token not found in the request header
        return res.status(403).json({ message: 'Unauthorized: No token provided' });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
