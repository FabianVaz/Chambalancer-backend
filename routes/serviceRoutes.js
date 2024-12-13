const express = require('express');
const Service = require('../models/Service');
const logAudit = require('../middlewares/auditMiddleware');
const verifyToken = require('../middlewares/authMiddleware');
const Review = require("../models/Review");



const router = express.Router();

// Crear un nuevo servicio
router.post('/', verifyToken, async (req, res) => {
    const { nombre, descripción, categoría, precio, ubicacion } = req.body;

    try {
        // Validación de datos
        if (!nombre || !descripción || !categoría || !precio || !ubicacion) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        // Crear el servicio
        const nuevoServicio = new Service({
            proveedor: req.user.id,
            nombre,
            descripción,
            categoría,
            precio,
            ubicacion, // Incluye el campo de ubicación
        });

        await nuevoServicio.save();

        res.status(201).json({ mensaje: 'Servicio creado exitosamente', servicio: nuevoServicio });
    } catch (error) {
        console.error('Error al crear el servicio:', error);
        res.status(500).json({ mensaje: 'Error al crear el servicio' });
    }
});

// Obtener los servicios de un proveedor
router.get('/my-services', verifyToken, async (req, res) => {
    try {
        const services = await Service.find({ proveedor: req.user.id });
        res.json(services);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ mensaje: 'Error al obtener servicios' });
    }
});


// Obtener todos los servicios
router.get('/', async (req, res) => {
    try {
        const servicios = await Service.find()
            .populate('proveedor', 'nombre'); // Incluye el campo 'nombre' del modelo User
        res.status(200).json(servicios);
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
        res.status(500).json({ mensaje: 'Error al obtener los servicios' });
    }
});

// Actualizar un servicio
router.put('/:id', verifyToken, async (req, res) => {
    const { nombre, categoria, precio, descripción, ubicación } = req.body; // Agregar descripción y ubicación
    const { id } = req.params;

    try {
        const servicio = await Service.findById(id);

        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado' });
        }

        if (servicio.proveedor.toString() !== req.user.id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para actualizar este servicio' });
        }

        // Actualizar todos los campos editables
        servicio.nombre = nombre || servicio.nombre;
        servicio.categoria = categoria || servicio.categoria;
        servicio.precio = precio || servicio.precio;
        servicio.descripción = descripción || servicio.descripción; // Actualizar descripción
        servicio.ubicacion = ubicación || servicio.ubicacion; // Actualizar ubicación

        await servicio.save();

        // Registrar en los logs de auditoría
        await logAudit(req, 'actualización', 'Servicio', servicio._id, `Servicio '${nombre}' actualizado.`);

        res.json({ mensaje: 'Servicio actualizado exitosamente', servicio });
    } catch (error) {
        console.error("Error al actualizar el servicio:", error);
        res.status(500).json({ mensaje: 'Error al actualizar el servicio' });
    }
});


// Ruta para obtener los detalles del servicio
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('proveedor', 'nombre correo');
        if (!service) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado' });
        }
        res.json(service);
    } catch (error) {
        console.error('Error al obtener los detalles del servicio:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// Eliminar un servicio
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el servicio por ID
        const servicio = await Service.findById(id);

        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado' });
        }

        // Verificar si el usuario es el proveedor del servicio
        if (servicio.proveedor.toString() !== req.user.id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este servicio' });
        }

        // Eliminar el servicio
        await Service.deleteOne({ _id: id });

        // (Opcional) Eliminar las reseñas asociadas al servicio
        await Review.deleteMany({ servicio: id });

        // Registrar la eliminación en los logs de auditoría
        if (typeof logAudit === "function") {
            await logAudit(req, 'eliminación', 'Servicio', servicio._id, `Servicio '${servicio.nombre}' eliminado.`);
        }

        res.json({ mensaje: 'Servicio eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        res.status(500).json({ mensaje: 'Error al eliminar el servicio' });
    }
});


router.get("/:serviceId/reviews", async (req, res) => {
  const { serviceId } = req.params;

  try {
    const reviews = await Review.find({ servicio: serviceId }).populate("cliente", "nombre");
    res.json(reviews);
  } catch (error) {
    console.error("Error al obtener las reseñas del servicio:", error);
    res.status(500).json({ message: "Error al obtener las reseñas del servicio." });
  }
});
  


module.exports = router;
