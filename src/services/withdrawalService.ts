import api from '../lib/axios';

export const withdrawalService = {
  createWithdrawal: async (data: any) => {
    const response = await api.post('/api/withdrawals', data);
    return response.data;
  },
  getMyWithdrawals: async () => {
    const response = await api.get('/api/withdrawals/my');
    return response.data;
  }
};
