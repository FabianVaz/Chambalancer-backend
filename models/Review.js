const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    puntuacion: { type: Number, required: true },
    descripcion: { type: String, required: true }, // Cambiar de `texto` a `descripcion`
    imagen: { type: String },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    servicio: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);

