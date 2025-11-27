import { Router } from "express";
import { ClientModel } from "../models/Client";
import { CustomerModel } from "../models/Customer";
import crypto from "crypto";

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
//

/** Tạo client mới khi plugin WP gọi */
router.post("/register-wp-site", async (req, res) => {
  try {
    const { domain, email } = req.body;
    if (!domain || !email)
      return res.status(400).json({ error: "Missing domain or email" });

    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    let client = await ClientModel.findOne({ domain: cleanDomain });
    if (!client) {
      const clientId = crypto.randomBytes(6).toString("hex");
      const apiKey = crypto.randomBytes(16).toString("hex");

      client = new ClientModel({
        clientId,
        api_keys: apiKey,  // <- đổi apiKey thành api_keys
        domain: cleanDomain,
        user_email: email,
      });
      await client.save();
    }

    // Trả về tên property frontend dễ dùng
    res.json({ clientId: client.clientId, apiKey: client.api_keys });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "Server error", detail: message });
  }
});
export default router;
