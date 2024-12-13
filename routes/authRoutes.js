const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middlewares/authMiddleware');
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage });

  router.post("/upload", upload.single("image"), (req, res) => {
    try {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Error al cargar la imagen.", error });
    }
  });
  

// Registro de usuario
router.post('/register', async (req, res) => {
    const { nombre, correo, contraseña, tipo } = req.body;

    try {
        const existeUsuario = await User.findOne({ correo });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const contraseñaHash = await bcrypt.hash(contraseña, salt);

        const nuevoUsuario = new User({
            nombre,
            correo,
            contraseña: contraseñaHash,
            tipo,
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const usuario = await User.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
        }

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
        }

        const token = jwt.sign({ id: usuario._id, tipo: usuario.tipo }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, tipo: usuario.tipo } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('nombre correo');
        res.json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ mensaje: 'Error al obtener datos del usuario' });
    }
});


module.exports = router; // Exportar correctamente el router

