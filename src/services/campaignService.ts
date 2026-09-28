import api from '../lib/axios';

export const campaignService = {
  getAllCampaigns: async (query?: string) => {
    const url = query ? `/api/campaigns?${query}` : '/api/campaigns';
    const response = await api.get(url);
    return response.data;
  },
  getCampaignById: async (id: string) => {
    const response = await api.get(`/api/campaigns/${id}`);
    return response.data;
  },
  createCampaign: async (data: any) => {
    const response = await api.post('/api/campaigns', data);
    return response.data;
  },
  getMyCampaigns: async () => {
    const response = await api.get('/api/campaigns/my');
    return response.data;
  },
  updateCampaign: async (id: string, data: any) => {
    const response = await api.put(`/api/campaigns/${id}`, data);
    return response.data;
  },
  deleteCampaign: async (id: string) => {
    const response = await api.delete(`/api/campaigns/${id}`);
    return response.data;
  }
};
