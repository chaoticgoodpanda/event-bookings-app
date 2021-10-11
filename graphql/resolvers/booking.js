const Event = require("../../models/event");
const Booking = require("../../models/booking");
const {transformEvent, transformBooking} = require("./merge");

module.exports = {
    bookings: async (args, req) => {
    if (!req.isAuth) {
        throw new Error('Unauthenticated user');
    }
    try {
        const bookings = await Booking.find();
        return bookings.map(booking => {
            transformBooking(booking);
        });
    } catch (err) {
        throw err;
    }
},
bookEvent: async (args, req) => {
    if (!req.isAuth) {
        throw new Error('Unauthenticated user');
    }
    const fetchedEvent = await Event.findOne({_id: args.eventId});
    const booking = new Booking({
        userId: req.userId,
        event: fetchedEvent
    });
    const result = await booking.save();
    return transformBooking(result);
},
    cancelBooking: async (args, req) => {
    if (!req.isAuth) {
        throw new Error('Unauthenticated user');
    }
    try {
        // get the event data along with the booking
        const booking = await Booking.findById(args.bookingId).populate('event');
        const event = transformEvent(booking.event);
        await Booking.deleteOne({_id: args.bookingId});
        return event;
    }
    catch (err) {
        throw err;
    }
}
};

