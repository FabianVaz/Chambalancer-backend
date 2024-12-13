const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    lugar: { type: String, required: true },
    imagen: { type: String },
    presupuesto: { type: Number, required: true },
    descripcion: { type: String },
    estado: { 
        type: Number, 
        default: 1, 
        enum: [1, 2, 3, 4, 5, 6, 7], // Se agrega 7 para "Reseñada"
        required: true 
        // 1: Pendiente, 2: Aceptada, 3: Rechazada, 4: Cancelada, 5: Pagada, 6: Completada, 7: Reseñada
    },
    actualizadoPor: { type: String, enum: ['cliente', 'proveedor'], default: 'cliente' },
    fechaCreación: { type: Date, default: Date.now },
    fechaActualización: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);
