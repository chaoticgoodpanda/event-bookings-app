const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index.js');
const graphQlResolvers = require('./graphql/resolvers/index.js');


// will generate graphQL schema object based on parameters we pass in below
// middleware that takes incoming requests, funnels through graphQL resolver
const {graphqlHTTP} = require("express-graphql");

// creates an express app Object to start node.js service on 
const app = express();

// bodyParser middleware to parse json bodies
app.use(bodyParser.json());


// graphQL endpoint handles requests -- only one endpoint to which all requests are sent
app.use('/graphql', 
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    }));

// establish connect to MongoDB server
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}
@dwmccluster.8vt7g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000);
    }).catch(err => {
        console.log(err);
});
