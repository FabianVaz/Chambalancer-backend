const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripción: { type: String, required: true },
    categoría: {
        type: String,
        enum: ['carpintería', 'fontanería', 'reparación de electrodomésticos', 'construcción'],
        required: true
    },
    precio: { type: Number, required: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    estado: { type: Number, default: 1 },
    fechaCreación: { type: Date, default: Date.now },
    ubicacion: { type: String, required: true }, // Nuevo campo para la ubicación
    imagen: { type: String }, // URL de la imagen
});

module.exports = mongoose.model('Service', serviceSchema);
