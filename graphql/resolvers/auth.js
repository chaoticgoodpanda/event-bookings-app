// points to JS object that has all the resolver functions in it
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

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
    },
    login: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if (!user) {
            throw new Error('User does not exist');
        }
        // compare stored password with incoming password
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            throw new Error('Password is incorrect.');
        }
        // params to store in JWT token
        // expires in 1 hour
        const token = jwt.sign({userId: user.id, email: user.email}, 
            'somesupersecretkey', {expiresIn: '1h'});
        
        return { userId: user.id, token: token, tokenExpiration: 1}
    } 
}




