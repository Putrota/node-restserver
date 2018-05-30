// =========================
// Puerto
// =========================
process.env.PORT = process.env.PORT || 3000;


// =========================
// Puerto
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =========================
// Base de Datos
// =========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:cafe123456@ds141720.mlab.com:41720/cafe';
}

process.env.URLDB = urlDB;