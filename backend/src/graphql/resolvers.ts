import { ClientModel } from '../models/Client';
import { UserModel } from '../models/User';
import jwt from 'jsonwebtoken';
import Sentry from '../instrument';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default {
  Query: {
    clients: async () => await ClientModel.find(),
    client: async (_: any, { clientId }: any) => await ClientModel.findOne({ clientId }),
  },

  Mutation: {
    createClient: async (_: any, { name, clientId }: any) => {
      return await ClientModel.create({
        clientId,
        name,
        user_count: 0,
        active: true,
      });
    },

    // ---------------- loginUser mutation ----------------
    loginUser: async (_: any, args: { clientId: string; username: string; password: string }) => {
      try {
        const { clientId, username, password } = args;

        if (!clientId || !username || !password) {
          throw new Error('Missing fields');
        }

        const user = await UserModel.findOne({ clientId, username });
        if (!user) throw new Error('User not found');

        const valid = await user.comparePassword(password);
        if (!valid) throw new Error('Invalid password');

        const token = jwt.sign(
          {
            userId: user.userId,
            clientId: user.clientId,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return {
          token,
          user: {
            userId: user.userId,
            name: user.name,
            role: user.role,
            clientId: user.clientId,
          },
        };
      } catch (err: any) {
        // Gửi lỗi chi tiết lên Sentry
        Sentry.captureException(err);
        console.error(err);

        // Trả lỗi rõ ràng cho client
        throw new Error(err.message || 'Internal Server Error');
      }
    },
  },
};
