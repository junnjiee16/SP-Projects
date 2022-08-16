const express = require('express');
const app = express();

const port = 8081;

app.use(express.static('public'));

app.listen(port, function() {
    console.log(`SP IT Web Application hosted on http://localhost:${port}/`);
})