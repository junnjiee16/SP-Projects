const express = require('express'); //import express
const router = express.Router() //route all endpoints to app.js

const userInterest = require('../model/userInterest.js'); //import userInterest file from model folder

const verifyToken = require('../auth/verifyToken.js'); //import verifyToken file for jwt


// ./interest/ endpoints
router.post('/interest/:userid', verifyToken, function(req, res) { //Endpoint 12 (POST): Create row for each user's interested categories
    var userid = req.params.userid;

    userInterest.inputInterests(userid, req.body, function(err, result) {
        if (err == null && result == null) {
            console.log("Reached Endpoint (userInterest.inputInterests), User has no new categories selected as interest");
            res.status(422).send("You already selected these categories!")

        } else if (err == null) {
            console.log("Reached Endpoint (userInterest.inputInterests)");
            res.status(201).json(`{"result": "interests created"}`);

        } else if (err.errno == 1452) { //MySQL error 1452: foreign key provided does not match any rows of the parent table
            console.log("Reached Endpoint (userInterest.inputInterests), Error: User/Category ID given does not exist");
            res.status(400).send("User ID/Category ID does not exist!");

        } else if (err.errno == 1366) { //MySQL error 1366: Date type of value given does not match the required data type for that column
            console.log("Reached Endpoint (userInterest.inputInterests), Error: Incorrect integer value for categoryid/userid");
            res.status(400).send("Error: Please enter integer values only!");

        } else {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
    })
})

router.get('/interest/:userid', verifyToken, function(req, res) { //Assignment 2 Endpoint (GET): Retrieve all interested categories of user by userid
    var userid = req.params.userid;

    userInterest.showInterests(userid, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!")
        } else {
            console.log("Reached Endpoint (userInterest.showInterests)");
            res.status(200).send(result)
        }
    })
})


module.exports = router;