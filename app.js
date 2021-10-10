const express = require('express');
const bodyParser = require('body-parser');

// will generate graphQL schema object based on parameters we pass in below
const { buildSchema } = require('graphql');
// middleware that takes incoming requests, funnels through graphQL resolver
const {graphqlHTTP} = require("express-graphql");

// creates an express app Object to start node.js service on 
const app = express();

const events = [];

// bodyParser middleware to parse json bodies
app.use(bodyParser.json());

// graphQL endpoint handles requests -- only one endpoint to which all requests are sent
app.use('/graphql', 
    graphqlHTTP({
    // needs to point at a valid graphQL schema
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // points to JS object that has all the resolver functions in it
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            };
            console.log(event);
            events.push(event);
            return event;
        }
    },
        // we visit special URL when we use the graphQL calls
        graphiql: true
    
}));


// listen on port 3000 on which we can visit page on localhost:3000
app.listen(3000);