const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const { requestId, servicio } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: servicio.nombre,
              description: servicio.descripcion,
            },
            unit_amount: servicio.precio * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/my-request`,
      cancel_url: `${process.env.CLIENT_URL}/my-requests`,
      metadata: { requestId }, // Incluye el ID de la solicitud como metadata
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error al crear sesión de Stripe:", error.message);
    res.status(500).send("Error al procesar el pago");
  }
});

module.exports = router;
