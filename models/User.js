const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    tipo: { type: String, enum: ['cliente', 'proveedor'], required: true },
    estado: { type: Number, default: 1 },
    fechaRegistro: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
