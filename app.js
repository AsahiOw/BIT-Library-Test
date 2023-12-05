const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const port = 3000

const app = express();

// import models
// const User = require('./models/user');
// const Author = require('./models/author');
// const Book = require('./models/book');
// const Borrow = require('./models/borrow');
// const Category = require('./models/category');
// const Publisher = require('./models/publisher');
const authRouters = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// // database connection
mongoose.connect('mongodb+srv://s3978072:YrhwejwQY3c62LgF@librarymanagementsystem.d0hty1y.mongodb.net/')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));

// routes
//apply user data to all get
app.get('*', checkUser);

app.get('/', (req, res) => res.render('home'));
app.get('/second', requireAuth, (req, res) => res.render('second'));
app.get('/profile', requireAuth, (req, res) => res.render('profile'));
app.get('/borrow', requireAuth, (req, res) => res.render('borrow'));
app.get('/favourite', requireAuth, (req, res) => res.render('favourite'));
app.use(authRouters);


// wait for the app response = app.listen
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
  })