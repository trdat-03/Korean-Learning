import api from '../api';

export const userService = {
    getAiUsageCount: async (userId: number): Promise<number> => {
        const response = await api.get(`/users/${userId}/ai-usage-count`);
        return response.data;
    }
};
