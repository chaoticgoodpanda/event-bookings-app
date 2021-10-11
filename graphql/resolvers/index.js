// points to JS object that has all the resolver functions in it
const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const Booking = require('../../models/booking');

module.exports = {
    events: async () => {
        // empty find() returns all entries in collection
        try {
            const events = await Event.find()
            return events.map(event => {
                // need to convert _id to proper string id to make it readable by graphQL
                // mongoose has special .id property to abstract _id to id
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        }
        catch (err) {
            throw err;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {...booking._doc, 
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                };
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
                date: new Date(args.eventInput.date),
                // placeholder object for test user
                creator: '6163fcfa477e1ff1120aed3e'
            });
            let createdEvent;
            // provided by mongoose pkg -- hit DB and write our data into the DB
            const result = await event
                .save()
            createdEvent = {...result._doc, _id: result.id, creator: user.bind(this, result._doc.creator)};
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
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email})
                // if user already exists, throw error
                if (existingUser) {
                    throw new Error('User already exists.');
                }
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                const result = await user.save();
                return {...result._doc, password: null, _id: result.id};
        }
        catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            userId: '6163fcfa477e1ff1120aed3e',
            event: fetchedEvent
        });
        const result = await booking.save();
        return { ...result._doc, _id: result.id,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
    },
    cancelBooking: async args => {
        try {
            // get the event data along with the booking
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                // use _doc to retrieve event data
                ...booking.event._doc, 
                _id: booking.event.id, 
                creator: user.bind(this, booking.event._doc.creator)
            };
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        }
        catch (err) {
            throw err;
        } 
    }
};

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        events.map(event => {
            return { ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)};
        });
        return events.map;
    }
    catch (err) {
        throw err;
    }
};

// try getting a single event
const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId); 
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        };
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)}
    } catch (err) {
        throw err;
    }
};