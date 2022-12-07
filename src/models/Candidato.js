const { Schema, model } = require('mongoose');

require('mongoose');

const CandidatoSchema = new Schema({
    nombrePais: {
        type: String,
        require: true,
        unique: true,

    },
    nombreFederacion: {
        type: String,
        require: true
    },
    imgBandera: {
        type: String,
    },
    votos: {
        type: Number,
    },
    porcentaje: {
        type: String,
    },
}, {
    timestamps: true
} )

module.exports = model('Candidato', CandidatoSchema);