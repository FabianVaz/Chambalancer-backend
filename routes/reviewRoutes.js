const express = require("express");
const multer = require("multer");
const path = require("path");
const Review = require("../models/Review"); // Importa el modelo de reseñas
const Request = require("../models/Request"); // Importa el modelo de solicitudes

const router = express.Router();

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Ruta para crear una nueva reseña
router.post("/", upload.single("imagen"), async (req, res) => {
  const { titulo, puntuacion, descripcion, requestId } = req.body;

  // Verificar campos requeridos
  if (!titulo || !puntuacion || !descripcion || !requestId) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    // Buscar la solicitud relacionada
    const solicitud = await Request.findById(requestId).populate("servicio");
    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada." });
    }

    // Crear la nueva reseña
    const nuevaResena = new Review({
      titulo,
      puntuacion,
      descripcion,
      cliente: solicitud.cliente, // Asociar la reseña al cliente de la solicitud
      proveedor: solicitud.proveedor, // Asociar la reseña al proveedor de la solicitud
      servicio: solicitud.servicio._id, // Asociar el servicio de la solicitud
      solicitud: requestId, // Asociar la solicitud
      imagen: req.file ? `/uploads/${req.file.filename}` : null, // Ruta de la imagen subida
    });

    await nuevaResena.save();

    // Actualizar el estado de la solicitud a "Reseñada" (estado 7)
    solicitud.estado = 7;
    await solicitud.save();

    res.status(201).json({ message: "Reseña creada exitosamente.", review: nuevaResena });
  } catch (error) {
    console.error("Error al crear la reseña:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});


router.get("/", async (req, res) => {
  const { clientId } = req.query;

  if (!clientId) {
    return res.status(400).json({ message: "El ID del cliente es requerido." });
  }

  try {
    const reviews = await Review.find({ cliente: clientId }).populate("servicio");
    res.json(reviews);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas." });
  }
});
// Exportar el router
module.exports = router;

