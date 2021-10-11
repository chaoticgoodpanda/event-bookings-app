// points to JS object that has all the resolver functions in it
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
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
        } catch (err) {
            throw err;
        }
    }
}




