const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const User = require('./user')
// eslint-disable-next-line no-unused-vars
const Cell = require('./cell')

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    color: String,
    cells: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cell'
      }
    ],
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

module.exports = mongoose.model('Column', columnSchema)
