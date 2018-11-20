const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')
const Bears = require('../models/bears')
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({ 'email': email })
  
  console.log(hola)
  console.log(user)
  if (user) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'))
  } else {
    const newUser = new User()
    newUser.email = email
    newUser.password = newUser.encryptPassword(password)
    console.log('hola')
    console.log(newUser)
    console.log('hola')
    await newUser.save()
    done(null, newUser)
  }
}))

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const hola = await Bears.find()
  const user = await User.findOne({ email: email })
  if (!user) {
    return done(null, false, req.flash('signinMessage', 'No existe el usuario'))
  }
  if (!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Password incorrecta'))
  }
  console.log(hola)
  return done(null, user, hola)
}))
