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

      // Sinh clientId duy nhất bằng UUID
      let newClientId =  nanoid(12);;
let exists = true;

while (exists) {
  newClientId = nanoid(12);
  const found = await ClientModel.findOne({ clientId: newClientId });
  exists = !!found; // <-- convert document | null thành boolean
}

      // Chuyển user_count sang number
      const userCount = Number(data.user_count) || 1;

      // Lấy gói subscription
      const plan = await SubscriptionPlanModel.findById(data.subscription_plan);
      if (!plan) return res.status(400).json({ error: 'Gói subscription không tồn tại' });

      // Tạo client
      const newClient = await ClientModel.create({
        clientId: newClientId, // ← sử dụng UUID
        name: data.name,
        avatar: avatarUrl,
        user_count: userCount,
        ai_provider: data.ai_provider,
        api_keys: data.api_keys,
        meta: data.meta,
        color: data.color,
        subscription_plan: {
          name: plan.name,
          max_users: plan.max_users,
          max_files: plan.max_files,
          price: plan.price,
        },
      });

      // Tạo User client own
      const user = await UserModel.create({
        userId: uuidv4(),
        username: data.username,
        name: data.name,
        password: data.password,
        role: 'client',
        clientId: newClientId, // ← liên kết với clientId mới
        avatar: avatarUrl,
      });

      return res.json({ ok: true, client: newClient, user });
    } catch (err) {
      console.error('Create client error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
  // UPDATE CLIENT
  static async updateClient(req: Request, res: Response) {
    try {
      const data = req.body;
      const file = req.file;

      // 1️⃣ Upload avatar nếu có
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

      // 2️⃣ Lấy subscription plan nếu gửi lên
      let planObj: any = undefined;
      if (data.subscription_plan) {
        const plan = await SubscriptionPlanModel.findById(data.subscription_plan);
        if (!plan) return res.status(400).json({ error: 'Gói subscription không tồn tại' });

        planObj = {
          name: plan.name,
          max_users: plan.max_users,
          max_files: plan.max_files,
          price: plan.price,
        };
      }

      // 3️⃣ Chuyển user_count sang number nếu có
      const userCount = data.user_count ? Number(data.user_count) : undefined;

      // 4️⃣ Build object update cho Client giống createClient
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.color) updateData.color = data.color;
      if (data.meta) updateData.meta = data.meta;
      if (data.ai_provider) updateData.ai_provider = data.ai_provider;
      if (planObj) updateData.subscription_plan = planObj;
      if (avatarUrl) updateData.avatar = avatarUrl;
      if (userCount !== undefined) updateData.user_count = userCount;
      console.log('Update data:', updateData);
      // 5️⃣ Update client
      const client = await ClientModel.findOneAndUpdate(
        { clientId: req.params.clientId },
        updateData,
        { new: true }
      );

      if (!client) return res.status(404).json({ error: 'Client not found' });

      // 6️⃣ Update User tương ứng
      const userUpdateData: any = {};
      if (data.username) userUpdateData.username = data.username;
      if (data.name) userUpdateData.name = data.name;
      if (data.password) userUpdateData.password = data.password;
      if (avatarUrl) userUpdateData.avatar = avatarUrl;

      const userResult = await UserModel.updateOne(
        { clientId: req.params.clientId, role: 'client' },
        { $set: userUpdateData }
      );

      console.log('USER UPDATE RESULT:', userResult);

      return res.json({ ok: true, client });
    } catch (err) {
      console.error('Update client error:', err);
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
