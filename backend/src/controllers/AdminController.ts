import { Request, Response } from "express";
import { ClientModel } from "../models/Client";
import { ClientLogModel } from "../models/ClientLog";



export default class AdminController {
  static async syncClient(req: Request, res: Response) {
    try {
      const { action, client } = req.body as { action: string; client: any };

      if (!action || !client?.clientId) {
        return res.status(400).json({ error: "Missing action or clientId" });
      }

      // Tính thời gian trial_end mặc định (2 tháng từ hiện tại nếu cần)
      const defaultTrialEnd = new Date();
      defaultTrialEnd.setMonth(defaultTrialEnd.getMonth() + 2);

      if (action === "create" || action === "update") {
        const existingClient = await ClientModel.findOne({ clientId: client.clientId });

        // Nếu client tồn tại và đang active=false nhưng họ vừa đóng phí → mở lại
        const active = client.active ?? existingClient?.active ?? true;

        // Nếu client không có trial_end hoặc muốn reset trial → dùng defaultTrialEnd
        const trialEnd = client.trial_end
          ? new Date(client.trial_end)
          : existingClient?.trial_end
          ? existingClient.trial_end
          : defaultTrialEnd;

        const doc = await ClientModel.findOneAndUpdate(
          { clientId: client.clientId },
          {
            clientId: client.clientId,
            name: client.name ?? existingClient?.name ?? "",
            domain: client.domain ?? existingClient?.domain ?? null,
            color: client.color ?? existingClient?.color ?? "#0b74ff",
            welcome_message: client.welcome_message ?? existingClient?.welcome_message ?? "",
            ai_provider: client.ai_provider ?? existingClient?.ai_provider ?? "openai",
            meta: client.meta ?? existingClient?.meta ?? {},
            api_keys: {
              openai: client.api_keys?.openai ?? existingClient?.api_keys?.openai,
              claude: client.api_keys?.claude ?? existingClient?.api_keys?.claude,
              gemini: client.api_keys?.gemini ?? existingClient?.api_keys?.gemini,
            },
            active,
            trial: client.trial ?? existingClient?.trial ?? true,
            trial_end: trialEnd,
            created_at: existingClient?.created_at ?? new Date(),
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.json({ ok: true, client: doc });
      } else if (action === "delete") {
        await ClientModel.deleteOne({ clientId: client.clientId });
        return res.json({ ok: true });
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }
}
// tu dong mo lai khi dong phi day du
export const reactivateClient = async (req: Request, res: Response) => {
  try {
    const { clientId, extendMonths } = req.body as { clientId: string; extendMonths?: number };

    if (!clientId) return res.status(400).json({ error: "Missing clientId" });

    const client = await ClientModel.findOne({ clientId });
    if (!client) return res.status(404).json({ error: "Client not found" });

    // Mở lại client
    client.active = true;

    // Nếu muốn kéo dài trial hoặc subscription
    if (extendMonths && extendMonths > 0) {
      const newTrialEnd = client.trial_end && client.trial_end > new Date()
        ? new Date(client.trial_end)
        : new Date();

      newTrialEnd.setMonth(newTrialEnd.getMonth() + extendMonths);
      client.trial_end = newTrialEnd;
      client.trial = true;
    }

    await client.save();

    // Ghi log
    await ClientLogModel.create({
      clientId,
      action: "reactivate",
      description: `Client reactivated${extendMonths ? `, extended trial ${extendMonths} month(s)` : ""}`,
    });

    return res.json({ ok: true, client });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};