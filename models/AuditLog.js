const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario que realiza la acción
    accion: { type: String, required: true }, // Acción que se realiza (e.g., "creación", "actualización", "eliminación")
    entidad: { type: String, required: true }, // Entidad sobre la que se actúa (e.g., "Solicitud", "Servicio")
    entidadId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID del objeto afectado
    descripcion: { type: String, required: true }, // Descripción detallada de la acción
    fecha: { type: Date, default: Date.now }, // Fecha y hora en que ocurrió el evento
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
