import api from '../lib/axios';

export const contributionService = {
  createContribution: async (data: { campaignId: string, amount: number }) => {
    const response = await api.post('/api/contributions', data);
    return response.data;
  },
  getMyContributions: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/contributions/my?page=${page}&limit=${limit}`);
    return response.data;
  },
  getCreatorContributions: async () => {
    const response = await api.get('/api/contributions/creator');
    return response.data;
  },
  updateContributionStatus: async (id: string, status: string) => {
    const response = await api.patch(`/api/contributions/${id}/status`, { status });
    return response.data;
  }
};
