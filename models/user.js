const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'firstName must be filled']},
    lastName: { type: String, required: [true, 'lastName must be filled']},
    email: { type: String, required: [true,'Please enter an email'], unique: true, validate: [ isEmail, 'Please enter a valid email' ]},
    password: { type: String, required: [true,'Please enter a password'], minlength: [8, 'Password too short, 8 characters minimum required']},
    borrow: [{ type: mongoose.Types.ObjectId, ref: "borrow"}],
    favoritebook: [{ type: mongoose.Types.ObjectId, ref: "book"}],
    usertype: { type: String, enum: ['Manager', 'Reader'], required: true}
},
{
    timestamps: true
});

// this function will run after the data saved to database (doc = data saved in the database)
// userSchema.post

// this function will run before the data saved to database (Hash function with 'salt' using bcript)
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

// static method to login user (this is prefer to this model)
userSchema.statics.login = async function(email, password){
    // find the email within database
    const user = await this.findOne({ email });
    // check for existence
    if (user){
        // check the hash password between the input and the database
        const auth = await bcrypt.compare(password, user.password);
        // continue after the check
        if (auth) {
            return user;
        }
        throw Error('Incorrect password')
    }
    throw Error('Incorrect email')
    
}

const user = mongoose.model('user', userSchema);
module.exports = user;