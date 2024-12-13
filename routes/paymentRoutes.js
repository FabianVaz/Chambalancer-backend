const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");


router.post("/process_payment", async (req, res) => {
  const { token, transaction_amount, installments, payment_method_id, payer } = req.body;

  const idempotencyKey = uuidv4();

  try {
    // Solicitud a Mercado Pago
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        token,
        transaction_amount,
        installments,
        payment_method_id,
        payer,
        three_d_secure_mode: "optional", // Habilita 3DS
      }),
    });

    const payment = await response.json();

    // Si el pago es aprobado
    if (payment.status === "approved") {
      console.log("Pago aprobado:", payment);
      return res.status(200).json({
        message: "¡Pago aprobado!",
        paymentId: payment.id,
        status: payment.status,
      });
    }

    // Si el pago requiere un Challenge
    if (payment.status === "pending" && payment.status_detail === "pending_challenge") {
      console.log("Se requiere Challenge:", payment.three_ds_info);
      return res.status(200).json({
        message: "Challenge requerido.",
        three_ds_info: payment.three_ds_info,
        paymentId: payment.id,
      });
    }

    // Otros casos (sin mensaje adicional)
    console.log("Estado del pago:", payment.status_detail);
    return res.status(200).json({ status: payment.status, status_detail: payment.status_detail });
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    res.status(500).json({
      message: "Error interno al procesar el pago.",
      details: error.message,
    });
  }
});

module.exports = router;
