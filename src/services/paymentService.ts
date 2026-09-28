import api from '../lib/axios';

export const paymentService = {
  createCheckoutSession: async (data: { credits: number, amount: number }) => {
    const response = await api.post('/api/payments/create-checkout-session', data);
    return response.data;
  },
  verifyPayment: async (sessionId: string, dummyCredits?: string | null, dummyAmount?: string | null) => {
    const response = await api.post('/api/payments/verify', { 
      session_id: sessionId,
      dummy_credits: dummyCredits,
      dummy_amount: dummyAmount
    });
    return response.data;
  },
  getMyPayments: async () => {
    const response = await api.get('/api/payments/my');
    return response.data;
  }
};
