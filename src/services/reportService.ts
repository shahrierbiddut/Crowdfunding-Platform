import api from '../lib/axios';

export const reportService = {
  createReport: async (data: any) => {
    const response = await api.post('/api/reports', data);
    return response.data;
  },
  getAllReports: async () => {
    const response = await api.get('/api/reports');
    return response.data;
  },
  updateReportStatus: async (id: string, status: string) => {
    const response = await api.patch(`/api/reports/${id}/status`, { status });
    return response.data;
  }
};
