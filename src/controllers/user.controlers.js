const bcryptjs = require("bcryptjs"); //agregado
const Votante = require("../models/Votante");

const userCtrl = {};

const passport = require("passport");
const { Collection } = require("mongoose");

userCtrl.renderSignUpForm = (req, res) => {
  res.render("users/signup");
};

userCtrl.signup = async (req, res) => {
  const errors = [];
  const { nombreUsuario, DNI, confirmar_DNI, genero } = req.body;
  let sexo;
  let elnombre;
  if (nombreUsuario.length < 4) {
    errors.push({
      text: "EL nombre de usuario debe tener mas de 4 caracteres",
    });
  }
  if (DNI != confirmar_DNI) {
    errors.push({ text: "DNI no coinciden" });
  }
  if (DNI.length > 8 || DNI.length < 7) {
    errors.push({ text: "El DNI no es valido" });
  }
  if (genero == "option1") {
    sexo = "Femenino";
  } else {
    if (genero == "option2") {
      sexo = "Masculino";
    } else {
      if (genero == "option3") {
        sexo = "otro";
      } else {
        errors.push({ text: "Debe seleccionar un Genero" });
      }
    }
  }
  let users = await Votante.find({}).lean();
  for (let index = 0; index < users.length; index++) {
    exist = await bcryptjs.compare(DNI, users[index].DNI);
    if (nombreUsuario === users[index].nombreUsuario) {
      errors.push({ text: "Ya exite ese nombre de usuario" });
      break;
    }

    console.log(exist);
    if (exist) {
      errors.push({ text: "Ya hay usuario registrado con ese DNI" });
      break;
    }
  }

  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      nombreUsuario,
      DNI,
      confirmar_DNI,
    });
  } else {
    let DNIuser = await Votante.findOne({ DNI: DNI }); //cambio const por let
    if (DNIuser) {
      req.flash("error_msg", "Ya esta registrada una persona con este DNI");
      res.redirect("/users/signup");
    } else {
      const Admin = false;
      const habilitado = true;
      const newUser = new Votante({
        nombreUsuario,
        DNI,
        Admin,
        habilitado,
        sexo,
      });
      newUser.DNI = await newUser.encryptDNI(DNI);
      await newUser.save();
      req.flash(
        "ok_msg",
        "Ya estas registrado, ahora ingresa para poder votar"
      );
      res.redirect("/users/signin");
    }
  }
};

userCtrl.renderSignInForm = (req, res) => {
  res.render("users/signin");
};

userCtrl.signin = passport.authenticate("local", {
  failureRedirect: "/users/signin",
  successRedirect: "/estadisticas",
  failureFlash: true,
});

userCtrl.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("ok_msg", "Has salido de la aplicación");
    res.redirect("/users/signin");
  });
};

module.exports = userCtrl;
