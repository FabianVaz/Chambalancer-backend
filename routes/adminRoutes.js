const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Service = require('../models/Service');
const User = require('../models/User');
const Review = require('../models/Review');

router.get('/dashboard', async (req, res) => {
    try {
      // Servicios
      const totalServicios = await Service.countDocuments();
      const serviciosPorCategoria = await Service.aggregate([
        {
          $group: {
            _id: "$categoría", // Utilizando "categoría" con tilde
            total: { $sum: 1 },
          },
        },
      ]);
      const serviciosPorPuntuacion = await Review.aggregate([
        { $group: { _id: "$servicio", total: { $sum: 1 } } },
      ]);
  
      // Reseñas
      const totalReseñas = await Review.countDocuments();
      const reseñasPorProveedor = await Review.aggregate([
        { $group: { _id: "$proveedor", total: { $sum: 1 } } }
      ]);
      const reseñasPorCliente = await Review.aggregate([
        { $group: { _id: "$cliente", total: { $sum: 1 } } }
      ]);
      const reseñasPorServicio = await Review.aggregate([
        { $group: { _id: "$servicio", total: { $sum: 1 } } }
      ]);
      const reseñasPorPuntuacion = await Review.aggregate([
        { $group: { _id: "$puntuacion", total: { $sum: 1 } } }
      ]);
  
      // Contrataciones
      const totalContrataciones = await Request.countDocuments();
      const contratacionesPorProveedor = await Request.aggregate([
        { $group: { _id: "$proveedor", total: { $sum: 1 } } }
      ]);
  
      // Usuarios
      const totalUsuarios = await User.countDocuments();
      const usuariosPorTipo = await User.aggregate([
        { $group: { _id: "$tipo", total: { $sum: 1 } } }
      ]);
      const usuariosPorMes = await User.aggregate([
        {
          $group: {
            _id: { $month: "$fechaRegistro" }, // Suponiendo que el modelo tiene un campo `fechaRegistro`
            total: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
  
      res.json({
        servicios: { total: totalServicios, porCategoria: serviciosPorCategoria, porPuntuacion: serviciosPorPuntuacion },
        reseñas: { total: totalReseñas, porProveedor: reseñasPorProveedor, porCliente: reseñasPorCliente, porServicio: reseñasPorServicio, porPuntuacion: reseñasPorPuntuacion },
        contrataciones: { total: totalContrataciones, porProveedor: contratacionesPorProveedor },
        usuarios: { total: totalUsuarios, porTipo: usuariosPorTipo, porMes: usuariosPorMes },
      });
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);
      res.status(500).json({ message: "Error al obtener datos del dashboard" });
    }
  });
  
module.exports = router;
