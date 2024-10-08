import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import medicamentoRoutes from './routes/medicamento.routes.js';
import especialidadRoutes from './routes/especialidad.routes.js';
import tiposRoutes from './routes/tipos.routes.js';

// Para obtener el directorio actual (__dirname) en módulos ESM:
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Configura el puerto
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));

// Definir el helper `ifCond` para handlebars
const ifCond = (v1, operator, v2, options) => {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
};

// Configurar motor de plantilla
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        ifCond 
    }
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.render('index');
});

// Archivos estáticos
app.use(express.static(join(__dirname, 'public')));

// Rutas
app.use(medicamentoRoutes);
app.use(especialidadRoutes);
app.use(tiposRoutes);

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});
