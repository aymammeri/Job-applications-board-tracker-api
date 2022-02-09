const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const User = require('./user')
// eslint-disable-next-line no-unused-vars
const Column = require('./columns')

const boardSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    columns: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column'
    }]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Board', boardSchema)
