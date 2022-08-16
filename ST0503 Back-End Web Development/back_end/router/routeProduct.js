const express = require('express'); //import express
const router = express.Router() //route all endpoints to app.js

//import detect-file-type, multer, fs, path for image upload endpoint
const multer = require('multer');
var detect = require('detect-file-type');
const fs = require('fs');
const path = require('path');

//import product and review files from model folder
const product = require('../model/product.js');
const review = require('../model/review.js');

const verifyToken = require('../auth/verifyToken.js'); //import verifyToken file for jwt


//For multer storage engine
const storage = multer.diskStorage({
    destination: './images/product',
    filename: (req, file, callback) => {
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`) //make every image path unique 
    }
})
const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 }, //limit file size 1MB
    }).single('productimg') //only single file accepted



// ./product/ endpoints
router.post('/search/products/', function(req, res) { //Assignment 2 Endpoint (POST): Show all products using search by name/brand
    product.search(req.body, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        } else {
            console.log("Reached Endpoint (product.search)");
            res.status(200).json(result);
        }
    })
})


router.get('/new/products/', function(req, res) { //Assignment 2 Endpoint (GET): Show 12 latest products for index.html page
    product.newestProducts(function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        } else {
            console.log("Reached Endpoint (product.newestProducts)");
            res.status(200).send(result);
        }
    })
})


router.post('/product/:id/updateimage/', verifyToken, function(req, res) { //Assignment 2 Endpoint (POST): Improved version to delete existing image from image folder
    var productid = req.params.id;

    upload(req, res, function(err) { //using created upload function (multer)
        console.log(req.file)

        if (err instanceof multer.MulterError) { //Error if file size greater than 1MB or catch unexpected multer error
            if (err.code == 'LIMIT_FILE_SIZE') {
                console.log('Error: file size above 1MB')
                res.status(400).send('File size is greater than 1MB');
            } else {
                console.log(err);
                res.status(500).send('Unexpected Error!');
            }
        } else { //Passed image size check
            console.log(`Image received`);

            detect.fromFile(req.file.path, function(err, result) { //check if it is jpg/png format using detect-file-type npm
                if (err) {
                    return console.log(err);
                }
                console.log(result);

                if (result['ext'] == 'jpg' || result['ext'] == 'png') { //no error, proceed to push image link to database
                    product.updateImageLink(productid, req.file.filename, function(err, result, existingImgLink) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Unexpected Error!");
                            fs.unlinkSync(req.file.path) //delete image as error occured
                        } else if (result['changedRows'] == 0) {
                            console.log("Reached endpoint (product.insertImageLink), Error: ProductID does not exist")
                            res.status(422).send("ProductID does not exist!");
                            fs.unlinkSync(req.file.path) //delete image as error occured
                        } else {
                            if (existingImgLink != null) {
                                fs.unlinkSync(`images\\product\\${existingImgLink[0].image}`);
                            }
                            console.log("Reached endpoint (product.insertImageLink), image stored in database")
                            res.status(201).send('Image stored in database successfully')
                        }
                    })
                } else {
                    fs.unlinkSync(req.file.path) //delete image from images folder if image is not png/jpg
                    console.log("Reached endpoint (product.insertImageLink), image not stored in database")
                    res.status(404).send("Please submit only jpg/jpeg/png files");
                }
            });
        }
    })
})


router.post('/product/:id/review/', verifyToken, function(req, res) { //Endpoint 10 (POST): Create new review in review table
    var productid = req.params.id;

    review.createReview(req.body, productid, function(err, result) {
        if (err == null && result == null) { //check for any empty values in the request body
            console.log("Reached Endpoint (review.createReview), Error: Empty value in request body");
            res.status(400).send("One of the required values (userid, rating, review) is empty!");
        } else if (result == 0) {
            console.log("Reached Endpoint (review.createReview), Error: Rating not in range (0 to 5)");
            res.status(400).send("Rating must be from 0 to 5!");
        } else if (err == null) {
            console.log("Reached Endpoint (review.createReview)");
            res.status(201).send(`{"reviewid": "${result.insertId}"}`);
        } else if (err.errno == 1452) { //MySQL error 1452: foreign key provided does not match any rows of the parent table
            console.log("Reached Endpoint (review.createReview), Error: UserID/ProductID does not exist");
            res.status(422).send("UserID/ProductID does not exist!");
        } else if (err.errno == 1062) { //MySQL error number is 1062 when there is a duplicate entry of unique values
            console.log("Reached Endpoint (review.createReview), Error: Duplicate Entry");
            res.status(422).send("User cannot rate a product twice!");
        } else {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
    })
})


router.get('/product/:id/reviews/', function(req, res) { //Endpoint 11 (GET): Retrieve all reviews of all product by productid
    var productid = req.params.id;

    review.showReviews(productid, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        } else if (result == "") {
            console.log("Reached Endpoint (review.showReviews), No reviews found.");
            res.status(200).send("No reviews available for this product/Product ID does not exist.");
        } else {
            console.log("Reached Endpoint (review.showReviews)");
            res.status(200).send(result);
        }
    })
})


router.delete('/product/:id', verifyToken, function(req, res) { //Endpoint 9 (DEL): Delete product column from table by productid
    var productid = req.params.id;

    product.deleteProduct(productid, function(err, result, imagelink) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        } else if (result['affectedRows'] == 0) {
            console.log("Reached Endpoint (product.deleteProduct), Error: Product ID does not exist");
            res.status(404).send("Product ID does not exist!");

        } else {
            if (imagelink[0].image != null) {
                console.log("deleting image")
                fs.unlinkSync(`images\\product\\${imagelink[0].image}`)
            }
            console.log("Reached Endpoint (product.deleteProduct)");
            res.sendStatus(204);
        }
    })
})


router.get('/product/:id', function(req, res) { //Endpoint 8 (GET): Retrieve info of a product by productid
    var productid = req.params.id;

    product.showByID(productid, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        } else if (result == "") {
            console.log("Reached Endpoint (product.showByID), Error: Product ID does not exist");
            res.status(404).send("Product ID does not exist!");
        } else {
            console.log("Reached Endpoint (product.showByID)");
            res.status(200).send(result);
        }
    })
})


router.post('/product/', verifyToken, function(req, res) { //Endpoint 7 (POST): Create new product and store in product table
    product.createNew(req.body, function(err, result, productname) {
        if (err == null && result == null) { //empty values
            console.log("Reached Endpoint (product.createNew), Error: Empty value in request body");
            res.status(400).send("One of the required values (name, categoryid, brand, price) is empty!");
        } else if (err == null) { //no error
            console.log("Reached Endpoint (product.createNew)");
            res.status(201).json(`{"productid": "${result.insertId}", "name": "${productname}"}`);
        }
        //cannot put as first if statement
        else if (err.errno == 1062) { //MySQL error number is 1062 when there is a duplicate entry of unique values
            console.log("Reached Endpoint (product.createNew), Error: Duplicate Entry");
            res.status(422).send("Product name entered already exists!");
        } else if (err.errno == 1452) { //MySQL error 1452: foreign key provided does not match any rows of the parent table (category table)
            console.log("Reached Endpoint (product.createNew), Error: Category ID given does not exist");
            res.status(422).send("Category ID does not exist!");
        } else {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
    })
})


router.put('/product/:id/', verifyToken, function(req, res) { //Assignment 2 Endpoint (PUT): Update product details of the productid
    var productid = req.params.id;

    product.updateProduct(productid, req.body, function(err, result) {
        if (err == null) {
            if (result == "") {
                console.log("Reached Endpoint (product.updateProduct), Error: Product ID does not exist");
                res.status(404).send("Product ID does not exist!");
            } else {
                console.log("Reached Endpoint (product.updateProduct)");
                res.status(204).json(`{"status": "success"}`);
            }
        } else if (err.errno == 1062) { //MySQL error number is 1062 when there is a duplicate entry of unique values
            console.log("Reached Endpoint (product.updateProduct), Error: Duplicate Entry");
            res.status(422).send("Product name already exists!");
        } else if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        }
    })
})


router.get('/product/', function(req, res) { //Assignment 2 Endpoint (GET): Show all product listings in one page
    product.showAll(function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Unexpected Error!");
        } else {
            console.log("Reached Endpoint (product.showAll)");
            res.status(200).send(result);
        }
    })
})


//This endpoint is not in use anymore. Improved version => POST /product/:id/updateimage/
router.post('/product/:id/uploadimage/', verifyToken, function(req, res) { //Additional Endpoint (POST): Store product image relative path in productimage table
    var productid = req.params.id;

    upload(req, res, function(err) { //using created upload function (multer)
        console.log(req.file)

        if (err instanceof multer.MulterError) { //Error if file size greater than 1MB or catch unexpected multer error
            if (err.code == 'LIMIT_FILE_SIZE') {
                console.log('Error: file size above 1MB')
                res.status(400).send('File size is greater than 1MB');
            } else {
                console.log(err);
                res.status(500).send('Unexpected Error!');
            }
        } else { //Passed image size check
            console.log(`Image received`);

            detect.fromFile(req.file.path, function(err, result) { //check if it is jpg/png format using detect-file-type npm
                if (err) {
                    return console.log(err);
                }
                console.log(result);

                if (result['ext'] == 'jpg' || result['ext'] == 'png') { //no error, proceed to push image link to database
                    product.insertImageLink(productid, req.file.filename, function(err, result) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Unexpected Error!");
                            fs.unlinkSync(req.file.path) //delete image as error occured
                        } else if (result['changedRows'] == 0) {
                            console.log("Reached endpoint (product.insertImageLink), Error: ProductID does not exist")
                            res.status(422).send("ProductID does not exist!");
                            fs.unlinkSync(req.file.path) //delete image as error occured
                        } else {
                            console.log("Reached endpoint (product.insertImageLink), image stored in database")
                            res.status(201).send('Image stored in database successfully')
                        }
                    })
                } else {
                    fs.unlinkSync(req.file.path) //delete image from images folder if image is not png/jpg
                    console.log("Reached endpoint (product.insertImageLink), image not stored in database")
                    res.status(404).send("Please submit only jpg/jpeg/png files");
                }
            });
        }
    })
})


module.exports = router;