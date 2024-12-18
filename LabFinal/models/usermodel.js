const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      default: 'client',
    },
});

let UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
