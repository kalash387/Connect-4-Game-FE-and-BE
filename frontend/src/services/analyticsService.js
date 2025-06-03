import axios from 'axios';

const API_URL = 'https://process-analytics-solitary-glitter-85ea.kalashrami387.workers.dev/';

export const getGameAnalytics = async (gameData) => {
    try {
        console.log('Sending request to:', API_URL);
        const response = await axios.post(API_URL, gameData);
        console.log('Analytics response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting game analytics:', error);
        throw error;
    }
}; 