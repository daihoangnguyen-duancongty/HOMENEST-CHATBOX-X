import { Request, Response, NextFunction } from "express";
import { ClientModel } from "../models/Client";

export const checkClientActive = async (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.body.client_id || req.body.clientId;
  if (!clientId) return res.status(400).json({ error: "Missing client_id" });

  const client = await ClientModel.findOne({ clientId });
  if (!client) return res.status(404).json({ error: "Client not found" });

  const now = new Date();

  if (!client.active) {
    return res.status(403).json({ error: "Subscription inactive. Please pay to continue." });
  }

  if (client.trial && client.trial_end && now > client.trial_end) {
    // Trial hết hạn → khóa client
    client.active = false;
    client.trial = false;
    await client.save();
    return res.status(403).json({ error: "Trial period expired. Please pay to continue." });
  }

  next();
};
