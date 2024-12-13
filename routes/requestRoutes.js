const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const verifyToken = require("../middlewares/authMiddleware");
const Service = require("../models/Service");
const Request = require("../models/Request");
const router = express.Router();

const upload = multer(); // Configura multer sin almacenamiento porque no se procesarán archivos

// Crear nueva solicitud
router.post("/", verifyToken, upload.none(), async (req, res) => {
    const { servicioId, lugar, presupuesto, descripcion } = req.body; // Cambiado de "descripción" a "descripcion"

    console.log("Cuerpo recibido en el backend:", req.body);

    if (!servicioId || !lugar || !presupuesto || !descripcion) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    try {
        const servicio = await Service.findById(servicioId).populate("proveedor");
        if (!servicio) {
            return res.status(404).json({ mensaje: "El servicio solicitado no existe." });
        }

        // Crear la solicitud
        const nuevaSolicitud = new Request({
            cliente: req.user.id,
            proveedor: servicio.proveedor._id, // Obtenemos el ID del proveedor del servicio
            servicio: servicio._id,
            lugar,
            presupuesto,
            descripcion, // Usar el campo actualizado
        });

        await nuevaSolicitud.save();

        res.status(201).json({ mensaje: "Solicitud creada exitosamente", solicitud: nuevaSolicitud });
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
});

// Añadir lógica para manejar el estado "Reseñada"
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
  
    try {
      const request = await Request.findById(id);
      if (!request) {
        return res.status(404).json({ message: "Solicitud no encontrada." });
      }
  
      // Actualizar estado de la solicitud
      request.estado = estado;
      await request.save();
  
      res.status(200).json({ message: "Estado actualizado correctamente.", request });
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      res.status(500).json({ message: "Error al actualizar la solicitud.", error });
    }
  });
  


// Obtener todas las solicitudes del cliente autenticado
router.get("/", verifyToken, async (req, res) => {
    try {
        const requests = await Request.find({ cliente: req.user.id })
            .populate({
                path: "servicio",
                populate: {
                    path: "proveedor",
                    select: "nombre",
                },
            })
            .populate("cliente", "nombre");
        res.json(requests);
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        res.status(500).json({ mensaje: "Error al obtener solicitudes." });
    }
});

router.get('/provider', verifyToken, async (req, res) => {
    try {
        const requests = await Request.find({ proveedor: req.user.id })
            .populate('cliente', 'nombre correo') // Poblar solo los campos necesarios del cliente
            .populate('servicio', 'nombre precio'); // Poblar también el servicio si es necesario
        res.json(requests);
    } catch (error) {
        console.error("Error al obtener las solicitudes del proveedor:", error);
        res.status(500).json({ mensaje: "Error al obtener las solicitudes del proveedor." });
    }
});


// Obtener detalles de una solicitud específica
router.get("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const solicitud = await Request.findById(id)
            .populate("cliente", "nombre correo")
            .populate({
                path: "servicio",
                populate: {
                    path: "proveedor",
                    select: "nombre",
                },
            });

        if (!solicitud) {
            return res.status(404).json({ mensaje: "Solicitud no encontrada." });
        }

        res.json(solicitud);
    } catch (error) {
        console.error("Error al obtener la solicitud:", error);
        res.status(500).json({ mensaje: "Error al obtener la solicitud." });
    }
});

module.exports = router;
