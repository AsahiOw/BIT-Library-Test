// This is a custom middleware to protect other page from access without login
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
    // grab the cookies store on user browser
    const token = req.cookies.jwt;

    // check json web token exists and is verified ( basically if else function)
    if (token) {
        jwt.verify(token, 'Secret', (err, decodedToken) =>{
            if (err){
                // if the token invalid, back to login
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        // if no token, bring user back to login
        res.redirect('/login');
    }
}

// check for current login user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    // this part is checking token exist and is verified similar to middleware protect page
    if (token){
        jwt.verify(token, 'Secret', async (err, decodedToken) =>{
            if (err){
                // if the token not valid, next because use not login
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                // if the token valid, get user data by id
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else{
        res.locals.user = null;
        next();
    }
}
module.exports = { requireAuth, checkUser };