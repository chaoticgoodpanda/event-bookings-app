const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        // if user isn't authorized, continue request to show parts of page that don't require login
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // Bearer [some token value]
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    } 
    try {
        // returns decoded token if valid
        decodedToken = jwt.verify(token,  'somesupersecretkey');
    }
    catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    // store decoded token userID field in request userId field.
    req.userId = decodedToken.userId;
    
}