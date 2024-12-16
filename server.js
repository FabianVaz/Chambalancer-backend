const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // Módulo para manejar rutas
const connectDB = require("./config/db");

// Configuración de variables de entorno
dotenv.config();

// Importar rutas
const stripeRoutes = require("./routes/stripeRoutes");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const requestRoutes = require("./routes/requestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const webhookRoutes = require("./routes/webhookRoutes");


// Conexión a la base de datos
connectDB();

// Inicialización de la aplicación
const app = express();

app.use("/api/webhook", webhookRoutes);
;

// Middlewares
app.use(cors()); // Habilita CORS para solicitudes desde otros dominios
app.use(express.json()); // Middleware para manejar JSON
app.use(express.urlencoded({ extended: true })); // Middleware para manejar formularios codificados
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Servir archivos estáticos

// Rutas de la API
app.use("/api/auth", authRoutes); // Rutas de autenticación
app.use("/api/services", serviceRoutes); // Rutas de servicios
app.use("/api/requests", requestRoutes); // Rutas de solicitudes
app.use("/api/notifications", notificationRoutes); // Rutas de notificaciones
app.use("/api/reviews", reviewRoutes); // Rutas de reseñas
app.use("/api/admin", adminRoutes); // Rutas de administrador
app.use("/api/stripe", stripeRoutes); // Rutas de Stripe



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
