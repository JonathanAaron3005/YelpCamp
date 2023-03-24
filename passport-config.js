const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user');

function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password or username' });
            }
        } catch (e) {
            return done(e);
        }
    }

    passport.use(new localStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, User.findOne({ id })));
}

module.exports = initialize;