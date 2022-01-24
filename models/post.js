const mongoose = require('mongoose')

const postShema = new mongoose.Schema({ // hiden from user
  user: {
    type: String,
    required: true,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  info: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('post', postShema) // expose data type created from schema above