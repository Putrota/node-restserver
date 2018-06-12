const express = require('express');

const _ = require('underscore');

const { verificacionToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


// =============================
// Mostrar todos los productos
// =============================
app.get('/producto', verificacionToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        //.sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });

            });

        });

});


// =============================
// Mostrar un producto por ID
// =============================
app.get('/producto/:id', verificacionToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});


// =============================
// Buscar producto
// =============================
app.get('/producto/buscar/:termino', verificacionToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});


// =============================
// Crear un nuevo producto
// =============================
app.post('/producto', verificacionToken, function(req, res) {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })

    });

});


// =============================
// Actualizar un producto
// =============================
app.put('/producto/:id', verificacionToken, function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

    /**
     * Alternativa
     * buscar si el producto existe y 
     * productoDB.save((err, productoGuardado) => {
     * 
     * })
     */

});


// =============================
// Desactiva un producto
// =============================
app.delete('/producto/:id', [verificacionToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto borrado'
        });

    });
});


module.exports = app;