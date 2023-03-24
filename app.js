require('dotenv').config();
//console.log(process.env.CLOUDINARY_SECRET);

const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
//const initializePassport = require('./passport-config');
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
  
//ROUTES
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/users');

const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp');


//MONGO SERVER ERROR HANDLING
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
})

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



//SETUP SESSION
const sessionConfig = {
    name: 'session',
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        //secure:true fungsinya agar cookie kita hnya accessible dalam secured connections (https)
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    //NOTE: MASIH MENGGUNAKAN LOCAL MEMORY
}
app.use(session(sessionConfig));

app.use(flash());

//PASSPORT SETUP
//initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    //res.locals.success artinya success dapat diakses di folder views kapanpun.
    next();
})


/* 
NOTE: DALAM ASYNC FUNCTION, KETIKA ERROR DI THROW, ERROR TSBT TIDAK AKAN DI CATCH 
DIMANAPUN.
MAKANYA, KALO DI ASYNC FUNCTION, PAKE NEXT(ERROR), BUKAN THROW NEW ERROR.
*/

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/', userRouter);

//ERROR HANDLING
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
})

