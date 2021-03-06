const jwt = require('jsonwebtoken');


// =======================
// Verificar Token
// =======================
let verificacionToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido',
                }
            })

        }

        req.usuario = decode.usuario;

        next();

    });

};


// =======================
// Verificar Admin Role
// =======================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLES') {

        return res.status(403).json({
            ok: false,
            err: {
                message: 'El usuario no tiene privilegios.',
            }
        });

    }

    next();

};


// =======================
// Verificar Token para imagen
// =======================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido',
                }
            })

        }

        req.usuario = decode.usuario;

        next();

    });

};


module.exports = {
    verificacionToken,
    verificaAdmin_Role,
    verificaTokenImg
};