import { Router } from "express";
import { ClientModel } from "../models/Client";
import { CustomerModel } from "../models/Customer";

const router = Router();

/** Public API → cho ChatWidget */
router.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const client = await ClientModel.findOne(
      { clientId },
      "clientId name color avatar logo_url welcome_message"  // chỉ field an toàn
    );

    if (!client) return res.status(404).json({ error: "Client not found" });

    res.json(client);
  } catch (err) {
     const message = err instanceof Error ? err.message : String(err);
  res.status(500).json({ error: "Server error", detail: message });
  }
});
// lay danh sach customer
router.get("/customers/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const customers = await CustomerModel.find({ clientId });
  res.json({ customers });
});

export default router;
