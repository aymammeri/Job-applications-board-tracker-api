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

router.get('/board', requireToken, (req, res, next) => {
  Board.findOne({ owner: req.user.id })
    .populate({
      path: 'columns',
      populate: { path: 'cells', model: 'Cell' }
    })
    .then(doc => {
      // return status 201, the email, and the new token
      res.status(201).json({ board: doc })
    })
})

// SHOW
router.get('/column/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Column.findById(req.params.id)
    .populate({ path: 'cells' })
    .then(handle404)
    // if `findById` is successful, respond with 200 and cell JSON
    .then(cell => res.status(200).json({ column: cell.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
router.post('/column', requireToken, removeBlanks, (req, res, next) => {
  req.body.column.owner = req.user.id
  Column.create(req.body.column)
    // respond to successful `create` with status 201 and JSON of new column
    .then(column => {
      Board.findById(req.body.column.board).then(board => {
        board.columns.push(column)
        board.save()
      })
      res.status(201).json({ column: column.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
router.patch('/column/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.column.owner
  Column.findById(req.params.id)
    .then(handle404)
    .then(column => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, column)

      // pass the result of Mongoose's `.update` to the next `.then`
      return column.updateOne(req.body.column)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
router.delete('/column/:id', requireToken, (req, res, next) => {
  Column.findById(req.params.id)
    .then(handle404)
    .then(column => {
      // throw an error if current user doesn't own column
      requireOwnership(req, column)
      // delete the example ONLY IF the above didn't throw
      column.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
router.get('/cell/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Cell.findById(req.params.id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and cell JSON
    .then(cell => res.status(200).json({ cell: cell.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
router.post('/cell', requireToken, removeBlanks, (req, res, next) => {
  req.body.cell.owner = req.user.id
  Cell.create(req.body.cell)
    // respond to successful `create` with status 201 and JSON of new cell
    .then(cell => {
      Column.findById(req.body.cell.column).then(column => {
        column.cells.push(cell)
        column.save()
      })
      res.status(201).json(cell)
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
router.patch('/cell/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.cell.owner
  Cell.findById(req.params.id)
    .then(handle404)
    .then(cell => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, cell)

      // pass the result of Mongoose's `.update` to the next `.then`
      return cell.updateOne(req.body.cell)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
router.delete('/cell/:id', requireToken, (req, res, next) => {
  Cell.findById(req.params.id)
    .then(handle404)
    .then(cell => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, cell)
      // delete the example ONLY IF the above didn't throw
      cell.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
