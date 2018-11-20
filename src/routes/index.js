const router = require('express').Router()
const passport = require('passport')
const bears = require('../models/bears')

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

module.exports = router
