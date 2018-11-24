/**
 * orderLineItems controller
 * 11/15/2018
 * @author Telio de Castro */

const express = require('express')
const api = express.Router()
const Model = require('../models/orderLineItems.js')
const LOG = require('../utils/logger.js')
const find = require('lodash.find')
const remove = require('lodash.remove')
const notfoundstring = 'orderLineItems'

// RESPOND WITH JSON DATA  --------------------------------------------

// GET all JSON
api.get('/findall', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const data = req.app.locals.orderLineItems.query
    res.send(JSON.stringify(data))
  })
  
  // GET one JSON by ID
  api.get('/findone/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const id = parseInt(req.params.id, 10) // base 10
    const data = req.app.locals.orderLineItems.query
    const item = find(data, { _id: id })
    if (!item) { return res.end(notfoundstring) }
    res.send(JSON.stringify(item))
  })

  // RESPOND WITH VIEWS  --------------------------------------------

// GET to this controller base URI (the default)
  
api.get("/index", (req,res) => {
    res.render ("orderLineItems/index.ejs");
})
//get create

api.get("/create", (req,res) => {
    LOG.info(`Handling GET /create${req}`)
    const item = new Model()
    LOG.debug(JSON.stringify(item))
    res.render('orderLineItems/create',
      {
        title: 'Create orderLineItem',
        layout: 'layout.ejs',
        orderLineItem: item
      })
    ;
})
//get /delete
api.get("/delete", (req,res) => {
    LOG.info(`Handling GET /delete/:id ${req}`)
    const id = parseInt(req.params.id, 10) // base 10
    const data = req.app.locals.orderLineItems.query
    const item = find(data, { _id: id })
    if (!item) { return res.end(notfoundstring) }
    LOG.info(`RETURNING VIEW FOR ${JSON.stringify(item)}`)
    return res.render('orderLineItems/delete.ejs',
      {
        title: 'Delete orderLineItem',
        layout: 'layout.ejs',
        orderLineItem: item
      })
})
//get /read
api.get("/read", (req,res) => {
    LOG.info(`Handling GET /details/:id ${req}`)
    const id = parseInt(req.params.id, 10) // base 10
    const data = req.app.locals.orderLineItems.query
    const item = find(data, { _id: id })
    if (!item) { return res.end(notfoundstring) }
    LOG.info(`RETURNING VIEW FOR ${JSON.stringify(item)}`)
    return res.render('orderLineItems/read.ejs',
      {
        title: 'orderLineItem Read',
        layout: 'layout.ejs',
        orderLineItem: item
      })
})
//get one and update??
api.get("/update", (req,res) => {
    LOG.info(`Handling GET /edit/:id ${req}`)
    const id = parseInt(req.params.id, 10) // base 10
    const data = req.app.locals.orderLineItems.query
    const item = find(data, { _id: id })
    if (!item) { return res.end(notfoundstring) }
    LOG.info(`RETURNING VIEW FOR${JSON.stringify(item)}`)
    return res.render('orderLineItems/update.ejs',
      {
        title: 'orderLineItem',
        layout: 'layout.ejs',
        puppy: item
      })
})

// HANDLE EXECUTE DATA MODIFICATION REQUESTS --------------------------------------------

// POST new
api.post('/save', (req, res) => {
    LOG.info(`Handling POST ${req}`)
    LOG.debug(JSON.stringify(req.body))
    const data = req.app.locals.orderLineItems.query
    const item = new Model()
    LOG.info(`NEW ID ${req.body.orderLineID}`)
    item.orderLineID = parseInt(req.body.orderLineID, 10) // base 10
    item.orderID = req.body.orderID
    item.productQuantity = parseInt(req.body.productQuantity, 10)
    item.productID = req.body.productID
    item.productPrice = req.body.productPrice
      data.push(item)
      LOG.info(`SAVING NEW orderLineItem ${JSON.stringify(item)}`)
      return res.redirect('/orderLineItems')
    
  })
  
  // POST update
  api.post('/save/:id', (req, res) => {
    LOG.info(`Handling SAVE request ${req}`)
    const id = parseInt(req.params.id, 10) // base 10
    LOG.info(`Handling SAVING ID=${id}`)
    const data = req.app.locals.orderLineItems.query
    const item = find(data, { orderLineID: id })
    if (!item) { return res.end(notfoundstring) }
    LOG.info(`ORIGINAL VALUES ${JSON.stringify(item)}`)
    LOG.info(`UPDATED VALUES: ${JSON.stringify(req.body)}`)
    item.orderID = req.body.orderID
    item.productQuantity = parseInt(req.body.productQuantity, 10)
    item.productID = req.body.productID
    item.productPrice = req.body.productPrice
      LOG.info(`SAVING UPDATED orderLineItem ${JSON.stringify(item)}`)
      return res.redirect('/orderLineItems')
    
  })
  
  // DELETE id (uses HTML5 form method POST)
  api.post('/delete/:id', (req, res) => {
    LOG.info(`Handling DELETE request ${req}`)
    const id = parseInt(req.params.id, 10) // base 10
    LOG.info(`Handling REMOVING ID=${id}`)
    const data = req.app.locals.orderLineItems.query
    const item = find(data, { orderLineID: id })
    if (!item) {
      return res.end(notfoundstring)
    }
    if (item.isActive) {
      item.isActive = false
      console.log(`Deacctivated item ${JSON.stringify(item)}`)
    } else {
      const item = remove(data, { orderLineID: id })
      console.log(`Permanently deleted item ${JSON.stringify(item)}`)
    }
    return res.redirect('/orderLineItems')
  })
  
  module.exports = api
