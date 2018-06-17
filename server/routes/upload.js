const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


// Transforma lo que se esté subiendo
// Y lo coloca en el objeto files
app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {

        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo.'
                }
            });
    }

    // Valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos válidos permitidos son ${ tiposValidos.join(', ') }`,
                tipo
            }
        });
    }


    let archivo = req.files.archivo;
    let nomberCortado = archivo.name.split('.');
    let extension = nomberCortado[nomberCortado.length - 1];


    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones vállidas son ${ extensionesValidas.join(', ') }`,
                ext: extension
            }
        });
    }

    // Cambiar nobre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aquí la imagen se cambió
        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            borrarImagen(usuarioDB.img, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borrarImagen(usuarioDB.img, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borrarImagen(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });

}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            borrarImagen(productoDB.img, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            borrarImagen(productoDB.img, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borrarImagen(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            });

        });

    });

}


function borrarImagen(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;