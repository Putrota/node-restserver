const express = require('express');

const _ = require('underscore');

let Categoria = require('../models/categoria');

let { verificacionToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();


// =============================
// Mostrar todas las categorías
// =============================
app.get('/categoria', verificacionToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });

            });

        });
});


// =============================
// Mostrar una categoría por ID
// =============================
app.get('/categoria/:id', verificacionToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categorias: categoriaDB
        });

    });

});


// =============================
// Crear nueva categoría
// =============================
app.post('/categoria', verificacionToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


// =============================
// Actualizar nombre categoría
// =============================
app.put('/categoria/:id', verificacionToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});


// =============================
// Borrar una categoría
// =============================
app.delete('/categoria/:id', [verificacionToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Se borro la categoría'
        });

    });

});

module.exports = app;