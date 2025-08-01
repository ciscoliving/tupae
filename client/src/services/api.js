const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeAuthToken();
    }
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async forgotPassword(email) {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return await this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadProfileImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = this.getAuthToken();
    const response = await fetch(`${this.baseURL}/users/profile-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }

    return await response.json();
  }

  async updatePreferences(preferences) {
    return await this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async getUserStats() {
    return await this.request('/users/stats');
  }

  // Social media endpoints
  async getSocialMediaAccounts() {
    return await this.request('/users/social-media');
  }

  async connectSocialMediaAccount(platformData) {
    return await this.request('/users/social-media/connect', {
      method: 'POST',
      body: JSON.stringify(platformData),
    });
  }

  async disconnectSocialMediaAccount(platform, accountId) {
    return await this.request(`/users/social-media/${platform}/${accountId}`, {
      method: 'DELETE',
    });
  }

  async getAvailablePlatforms() {
    return await this.request('/social-media/platforms');
  }

  async getPlatformAccounts(platform) {
    return await this.request(`/social-media/${platform}/accounts`);
  }

  async getPlatformAnalytics(platform, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/social-media/${platform}/analytics?${queryString}`);
  }

  async getPlatformInsights(platform) {
    return await this.request(`/social-media/${platform}/insights`);
  }

  async syncAllAccounts() {
    return await this.request('/social-media/sync-all', {
      method: 'POST',
    });
  }

  // Posts endpoints
  async createPost(postData) {
    return await this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/posts?${queryString}`);
  }

  async getPost(postId) {
    return await this.request(`/posts/${postId}`);
  }

  async updatePost(postId, postData) {
    return await this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId) {
    return await this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async publishPost(postId) {
    return await this.request(`/posts/${postId}/publish`, {
      method: 'POST',
    });
  }

  async schedulePost(postId, scheduledFor) {
    return await this.request(`/posts/${postId}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ scheduledFor }),
    });
  }

  async uploadPostMedia(postId, mediaFiles) {
    const formData = new FormData();
    mediaFiles.forEach((file, index) => {
      formData.append('media', file);
      if (file.altText) {
        formData.append(`altText[${index}]`, file.altText);
      }
    });

    const token = this.getAuthToken();
    const response = await fetch(`${this.baseURL}/posts/${postId}/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload media');
    }

    return await response.json();
  }

  async getPostStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/posts/stats/overview?${queryString}`);
  }

  // Analytics endpoints
  async getAnalyticsOverview(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/overview?${queryString}`);
  }

  async getPlatformAnalyticsData(platform, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/platform/${platform}?${queryString}`);
  }

  async getPostsAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/posts?${queryString}`);
  }

  async getEngagementAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/engagement?${queryString}`);
  }

  async getDemographicsAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/demographics?${queryString}`);
  }

  async getBestTimesAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/best-times?${queryString}`);
  }

  async getHashtagAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/hashtags?${queryString}`);
  }

  async syncAnalytics(platform, accountId) {
    return await this.request('/analytics/sync', {
      method: 'POST',
      body: JSON.stringify({ platform, accountId }),
    });
  }

  async exportAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const token = this.getAuthToken();
    
    const response = await fetch(`${this.baseURL}/analytics/export?${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export analytics');
    }

    return await response.blob();
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 