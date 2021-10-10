const express = require('express');
const bodyParser = require('body-parser');

// will generate graphQL schema object based on parameters we pass in below
const { buildSchema } = require('graphql');
// middleware that takes incoming requests, funnels through graphQL resolver
const {graphqlHTTP} = require("express-graphql");

// creates an express app Object to start node.js service on 
const app = express();

// bodyParser middleware to parse json bodies
app.use(bodyParser.json());

// graphQL endpoint handles requests -- only one endpoint to which all requests are sent
app.use('/graphql', 
    graphqlHTTP({
    // needs to point at a valid graphQL schema
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        
        type RootMutation {
            createEvent(name: String): String
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // points to JS object that has all the resolver functions in it
    rootValue: {
        events: () => {
            return ['Doctor Telemedicine', 'Teacher Online Lesson', 'Nurse Telemedicine', 'Midwife Telemedicine'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
        // we visit special URL when we use the graphQL calls
        graphiql: true
    
}));


// listen on port 3000 on which we can visit page on localhost:3000
app.listen(3000);