const express = require('express'); //import express
const router = express.Router() //route all endpoints to app.js

const category = require('../model/category.js'); //import category file from model folder

const verifyToken = require('../auth/verifyToken.js'); //import verifyToken file for jwt



// ./category/ endpoints
router.post('/category/', verifyToken, function(req, res) { //Endpoint 5 (POST): Create new category and description in category table
    category.createNew(req.body, function(err, result) {
        if (err == null && result == null) {
            console.log("Reached Endpoint (category.createNew), Error: Empty value in request body");
            res.status(400).send("Category value is empty!");
        } else if (err == null) {
            console.log("Reached Endpoint (category.createNew)");
            res.sendStatus(204);
        }
        //cannot put as first if statement
        else if (err.errno == 1062) { //MySQL error number is 1062 when there is a duplicate entry of unique values
            console.log("Reached Endpoint (category.createNew), Error: Duplicate Entry");
            res.status(422).send("Category name already exists!");
        } else if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
    })
})


router.get('/category/', function(req, res) { //Endpoint 6 (GET): Retrieve info of all categories in category table
    category.showAll(function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        } else {
            console.log("Reached Endpoint (category.showAll)");
            res.status(200).send(result);
        }
    })
})


module.exports = router;