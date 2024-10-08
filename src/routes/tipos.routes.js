import { Router } from 'express';
import pool from '../database/database.js';

const router = Router();

// Listar tipos
router.get('/tipos_list', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM tipoMedic');
        res.render('tipos/tipos_list', { tipos: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Mostrar formulario para agregar un nuevo tipo
router.get('/tipos_add', (req, res) => {
    res.render('tipos/tipos_add');
});

// Procesar el formulario para agregar un nuevo tipo
router.post('/tipos_add', async (req, res) => {
    const { descripcion } = req.body;
    try {
        await pool.query('INSERT INTO tipoMedic (descripcion) VALUES (?)', [descripcion]);
        res.redirect('/tipos_list');
        console.log('Tipo agregado correctamente');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Mostrar formulario de edición para un tipo
router.get('/tipos_edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('SELECT * FROM tipoMedic WHERE id = ?', [id]);
        if (result.length > 0) {
            res.render('tipos/tipos_edit', { tipos: result[0] });
        } else {
            res.status(404).send('Tipo no encontrado');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Procesar formulario de edición para un tipo
router.post('/tipos_edit/:id', async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    try {
        await pool.query('UPDATE tipoMedic SET descripcion = ? WHERE id = ?', [descripcion, id]);
        res.redirect('/tipos_list');
        console.log('Tipo actualizado correctamente');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Eliminar un tipo
router.get('/tipos_delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tipoMedic WHERE id = ?', [id]);
        res.redirect('/tipos_list');
        console.log('Tipo eliminado correctamente');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
