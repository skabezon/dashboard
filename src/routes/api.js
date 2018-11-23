const router = require('express').Router()
const passport = require('passport')
const Client = require('../models/clients')

function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
router.get('/getclients', (req, res, next) => {
  Client.find()
    .then((clients) => {
      res.json(clients)
    })
    .catch(() => { res.send('Sorry! Something went wrong.') })
})

router.get('/getclient/:clientid', (req, res, next) => {
  let params = req.params.clientid
  let rut = params.slice(1)
  Client.find({ _id: rut })
    .then((clients) => {
      res.json(clients)
    })
    .catch(() => { res.send('Sorry! Something went wrong.') })
})
module.exports = router
