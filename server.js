const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { MercadoPagoConfig } = require("mercadopago");


// Importar rutas
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const requestRoutes = require("./routes/requestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require('./routes/reviewRoutes');
const path = require("path"); // Importa el módulo path
const adminRoutes = require('./routes/adminRoutes');


// Configuración de variables de entorno
dotenv.config();

// Conexión a la base de datos
connectDB();

// Inicialización de la aplicación
const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para permitir solicitudes desde otros orígenes
app.use(express.json()); // Middleware para procesar JSON
app.use(express.urlencoded({ extended: true })); // Middleware para datos codificados en formularios

// Configuración de Mercado Pago

new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });

// Rutas de la API
app.use("/api/auth", authRoutes); // Rutas de autenticación
app.use("/api/services", serviceRoutes); // Rutas de servicios
app.use("/api/requests", requestRoutes); // Rutas de solicitudes
app.use("/api/notifications", notificationRoutes); // Rutas de notificaciones
app.use("/api/payments", paymentRoutes); // Rutas de pagos
app.use('/api/reviews', reviewRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/admin', adminRoutes);


// Ruta principal de prueba
app.get("/", (req, res) => {
  res.send("Chambalancer API funcionando correctamente");
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ mensaje: "Error interno del servidor" });
});

// Inicialización del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
