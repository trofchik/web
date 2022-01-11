const mongoose = require('mongoose')

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    default: ''
  },
  secondName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('User', userShema)