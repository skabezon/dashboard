const router = require('express').Router()
const passport = require('passport')
const bears = require('../models/bears')
const Client = require('../models/clients')
const rp = require('request-promise')

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
router.get('/clients', isAuthenticated, (req, res, next) => {
  rp({
    uri: 'http://localhost:3000/api/getclients',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(client => {
      let clients = JSON.parse(client)
      res.render('clients', { clients })
    })
})
router.get('/clients/create', isAuthenticated, (req, res, next) => {
  res.render('create')
})

router.post('/clients/create', isAuthenticated, (req, res, next) => {
  console.log(req.body.rut)
  Client.find({ _id: req.body.rut })
    .then(cliente => {
      if (cliente.length == 0) {
        console.log('no existe')
        let client = new Client()
        client.name = req.body.nombre
        client._id = req.body.rut
        client.lastname = req.body.apellido
        client.address = req.body.direccion
        console.log("HOOOOOOOOOOOOOOLA")
        client.save()
          .then(() => { res.render('create') })
          .catch(() => {
            res.render('menu')
          })
      } else if (cliente.length == 1) {
        console.log('existe')
      }
    })
 /*let c = 1
  if (!c) {
    let client = new Client()
    client.name = req.body.nombre
    client._id = req.body.rut
    client.lastname = req.body.apellido
    client.address = req.body.direccion
    console.log("HOOOOOOOOOOOOOOLA")
    client.save()
      .then(() => { res.render('create') })
      .catch(() => {
        res.render('menu')
      })
  } else {
    let client = new Client()
    client.name = req.body.nombre
    client._id = req.body.rut
    client.lastname = req.body.apellido
    client.address = req.body.direccion
    console.log(client)
    client.save()
      .then(() => { res.render('create') })
      .catch(() => {
        res.render('menu')
        res.send('error ya existe el usuario')
      })
  }*/
})
router.get('/clients/edit/:clientid', isAuthenticated, (req, res, next) => {
  let params = req.params.clientid
  let rut = params.slice(1)
  return rp({
    uri: 'http://localhost:3000/api/getclient/:' + rut,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(client => {
      console.log(JSON.parse(client)[0])
      let clients = JSON.parse(client)[0]
      console.log(clients)
      res.render('client', { clients })
    })
})
module.exports = router
