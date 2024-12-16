const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const Request = require("../models/Request"); // Asegúrate de importar el modelo correcto

// Configurar tu secreto de Webhook
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/",
  express.raw({ type: "application/json" }), // Necesario para verificar la firma del webhook
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Error verificando el webhook:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar el evento checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Obtener el requestId de la metadata del session
      const requestId = session.metadata.requestId;
      console.log(requestId);

      try {
        // Actualizar la solicitud en la base de datos
        await Request.findByIdAndUpdate(requestId, { estado: 5 }); // 5 = Estado "Pagada"
        console.log(`Solicitud ${requestId} actualizada a "Pagada"`);
      } catch (error) {
        console.error("Error al actualizar el estado de la solicitud:", error.message);
      }
    }

    res.status(200).send("Evento recibido y procesado correctamente");
  }
);

module.exports = router;
