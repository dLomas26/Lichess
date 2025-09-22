import axios from 'axios';

const BASE_URL = 'https://lichess.org/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

export const lichessApi = {
  // Get user profile
  async getUser(username) {
    const response = await api.get(`/user/${username}`);
    return response.data;
  },

  // Get leaderboard for a specific variant
  async getLeaderboard(variant, count = 50) {
    const response = await api.get(`/player/top/${count}/${variant}`);
    return response.data.users || [];
  },

  // Get arena tournaments
  async getArenatournaments() {
    const response = await api.get('/tournament');
    return response.data.created || [];
  },

  // Get user's tournament history
  async getUserTournaments(username) {
    try {
      const response = await api.get(`/user/${username}/tournament/created`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user tournaments:', error);
      return [];
    }
  },
};