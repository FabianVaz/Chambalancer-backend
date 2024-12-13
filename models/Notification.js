const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mensaje: { type: String, required: true },
    tipo: { 
        type: String, 
        enum: ['cliente', 'proveedor'], 
        required: true 
    },
    categoria: { 
        type: String, 
        enum: ['solicitud_creada', 'solicitud_actualizada', 'pago_realizado', 'servicio_completado'], 
        required: true 
    },
    leido: { type: Boolean, default: false },
    eliminado: { type: Boolean, default: false }, // Nuevo campo para manejar eliminación lógica
    fechaCreación: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
