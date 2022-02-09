const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars

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
    description: String
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Cell', cellSchema)
