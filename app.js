const express = require('express');
const bodyParser = require('body-parser');

// creates an express app Object to start node.js service on 
const app = express();

// bodyParser middleware to parse json bodies
app.use(bodyParser.json());

// listen to get requests on default '/' route and return Hello World!
app.get('/', (req, res, next) => {
    res.send('Hello World!');
})

// listen on port 3000 on which we can visit page on localhost:3000
app.listen(3000);