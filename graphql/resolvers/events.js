const Event = require("../../models/event");
const {dateToString} = require("../../helpers/date");
const User = require("../../models/user");
const {transformEvent} = require("./merge");

module.exports = {
    events: async () => {
        // empty find() returns all entries in collection
        try {
            const events = await Event.find()
            return events.map(event => {
                // need to convert _id to proper string id to make it readable by graphQL
                // mongoose has special .id property to abstract _id to id
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },

    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: dateToString(args.eventInput.date),
                // placeholder object for test user
                creator: '6163fcfa477e1ff1120aed3e'
            });
            let createdEvent;
            // provided by mongoose pkg -- hit DB and write our data into the DB
            const result = await event
                .save()
            createdEvent = transformEvent(result);
            // returns all core properties that make up our document object
            const creator = await User.findById('6163fcfa477e1ff1120aed3e');
            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}



