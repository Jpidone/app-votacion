const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const VotanteSchema = new Schema({
    nombreUsuario: {
        type: String,
        require: true

    },
    sexo: {
        type: String,
    },
    DNI: {
        type: String,
        require: true,
        unique: true,
    },
    Admin: {
        type: Boolean,
        require: true,
    },
    habilitado: {
        type: Boolean,
    }
}, {
    timestamps: true
} )

VotanteSchema.methods.encryptDNI = async DNI => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(DNI, salt);
}

VotanteSchema.methods.matchDNI = async function (DNI)  {
    return await bcrypt.compare(DNI, this.DNI)
}

module.exports = model('Votante', VotanteSchema);