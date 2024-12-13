const express = require('express');
const Notification = require('../models/Notification');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Obtener todas las notificaciones del usuario actual
router.get('/', verifyToken, async (req, res) => {
    try {
        const notificaciones = await Notification.find({ usuario: req.user.id, eliminado: false })
            .sort({ fechaCreación: -1 });
        res.json({ notificaciones });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener las notificaciones' });
    }
});

// Marcar una notificación como leída
router.patch('/:id/leido', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const notificacion = await Notification.findById(id);

        if (!notificacion) {
            return res.status(404).json({ mensaje: 'Notificación no encontrada.' });
        }

        if (notificacion.usuario.toString() !== req.user.id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para modificar esta notificación.' });
        }

        notificacion.leido = true;
        await notificacion.save();

        res.json({ mensaje: 'Notificación marcada como leída', notificacion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al marcar la notificación como leída' });
    }
});

// Eliminar una notificación (eliminación lógica)
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const notificacion = await Notification.findById(id);

        if (!notificacion) {
            return res.status(404).json({ mensaje: 'Notificación no encontrada.' });
        }

        if (notificacion.usuario.toString() !== req.user.id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta notificación.' });
        }

        notificacion.eliminado = true;
        await notificacion.save();

        res.json({ mensaje: 'Notificación eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar la notificación' });
    }
});

module.exports = router;

