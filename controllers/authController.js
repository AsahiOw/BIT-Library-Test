// import models
const User = require('../models/user');
const Author = require('../models/author');
const Category = require('../models/category');
const Publisher = require('../models/publisher');
const Book = require('../models/book');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// error handler, use to handle error message from models (sign in and Log in only)
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { firstName: '', lastName:'', email: '', password: ''};

    // Incorrect Email and password for login
    if (err.message === 'Incorrect email')
    {
        errors.email = 'This email is not registered';
    }
    if (err.message === 'Incorrect password')
    {
        errors.password = 'This password is incorrect';
    }

    // Duplicate Error Code for similar email
    if (err.code == 11000) {
        errors.email = 'That email has already been registered';
        return errors;
    }

    // check for type of error
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    
    return errors;
}

// create token
// token check age in seconds, cookies check age in miliseconds this is important to keep them the same time
const maxAge = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({ id }, 'Secret', {
        expiresIn: maxAge
    });
}

// childs connect to authRouter(Login, Signup)
module.exports.signup_get = (req, res) => {
    res.render('signup');
}


module.exports.signup_post = async (req, res) => {
    const {firstName, lastName, email, password, usertype} = req.body;
    try {
        const user = await User.create({firstName, lastName, email, password, usertype});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}


module.exports.login_get = (req, res) => {
    res.render('login');
}


module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    // try to login
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({ user: user._id });
    }
    catch (err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req,res) => {
    // this part will remove the user cookie with a blank cookie with a duration of 1 milisecond.
    // After that there will be no cookie == successfully logout
    res.cookie('jwt', '', { maxAge: 1});

    // Instead of go into logout page (which does not exist), redirect user to login page.
    res.redirect('/login');
}


// error handler, use to handle error message from models (author,book, category and publisher)
const handleErrors2 = (err) => {
    console.log(err.message, err.code);
    let errors = { Name: ''};

    // Duplicate Error Code for similar name
    if (err.code == 11000) {
        errors.name = 'This name has been registered';
        return errors;
    }

    // Duplicate Error Code for similar 
    // if (err.code == 11000) {
    //     // errors.title = 'Similar title';
    //     // return errors;
    //     pass;
    // }

    // check for type of error
    if (err.message.includes('author validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    if (err.message.includes('category validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    if (err.message.includes('publisher validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    if (err.message.includes('book validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    
    return errors;
}

// childs connect to authRouter(book, author, category and publisher)
module.exports.author_get = (req, res) => {
    res.render('author');
}

module.exports.author_post = async (req, res) => {
    const {name} = req.body;
    try {
        const author = await Author.create({name});
        res.status(200).json(author);
    }
    catch (err) {
        const errors = handleErrors2(err);
        res.status(400).json({ errors });
    }
}
module.exports.book_get = async (req, res) => {
    try {
        const authors = await Author.find();
        const categories = await Category.find();
        const publishers = await Publisher.find();
        res.render('book', { authors, categories, publishers });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
}

module.exports.book_post = async (req, res) => {
    const {ISBN, title, author, category, publisher, numberofpages, bookCountAvailable, description} = req.body;
    try {
        const book = await Book.create({ISBN, title, author, category, publisher, numberofpages, bookCountAvailable, description});
        res.status(200).json(book);
    }
    catch (err) {
        const errors = handleErrors2(err);
        res.status(400).json({ errors });
    }
}


module.exports.category_get = (req, res) => {
    res.render('category');
}

module.exports.category_post = async (req, res) => {
    const {name} = req.body;
    try {
        const category = await Category.create({name});
        res.status(200).json(category);
    }
    catch (err) {
        const errors = handleErrors2(err);
        res.status(400).json({ errors });
    }
}


module.exports.publisher_get = (req, res) => {
    res.render('publisher');
}

module.exports.publisher_post = async (req, res) => {
    const {name} = req.body;
    try {
        const publisher = await Publisher.create({name});
        res.status(200).json(publisher);
    }
    catch (err) {
        const errors = handleErrors2(err);
        res.status(400).json({ errors });
    }
}