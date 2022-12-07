const votarCtrl = {};

const { collection } = require('../models/Candidato');
const Candidato = require('../models/Candidato');
const Votante = require('../models/Votante');

votarCtrl.renderCandidatoForm = (req, res) => {
    const isAdmin = req.user.Admin;
    console.log(isAdmin);
    if (isAdmin){
        res.render('../views/candidato/nuevoCandidato.hbs')
    } else {
        req.flash('error_msg', 'No eres administrador, no puedes editar candidatos');
        res.redirect('/estadisticas');
    }
    
};

votarCtrl.crearCandidato = async (req, res) => {
    const {nombrePais, nombreFederacion} = req.body;
    const pais = await Candidato.findOne({nombrePais: nombrePais});
    const votos = 0;
    if (pais){
        req.flash('error_msg', 'Ya esta registrado este Pais');
        res.redirect('/candidato/agregarCandidato');
    } else { 
        const newCandidato = new Candidato({nombrePais: nombrePais, nombreFederacion: nombreFederacion, votos: votos});
        await newCandidato.save();
        req.flash('ok_msg', 'Candidato Agregado Con Exito');
        res.redirect('/estadisticas');  
    }
    
};

votarCtrl.listarCandidatos = async (req, res) => {
    let candidato = await Candidato.find({}).lean(); 
    let votosTotal = 0;
    let losCandidatos = new Array;
    losCandidatos = candidato;
    for (let index = 0; index < losCandidatos.length; index++) {
        votosTotal = votosTotal + losCandidatos[index].votos;
        
    };
    for (let index = 0; index < losCandidatos.length; index++) {
       let porcentaje = losCandidatos[index].votos * 100 / votosTotal;
       porcentaje = porcentaje.toFixed(2);      
       await Candidato.findOneAndUpdate({nombrePais: losCandidatos[index].nombrePais}, {porcentaje: porcentaje} );
       ///arriba saque []{}
    }
    candidato = await Candidato.find({}).sort({votos: -1}).lean();
    res.render('../views/candidato/todosLosCandidatos.hbs', {candidato, votosTotal});
};

votarCtrl.renderVotarForm = async (req, res) => {
    const candidato = await Candidato.findById(req.params.id);
    const nombrePais = candidato.nombrePais;
    const nombreFederacion = candidato.nombreFederacion;
    const votos = candidato.votos;
    const candidatoID = candidato._id;
    res.render('../views/candidato/votarCandidato', {nombrePais, nombreFederacion, votos, candidatoID});
};

votarCtrl.actualizarCandidato = async (req, res) => {
    //Ya voto?
    const habilitado = req.user.habilitado;
    console.log(habilitado);
   if (habilitado != true){
      req.flash('error_msg', 'Ya has votado, no puedes volver a votar');
      return res.redirect('/estadisticas');
    } 
    //Actualizo los vots
    let {votosn} = req.body;
    votosn++;
    await Candidato.findByIdAndUpdate(req.params.id,{votos: votosn} );
    req.flash('ok_msg', 'Su voto ha sido registrado');
    const candidato = await Candidato.find({}).lean();
    let votosTotal = 0;
    let losCandidatos = new Array;
    losCandidatos = candidato;
    for (let index = 0; index < losCandidatos.length; index++) {
        votosTotal = votosTotal + losCandidatos[index].votos;      
    };
    console.log(votosTotal);
    for (let index = 0; index < losCandidatos.length; index++) {
       let porcentaje = losCandidatos[index].votos * 100 / votosTotal;
       porcentaje = porcentaje.toFixed(2);      
       await Candidato.findOneAndUpdate({nombrePais: losCandidatos[index].nombrePais},{porcentaje: porcentaje} );
    }
    // deshabilito el votante
    const deshabilitar = false
    await Votante.findByIdAndUpdate(req.user.id, {habilitado: deshabilitar});
    res.redirect('/estadisticas')
};

votarCtrl.editarCandidatos = async (req, res) => {
    const candidato = await Candidato.find({}).lean();
    const isAdmin = req.user.Admin;
    console.log(isAdmin);
    if (isAdmin){
        res.render('../views/candidato/adminCandidatos', {candidato});
    } else {
        req.flash('error_msg', 'No eres administrador, no puedes editar candidatos');
        res.redirect('/estadisticas');
    }
   
};

votarCtrl.eliminarCandidato = async (req, res) => {
   await Candidato.findByIdAndRemove(req.params.id);
   req.flash('ok_msg', 'Candidato Eliminado');
   res.redirect('/candidato/eliminar')
};


module.exports = votarCtrl;   