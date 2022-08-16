//import express and load instance of express
const express = require('express');
const app = express();

//import cors to allow cross-origin HTTP requests
const cors = require('cors');

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());



// ./users/ endpoints
const user = require('../router/routeUser.js');
app.use(user);


// ./promotion/ endpoints
const promotion = require('../router/routePromo.js');
app.use(promotion);


// ./interest/ endpoints
const userInterest = require('../router/routeInterest.js');
app.use(userInterest);


// ./category/ endpoints
const category = require('../router/routeCategory.js');
app.use(category);


// ./product/ endpoints (also includes product review endpoints)
const product = require('../router/routeProduct.js');
app.use(product);



module.exports = app;