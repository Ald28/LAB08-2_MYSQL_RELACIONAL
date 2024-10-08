import { Router } from 'express';
import pool from '../database/database.js';
import moment from 'moment';

const router = Router();

router.get('/medi_list', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT m.*, e.descripcion AS especialidad, t.descripcion AS tipoMedic
            FROM medicamento m
            JOIN especialidad e ON m.especialidad_id = e.id
            JOIN tipoMedic t ON m.tipoMedic_id = t.id
        `);

        const medicamentos = result.map(med => ({
            ...med,
            fechaFabricacion: moment(med.fechaFabricacion).format('YYYY-MM-DD'),
            fechaVencimiento: moment(med.fechaVencimiento).format('YYYY-MM-DD')
        }));

        res.render('medicamento/medi_list', { medicamento: medicamentos });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/medi_add', async (req, res) => {
    try {
        const [especialidades] = await pool.query('SELECT * FROM especialidad');
        const [tiposMedicamento] = await pool.query('SELECT * FROM tipoMedic');

        res.render('medicamento/medi_add', { especialidades, tiposMedicamento });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/medi_add', async (req, res) => {
    try {
        const { descripcion, fechaFabricacion, fechaVencimiento, presentacion, stock, precioVentaUni, precioVentaPres, marca, especialidad_id, tipoMedic_id } = req.body;

        await pool.query(
            'INSERT INTO medicamento (descripcion, fechaFabricacion, fechaVencimiento, presentacion, stock, precioVentaUni, precioVentaPres, marca, especialidad_id, tipoMedic_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [descripcion, fechaFabricacion, fechaVencimiento, presentacion, stock, precioVentaUni, precioVentaPres, marca, especialidad_id, tipoMedic_id]
        );
        
        res.redirect('/medi_list');
        console.log('Medicamento agregado correctamente');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/medi_edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('SELECT * FROM medicamento WHERE id = ?', [id]);
        
        const [especialidades] = await pool.query('SELECT * FROM especialidad');
        const [tiposMedicamento] = await pool.query('SELECT * FROM tipoMedic');

        if (result.length > 0) {
            const medicamento = {
                ...result[0],
                fechaFabricacion: moment(result[0].fechaFabricacion).format('YYYY-MM-DD'),
                fechaVencimiento: moment(result[0].fechaVencimiento).format('YYYY-MM-DD')
            };
            
            res.render('medicamento/medi_edit', { medicamento, especialidades, tiposMedicamento });
        } else {
            res.status(404).send('Medicamento no encontrado');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/medi_edit/:id', async (req, res) => {
    const { id } = req.params;
    const { descripcion, fechaFabricacion, fechaVencimiento, presentacion, stock, precioVentaUni, precioVentaPres, marca, especialidad_id, tipoMedic_id } = req.body;

    try {
        await pool.query(
            'UPDATE medicamento SET descripcion = ?, fechaFabricacion = ?, fechaVencimiento = ?, presentacion = ?, stock = ?, precioVentaUni = ?, precioVentaPres = ?, marca = ?, especialidad_id = ?, tipoMedic_id = ? WHERE id = ?',
            [descripcion, fechaFabricacion, fechaVencimiento, presentacion, stock, precioVentaUni, precioVentaPres, marca, especialidad_id, tipoMedic_id, id]
        );
        
        res.redirect('/medi_list');
        console.log('Medicamento actualizado correctamente');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/medi_delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM medicamento WHERE id = ?', [id]);
        res.redirect('/medi_list');
        console.log('Medicamento eliminado correctamente');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
