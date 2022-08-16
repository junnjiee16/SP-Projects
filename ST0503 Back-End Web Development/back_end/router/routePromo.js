const express = require('express'); //import express
const router = express.Router() //route all endpoints to app.js

const promotion = require('../model/promotion.js'); //import promotion file from model folder



// ./promotion/ endpoints
router.post('/promotion/:productid', function(req, res) { //Addn Endpoint (POST): Create new promotion period for a product
    var productid = req.params.productid

    promotion.newPromotion(req.body, productid, function(err, result) {
        if (err==null && result==null) {
            console.log("Reached Endpoint (promotion.newPromotion), Error: Empty value in request body");
            res.status(400).send("One of the values are empty!");
        }
        else if (err == null) {
            console.log("Reached Endpoint (promotion.newPromotion)");
            res.status(201).send('Promotion period created')
        }
        else if (err.errno == 1452) { //MySQL error 1452: foreign key provided does not match any rows of the parent table
            console.log("Reached Endpoint (promotion.newPromotion), Error: Product ID given does not exist");
            res.status(422).send("Product ID does not exist!");
        }
        else if (err.errno == 1292) { //MySQL error 1292: Wrong datetime format
            console.log("Reached Endpoint (promotion.newPromotion), Error: Wrong datetime format");
            res.status(422).send("Please enter correct datetime format!");
        }
        else {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
    })
})


router.get('/promotion/:productid', function(req, res) { //Addn Endpoint (GET): Retrieve all promotion periods of a product
    var productid = req.params.productid;

    promotion.showByID(productid, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
        else if (result == "") {
            console.log("Reached Endpoint (promotion.showByID), Error: Product ID does not exist/No available promotions");
            res.status(404).send("Product ID does not exist/No upcoming promotions for this product");
        }
        else {
            console.log("Reached Endpoint (promotion.showByID)");
            res.status(200).send(result);
        }
    })
})


router.get('/promotion/', function(req, res) { //Addn Endpoint (GET): Retrieve all promotion periods of all products
    promotion.showAll(function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
        else {
            console.log("Reached Endpoint (promotion.showAll)");
            res.status(200).send(result);
        }
    })
})


router.delete('/promotion/:promoid', function(req, res) { //Addn Endpoint (DEL): Delete a promotion period by promo id
    var promoid = req.params.promoid;

    promotion.deletePromo(promoid, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
        else if (result['affectedRows'] == 0) {
            console.log("Reached Endpoint (promotion.deletePromo), Error: Promo ID does not exist");
            res.status(404).send("Promo ID does not exist!");
        }
        else {
            console.log("Reached Endpoint (promotion.deletePromo)");
            res.status(200).send('Promotion period deleted');
        }
    })
})


module.exports = router;