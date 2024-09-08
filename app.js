const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const Admin = require('./models/Admin');
const listingRoutes = require('./routes/listingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authenticationRoutes = require('./routes/authenticatingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

//evironments variables

let mongoDbUrl = process.env.MONGODB_URL;

//middlewares   

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', engine);
app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
        crypto: {
            secret: process.env.SECRET
        },
        mongoUrl: mongoDbUrl,
        touchAfter: 24 * 3600
    })
}));


app.use(flash());

// passport configuration

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.admin = req.session.admin;
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// mongoose connection        

async function main() {
    // await mongoose.connect('mongodb://127.0.0.1:27017/AIRBN');
    await mongoose.connect(mongoDbUrl);
}

main().then(() => {
    console.log("connected to AIRBN database...");
})

app.listen(3000, () => {
    console.log("server is listening to port 3000");
})

// routes middleware 

app.use('/', authenticationRoutes);
app.use('/admin', adminRoutes);
app.use('/list', listingRoutes);
app.use('/review', reviewRoutes);

app.use(async (err, req, res, next) => {
    console.log(err);

    res.locals.errorMsg = err.message;
    res.render('errorPage.ejs');
})   