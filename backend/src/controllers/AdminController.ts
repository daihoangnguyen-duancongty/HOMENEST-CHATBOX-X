import { Request, Response } from 'express';
import { ClientModel } from '../models/Client';
import { UserModel } from '../models/User';
import { ClientLogModel } from '../models/ClientLog';
import { SubscriptionPlanModel } from '../models/SubscriptionPlan';
import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

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
    const file = req.file;

    // Upload avatar nếu có
    let avatarUrl = '';
    if (file) {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'homenest/homenest-chatbotx-client' },
          (error, result) => (error ? reject(error) : resolve(result!))
        );
        stream.end(file.buffer);
      });
      avatarUrl = result.secure_url;
    }

    // Check username duy nhất
    const checkUser = await UserModel.findOne({ username: data.username });
    if (checkUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Sinh clientId
    let newClientId = nanoid(12);
    while (await ClientModel.findOne({ clientId: newClientId })) {
      newClientId = nanoid(12);
    }

    // Parse
    const apiKeys = typeof data.api_keys === "string" ? JSON.parse(data.api_keys) : data.api_keys;
    const meta = typeof data.meta === "string" ? JSON.parse(data.meta) : data.meta;

    const userCount = Number(data.user_count) || 1;

    const plan = await SubscriptionPlanModel.findById(data.subscription_plan);
    if (!plan) return res.status(400).json({ error: "Gói subscription không tồn tại" });

    // Tạo client
    const newClient = await ClientModel.create({
      clientId: newClientId,
      name: data.name,
      domain: data.domain,
      avatar: avatarUrl,
      color: data.color,
      ai_provider: data.ai_provider,
      welcome_message: data.welcome_message,
      api_keys: apiKeys,
      meta: meta,
      user_count: userCount,

      // GIỮ ĐÚNG THEO SCHEMA — EMBED
      subscription_plan: {
        name: plan.name,
        max_users: plan.max_users,
        max_files: plan.max_files,
        price: plan.price,
      },
    });

    // Tạo user owner
    const user = await UserModel.create({
      userId: uuidv4(),
      username: data.username,
      name: data.name,
      password: data.password,
      role: "client",
      clientId: newClientId,
      avatar: avatarUrl,
    });

    return res.json({ ok: true, client: newClient, user });

  } catch (err) {
    console.error("Create client error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

  // UPDATE CLIENT
 static async updateClient(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId;
    const data = req.body;
    const file = req.file;

    const client = await ClientModel.findOne({ clientId });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Upload avatar nếu có
    if (file) {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "homenest/homenest-chatbotx-client" },
          (error, result) => (error ? reject(error) : resolve(result!))
        );
        stream.end(file.buffer);
      });
      client.avatar = result.secure_url;
    }

    // Update các field nếu có
    if (data.name) client.name = data.name;
    if (data.domain) client.domain = data.domain;
    if (data.color) client.color = data.color;
    if (data.ai_provider) client.ai_provider = data.ai_provider;
    if (data.welcome_message) client.welcome_message = data.welcome_message;

    // api_keys
    if (data.api_keys) {
      let apiKeys = data.api_keys;
      if (typeof apiKeys === "string") {
        try {
          apiKeys = JSON.parse(apiKeys);
        } catch {
          return res.status(400).json({ error: "api_keys invalid JSON" });
        }
      }
      client.api_keys = apiKeys;
    }

    // meta
    if (data.meta) {
      let meta = data.meta;
      if (typeof meta === "string") {
        try {
          meta = JSON.parse(meta);
        } catch {
          return res.status(400).json({ error: "meta invalid JSON" });
        }
      }

      // MERGE META – không xoá dữ liệu cũ
      client.meta = {
        ...client.meta,
        ...meta,
      };
    }

    // user_count
    if (data.user_count) {
      const count = Number(data.user_count);
      if (!isNaN(count)) client.user_count = count;
    }

    // Update subscription plan (EMBED)
    if (data.subscription_plan) {
      const plan = await SubscriptionPlanModel.findById(data.subscription_plan);
      if (!plan) return res.status(400).json({ error: "Subscription plan not found" });

      client.subscription_plan = {
        name: plan.name,
        max_users: plan.max_users,
        max_files: plan.max_files,
        price: plan.price,
      };
    }

    await client.save();

    return res.json({
      ok: true,
      message: "Client updated successfully",
      client,
    });

  } catch (err) {
    console.error("Update client error:", err);
    return res.status(500).json({ error: "Server error" });
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
