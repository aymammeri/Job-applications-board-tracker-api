const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const User = require('./user')
// eslint-disable-next-line no-unused-vars
const Column = require('./column')

const boardSchema = new mongoose.Schema(
  {
    columns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column'
      }
    ],
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

module.exports = mongoose.model('Board', boardSchema)
