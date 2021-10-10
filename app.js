const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Event = require('./models/event');

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
            // empty find() returns all entries in collection
            return Event.find().then(events => {
                return events.map(event => {
                    // need to convert _id to proper string id to make it readable by graphQL
                    // mongoose has special .id property to abstract _id to id
                    return {...event._doc, _id: event.id};
                });
            }).catch(err => {
                throw err;
            })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            // provided by mongoose pkg -- hit DB and write our data into the DB
            return event.save().then(result => {
                console.log(result);
                // returns all core properties that make up our document object
                return {...result._doc};
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
        // we visit special URL when we use the graphQL calls
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
