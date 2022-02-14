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
    contactName: String,
    contactTitle: String,
    contactEmail: String,
    color: String,
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      immutable: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Cell', cellSchema)
