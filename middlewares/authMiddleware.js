const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = verified; // Agregar los datos del usuario al objeto `req`
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token inválido' });
    }
};

module.exports = verifyToken;
