const { authenticate } = require('passport')
const bcrypt = require('bcrypt')

function initialized(passport, getUserByEmail, getUserById) {
  const authenticateAccount = async (email, password, done) => {
    const account = getUserByEmail(email)
    if (account == null) {
      return done(null, false, {message: 'No Account is connected to this email'})
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, account)
      }
      else {
        return done(null, false, {message: 'password incorrect'})
      }
    }
    catch (e) {
      return done(e)
    }
  }

  const localStrategy = require('passport-local')
  .Strategy
  passport.use(new localStrategy({ usernameField: 'email'}, authenticateAccount))
  passport.serializeUser((user, done) => done(null, account.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialized