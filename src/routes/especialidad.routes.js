import { Router } from 'express';
import pool from '../database/database.js';

const router = Router();

router.get('/espe_list', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM especialidad');
        res.render('especialidad/espe_list', { especialidad: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/espe_add', (req, res) => {
    res.render('especialidad/espe_add');
});

router.post('/espe_add', async (req, res) => {
    const { descripcion } = req.body;
    try {
        await pool.query('INSERT INTO especialidad (descripcion) VALUES (?)', [descripcion]);
        res.redirect('/espe_list');
        console.log('Especialidad agregada correctamente');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/espe_edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('SELECT * FROM especialidad WHERE id = ?', [id]);
        if (result.length > 0) {
            res.render('especialidad/espe_edit', { especialidad: result[0] });
        } else {
            res.status(404).send('Especialidad no encontrada');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.post('/espe_edit/:id', async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    try {
        await pool.query('UPDATE especialidad SET descripcion = ? WHERE id = ?', [descripcion, id]);
        res.redirect('/espe_list');
        console.log('Especialidad actualizada correctamente');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/espe_delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM especialidad WHERE id = ?', [id]);
        res.redirect('/espe_list');
        console.log('Especialidad eliminada correctamente');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
