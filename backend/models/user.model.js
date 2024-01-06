const mongoose = require('mongoose');
const bcrypt =  require('bcryptjs');
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
    trim: true,
    lowercase: true,
    validate(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('Invalid email address');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Enforce minimum password length
   // select: false // Prevent password from being exposed in results
  }
});

// this function run before saving changes to database and updating password.
userSchema.pre('save', async function (next) { 
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
