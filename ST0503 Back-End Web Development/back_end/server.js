var app = require('./controller/app.js');
var express = require('express')

var port = 3000;

app.use(express.static('images/product'));


app.listen(port, function() {
    console.log(`SP IT Server started on http://localhost:${port}/`);
})