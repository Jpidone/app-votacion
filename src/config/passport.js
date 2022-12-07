const passport = require('passport');
const Votante = require('../models/Votante');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/Votante');

passport.use(new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'DNI'
}, async (nombreUsuario, DNI, done) => {
    //confirmar si existe DNI
    const user = await Votante.findOne({nombreUsuario});
    console.log(user);
    if (!user) {
        return done(null, false, {message: 'No existe el Usuario'});
    } else {
        //validar DNI
        const match = await user.matchDNI(DNI);
        console.log(DNI);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, {message: 'DNI Incorrecto'});
        }
    };
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});  

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});