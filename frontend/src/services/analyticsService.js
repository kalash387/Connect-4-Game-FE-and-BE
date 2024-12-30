import axios from 'axios';

const API_URL = 'https://hvxjh08ix2.execute-api.us-east-2.amazonaws.com/dev/analytics';

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