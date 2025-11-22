import { Request, Response } from 'express';
import { ClientModel } from '../models/Client';
import { UserModel } from '../models/User';
import { ClientLogModel } from '../models/ClientLog';
import { SubscriptionPlanModel } from '../models/SubscriptionPlan';

export default class AdminController {
  // GET ALL CLIENTS
  static async getClients(req: Request, res: Response) {
    try {
      const clients = await ClientModel.find().sort({ created_at: -1 });
      return res.json({ ok: true, clients });
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // GET CLIENT BY ID
  static async getClientById(req: Request, res: Response) {
    try {
      const client = await ClientModel.findOne({ clientId: req.params.clientId });
      if (!client) return res.status(404).json({ error: 'Client not found' });
      return res.json({ ok: true, client });
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // CREATE CLIENT
static async createClient(req: Request, res: Response) {
  try {
    const data = req.body;
console.log("Payload createClient:", data);
    // 1. Tạo client trước
    const newClient = await ClientModel.create({
      clientId: data.clientId,
      name: data.name,
      avatar: data.avatar,    // <--- THÊM DÒNG NÀY
      user_count: data.user_count,
      ai_provider: data.ai_provider,
      api_keys: data.api_keys,
      meta: data.meta,
      color: data.color,
    });


    // 2. Tạo user owner
    const user = await UserModel.create({
      username: data.username,
      name: data.name,
      password: data.password,
      role: "owner",
      clientId: data.clientId,
      avatar: data.avatar,   // <--- THÊM DÒNG NÀY
    });
console.log("nguoi dung da tao:", user);
    return res.json({
      ok: true,
      client: newClient,     // <--- BACKEND MUST RETURN THIS
      user,
    });

  } catch (err) {
    console.error("Create client user error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}


  // UPDATE CLIENT
static async updateClient(req: Request, res: Response) {
  try {
    const updateData = { ...req.body };

    const client = await ClientModel.findOneAndUpdate(
      { clientId: req.params.clientId },
      updateData,
      { new: true }
    );

    if (!client) return res.status(404).json({ error: 'Client not found' });

    return res.json({ ok: true, client });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
  // DELETE CLIENT
  static async deleteClient(req: Request, res: Response) {
    try {
      await ClientModel.deleteOne({ clientId: req.params.clientId });
      return res.json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // SYNC CLIENT (OLD API)
  static async syncClient(req: Request, res: Response) {
    try {
      const { action, client } = req.body;

      if (!action || !client?.clientId)
        return res.status(400).json({ error: 'Missing action or clientId' });

      const defaultTrialEnd = new Date();
      defaultTrialEnd.setMonth(defaultTrialEnd.getMonth() + 2);

      if (action === 'create' || action === 'update') {
        const existing = await ClientModel.findOne({ clientId: client.clientId });

        const trialEnd = client.trial_end ?? existing?.trial_end ?? defaultTrialEnd;

        const doc = await ClientModel.findOneAndUpdate(
          { clientId: client.clientId },
          {
            ...client,
            trial_end: new Date(trialEnd),
            created_at: existing?.created_at ?? new Date(),
          },
          { upsert: true, new: true }
        );

        return res.json({ ok: true, client: doc });
      }

      if (action === 'delete') {
        await ClientModel.deleteOne({ clientId: client.clientId });
        return res.json({ ok: true });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // REACTIVATE CLIENT
  static async reactivateClient(req: Request, res: Response) {
    try {
      const { clientId, extendMonths } = req.body;

      const client = await ClientModel.findOne({ clientId });
      if (!client) return res.status(404).json({ error: 'Client not found' });

      client.active = true;

      if (extendMonths > 0) {
        const time =
          client.trial_end && client.trial_end > new Date()
            ? new Date(client.trial_end)
            : new Date();

        time.setMonth(time.getMonth() + extendMonths);
        client.trial_end = time;
      }

      await client.save();

      await ClientLogModel.create({
        clientId,
        action: 'reactivate',
        description: `Extended ${extendMonths || 0} month(s)`,
      });

      return res.json({ ok: true, client });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
// DEACTIVATE CLIENT
static async deactivateClient(req: Request, res: Response) {
  try {
    const { clientId } = req.body;

    const client = await ClientModel.findOne({ clientId });
    if (!client) return res.status(404).json({ error: 'Client not found' });

    client.active = false;
    await client.save();

    // Tạo log hành động
    await ClientLogModel.create({
      clientId,
      action: 'deactivate',
      description: 'Client has been deactivated',
    });

    return res.json({ ok: true, client });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
  // =========================
  // CRUD Plans
  // =========================
  static async getPlans(req: Request, res: Response) {
    return res.json({ ok: true, plans: await SubscriptionPlanModel.find() });
  }

  static async createPlan(req: Request, res: Response) {
    const plan = await SubscriptionPlanModel.create(req.body);
    return res.json({ ok: true, plan });
  }

  static async updatePlan(req: Request, res: Response) {
    const plan = await SubscriptionPlanModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json({ ok: true, plan });
  }

  static async deletePlan(req: Request, res: Response) {
    await SubscriptionPlanModel.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  }
  // GET DASHBOARD STATS
static async getDashboard(req: Request, res: Response) {
  try {
    const totalClients = await ClientModel.countDocuments();
    const activeClients = await ClientModel.countDocuments({ active: true });
    const trialClients = await ClientModel.countDocuments({ active: true, trial: true });
    const totalUsers = await UserModel.countDocuments();

    return res.json({
      totalClients,
      activeClients,
      trialClients,
      totalUsers,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

}
