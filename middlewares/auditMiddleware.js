const AuditLog = require('../models/AuditLog');

const logAudit = async (req, accion, entidad, entidadId, descripcion) => {
    try {
        const log = new AuditLog({
            usuario: req.user.id,
            accion,
            entidad,
            entidadId,
            descripcion,
        });

        await log.save();
    } catch (error) {
        console.error('Error al guardar el log de auditoría:', error);
    }
};

module.exports = logAudit;
