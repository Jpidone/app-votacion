const mongoose = require('mongoose')

const VOTACION_APP_MONGODB_HOST = process.env.VOTACION_APP_MONGODB_HOST;
const VOTACION_APP_MONGODB_DATABASE = process.env.VOTACION_APP_MONGODB_DATABASE;
const MONGODB_URI='mongodb://localhost/votacion-app'  //+VOTACION_APP_MONGODB_HOST+'/'+VOTACION_APP_MONGODB_DATABASE;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.log(err));
