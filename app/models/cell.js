const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const User = require('./user')

const cellSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    ContactName: String,
    ContactTitle: String,
    ContactEmail: String,
    Note: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Cell', cellSchema)
