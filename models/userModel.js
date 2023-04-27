const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your email address'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this function only works when we save data to database
      validator: function (el) {
        return el === this.password; // abc === abc
      },
      message: 'Password are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  // only run if password is modified
  if (!this.isModified('password')) return next();

  // hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // delete password confirm field
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
