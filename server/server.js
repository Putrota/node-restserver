require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());


app.use(require('./routes/usuario'));


mongoose.connect(process.env.URLDB, (err, resp) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});


app.listen(process.env.PORT, () => {

    console.log(`Escuchando puerto: ${ process.env.PORT }`);

});

/**
 * En una petición ya no se acostumbra a borrar registros
 * se cambia el estado de algo
 * pero el registro siempre queda
 * 
 * Payload la información del post que estamos mandando
 */