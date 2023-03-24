const User = require('../models/user');


module.exports.renderRegisterForm = async (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); //udh otomatis ke save
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Yelp-Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    console.log(req.session.returnTo);
    res.render('users/login');
}

module.exports.login = (req, res) => { 
    req.flash('success', 'Logged In!');
    res.redirect('/campgrounds');
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Logged you out');
        res.redirect('/campgrounds');
    });
}

// router.route('/login')
//   .get(users.renderLoginForm)
//   .post(
//     (req, res, next) => {
//       req.session.returnTo = req.body.returnTo || req.query.returnTo || req.session.returnTo;
//       next();
//     },
//     passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
//     (req, res) => {
//       const redirectUrl = req.session.returnTo || '/campgrounds'; // fallback to a default URL
//       delete req.session.returnTo; // clear the returnTo value
//       res.redirect(redirectUrl);
//     }
//   );
