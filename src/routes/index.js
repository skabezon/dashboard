const router = require('express').Router()
const passport = require('passport')
const bears = require('../models/bears')
const Client = require('../models/clients')

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}))

router.get('/ingresar', (req, res, next) => {
  res.render('signin')
})

router.post('/ingresar', passport.authenticate('local-signin', {
  successRedirect: '/menu',
  failureRedirect: '/ingresar',
  failureFlash: true
}))

router.get('/menu', isAuthenticated, (req, res, next) => {
  res.render('menu')
})

router.get('/hola', isAuthenticated, (req, res, next) => {
  bears.find()
    .then((bear) => {
      res.render('osos', { bear })
    })
    .catch(() => { res.send('Sorry! Something went wrong.') })
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})
function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}
// crear clientes
router.get('/clients/create', isAuthenticated, (req, res, next) => {
  res.render('create')
})
router.post('/clients/create', (req, res, next) => {
  let c = Client.find({ _id: req.body.rut })
  if (!c) {
    let client = new Client()
    client.name = req.body.nombre
    client._id = req.body.rut
    client.lastname = req.body.apellido
    client.address = req.body.direccion
    console.log(client)
    client.save()
      .then(() => { res.render('clients/create') })
      .catch(() => {
        res.render('menu')
      })
  } else {

  }
  let client = new Client()
  client.name = req.body.nombre
  client._id = req.body.rut
  client.lastname = req.body.apellido
  client.address = req.body.direccion
  console.log(client)
  client.save()
    .then(() => { res.render('clients/create') })
    .catch(() => {
      res.render('menu')
      res.send('error ya existe el usuario')
    })
})
module.exports = router
