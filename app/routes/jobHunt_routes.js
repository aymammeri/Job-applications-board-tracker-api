// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Board = require('../models/board')
const Column = require('../models/column')
const Cell = require('../models/cell')
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// CREATE
router.post('/column', requireToken, removeBlanks, async (req, res, next) => {
  req.body.form.owner = req.user.id
  try {
    const board = await Board.findById(req.body.elementId).then(handle404)
    if (board) {
      requireOwnership(req, board)
      const column = await Column.create(req.body.form)
      // respond to successful `create` with status 201 and JSON of new column
      await board.columns.push(column)
      await board.save()
      res.status(201).json({ column: column.toObject() })
    }
  } catch (error) {
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    next(error)
  }
})

// CREATE
router.post('/cell', requireToken, removeBlanks, async (req, res, next) => {
  req.body.form.owner = req.user.id
  try {
    const column = await Column.findById(req.body.elementId).then(handle404)
    if (column) {
      requireOwnership(req, column)
      const cell = await Cell.create(req.body.form)
      column.cells.push(cell)
      column.save()
      // respond to successful `create` with status 201 and JSON of new cell
      res.status(201).json(cell)
    }
  } catch (error) {
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    next(error)
  }
})

// READ BOARD
router.get('/board', requireToken, async (req, res, next) => {
  try {
    const board = await Board.findOne({ owner: req.user.id }).populate({
      path: 'columns',
      model: 'Column',
      populate: { path: 'cells', model: 'Cell' }
    })
    // return status 201, the email, and the new token
    res.status(201).json({ board })
  } catch (error) {
    next(error)
  }
})

// UPDATE COLUMNS ORDER
router.put('/column/', requireToken, removeBlanks, async (req, res, next) => {
  try {
    const srcCol = await Column.findOne({ owner: req.user.id, _id: req.body.source.droppableId })
    const [removed] = srcCol.cells.splice(req.body.source.index, 1)
    await srcCol.save()
    const desCol = await Column.findOne({ owner: req.user.id, _id: req.body.destination.droppableId })
    desCol.cells.splice(req.body.destination.index, 0, removed)
    await desCol.save()
    // if that succeeded, return 204 and no JSON
    res.status(204)
  } catch (error) {
    // if an error occurs, pass it to the handler

    next(error)
  }
})

// UPDATE COLUMN
router.patch(
  '/column/:id',
  requireToken,
  removeBlanks,
  async (req, res, next) => {
    try {
      // if the client attempts to change the `owner` property by including a new
      // owner, prevent that by deleting that key/value pair
      const column = await Column.findById(req.params.id).then(handle404)
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, column)

      // pass the result of Mongoose's `.update` to the next `.then`
      await column.updateOne(req.body.form)

      // if that succeeded, return 204 and no JSON
      res.sendStatus(204)
    } catch (error) {
      // if an error occurs, pass it to the handler

      next(error)
    }
  }
)

// UPDATE CELL
router.patch(
  '/cell/:id',
  requireToken,
  removeBlanks,
  async (req, res, next) => {
    try {
      // if the client attempts to change the `owner` property by including a new
      // owner, prevent that by deleting that key/value pair
      const cell = await Cell.findById(req.params.id).then(handle404)
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, cell)

      // pass the result of Mongoose's `.update` to the next `.then`
      await cell.updateOne(req.body.form)
      // if that succeeded, return 204 and no JSON
      res.sendStatus(204)
    } catch (error) {
      // if an error occurs, pass it to the handler
      next(error)
    }
  }
)

// DELETE COLUMN
router.delete('/column/:id', requireToken, async (req, res, next) => {
  try {
    const column = await Column.findById(req.params.id).then(handle404)
    // throw an error if current user doesn't own column
    requireOwnership(req, column)
    // delete the example ONLY IF the above didn't throw
    await column.deleteOne()
    // send back 204 and no content if the deletion succeeded
    res.sendStatus(204)
  } catch (error) {
    // if an error occurs, pass it to the handler
    next(error)
  }
})

// DELETE CELL
router.delete('/cell/:id', requireToken, async (req, res, next) => {
  try {
    const cell = await Cell.findById(req.params.id).then(handle404)
    // throw an error if current user doesn't own `example`
    requireOwnership(req, cell)
    // delete the example ONLY IF the above didn't throw
    cell.deleteOne()
    // send back 204 and no content if the deletion succeeded
    res.sendStatus(204)
  } catch (error) {
    // if an error occurs, pass it to the handler
    next(error)
  }
})

module.exports = router
