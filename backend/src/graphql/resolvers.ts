import { ClientModel } from '../models/Client';

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
  },
};
