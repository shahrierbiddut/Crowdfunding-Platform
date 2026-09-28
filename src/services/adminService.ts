import api from '../lib/axios';

export const adminService = {
  // Users
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },
  updateUserRole: async (id: string, role: string) => {
    const response = await api.patch(`/api/users/${id}/role`, { role });
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  // Campaigns
  getAllCampaigns: async () => {
    // Admin gets all campaigns, regardless of status
    const response = await api.get('/api/campaigns');
    return response.data;
  },
  updateCampaignStatus: async (id: string, status: string) => {
    const response = await api.patch(`/api/campaigns/${id}/status`, { status });
    return response.data;
  },

  // Withdrawals
  getAllWithdrawals: async () => {
    const response = await api.get('/api/withdrawals');
    return response.data;
  },
  updateWithdrawalStatus: async (id: string, status: string) => {
    const response = await api.patch(`/api/withdrawals/${id}/status`, { status });
    return response.data;
  }
};
