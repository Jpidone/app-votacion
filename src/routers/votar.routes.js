const { Router } = require('express');
const router = Router();

const { renderCandidatoForm, 
        crearCandidato, 
        listarCandidatos, 
        renderVotarForm,
        actualizarCandidato,
        eliminarCandidato,
        editarCandidatos 
    } = require('../controllers/votar.controlers');

const { isAuthenticated } = require('../helpers/autoriza')

//Admin Candidatos
router.get('/candidato/agregarCandidato', isAuthenticated, renderCandidatoForm);
router.post('/candidato/nuevoCandidato', isAuthenticated, crearCandidato);

//Listar todos los candidatos
router.get('/estadisticas', isAuthenticated, listarCandidatos);
router.get('/candidato/eliminar',isAuthenticated,  editarCandidatos);

//Votar
router.get('/candidato/votar/:id', isAuthenticated, renderVotarForm);
router.put('/candidato/votar/:id', isAuthenticated, actualizarCandidato);

//eliminar candidato
router.delete('/candidato/delete/:id', isAuthenticated, eliminarCandidato);


module.exports = router;
  
