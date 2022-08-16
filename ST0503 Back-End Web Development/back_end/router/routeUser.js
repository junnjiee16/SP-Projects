const express = require('express'); //import express
const router = express.Router() //route all endpoints to app.js

const user = require('../model/user.js'); //import user file from model folder
const verifyToken = require('../auth/verifyToken.js'); //import verifyToken file for jwt



// ./users/ endpoints
router.put('/users/:id', function(req, res) { //Endpoint 4 (PUT): Update a single user's details by on userid
    var userid = req.params.id;

    user.update(userid, req.body, function(err, result) {
        if (err == null) {
            if (result == "") {
                console.log("Reached Endpoint (user.update), Error: User ID does not exist");
                res.status(404).send("User ID does not exist!");
            } else {
                console.log("Reached Endpoint (user.update)");
                res.sendStatus(204);
            }
        } else if (err.errno == 1062) { //MySQL error number is 1062 when there is a duplicate entry of unique values
            console.log("Reached Endpoint (user.update), Error: Duplicate Entry");
            res.status(422).send("One of the columns (username, email, contact) already exists!");
        } else if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
    })
})


router.get('/users/:id', function(req, res) { //Endpoint 3 (GET): Retrieve info of a single user by userid
    //show info of authorized user trying to access this endpoint
    var { decodedUserid, decodedType } = req;
    console.log(`Decoded userid: ${decodedUserid}, type: ${decodedType}`);

    var userid = req.params.id;
    user.showByID(userid, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        } else if (result == "") {
            console.log("Reached Endpoint (user.showByID), Error: User ID does not exist");
            res.status(404).send("User ID does not exist!");
        } else {
            console.log("Reached Endpoint (user.showByID)");
            res.status(200).send(result);
        }
    })
})


router.post('/users/', function(req, res) { //Endpoint 1 (POST): Create new user and store in user table
    user.createNew(req.body, function(err, result) {
        if (err == null && result == null) {
            console.log("Reached Endpoint (user.createNew), Error: Empty value in request body");
            res.status(400).send("One of the required values is empty!");
        } else if (err == null) {
            console.log("Reached Endpoint (user.createNew)");
            res.status(201).send({ userid: result.insertId });
        }
        //cannot put as first if statement
        else if (err.errno == 1062) { //MySQL error number is 1062 when there is a duplicate entry of unique values
            console.log("Reached Endpoint (user.createNew), Error: Duplicate Entry");
            res.status(422).send("One of the columns entered (username, email, contact) already exists!");
        } else if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
    })
})


router.get('/users/', function(req, res) { //Endpoint 2 (GET): Retrieve info of all users in user table
    user.showAll(function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        } else {
            console.log("Reached Endpoint (user.showAll)");
            res.status(200).send(result);
        }
    })
})


router.post('/users/login', function(req, res) { //assignment2 endpoint for user login function
    var email = req.body.email;
    var password = req.body.password;

    user.loginUser(email, password, function(err, token, result) {
        if (err == null && result == null) { //returns both null if user does not exist in database
            console.log("Reached endpoint (user.loginUser), Error: Invalid user")
            res.status(404).send("Invalid username/password.");
        } else if (!err) { //user successfully logged in
            console.log("Reached endpoint (user.loginUser)")
            res.status(200).json({ userid: result[0].userid, type: result[0].type, token: token })
            console.log(result)
        } else {
            console.log(err)
            res.status(500).send("Unexpected Error!");
        }
    })
})


module.exports = router;