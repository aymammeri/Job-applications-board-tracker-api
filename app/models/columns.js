const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const Cell = require('./cells')

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
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Column', columnSchema)
