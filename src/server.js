const express = require('express');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Inicializaciónes
const app = express();
require('./config/passport');

//Seteos
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
})); 
app.set('view engine', 'hbs');

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



//Vaiables globales
app.use((req, res, next) =>{
    res.locals.ok_msg = req.flash('ok_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//Rutas
app.use(require('./routers/index.routes'));
app.use(require('./routers/votar.routes'));
app.use(require('./routers/user.routes'));


//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;  