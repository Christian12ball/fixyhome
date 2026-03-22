// Configuration de l'API pour la connexion avec Spring Boot
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'CLIENT' | 'ARTISAN';
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: 'PLUMBING' | 'ELECTRICITY' | 'CLEANING';
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';
  clientId: string;
  artisanId?: string;
  location: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Artisan {
  id: string;
  user: User;
  category: 'PLUMBING' | 'ELECTRICITY' | 'CLEANING';
  description: string;
  experience: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  hourlyRate?: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  clientId: string;
  artisanId: string;
  serviceRequestId: string;
  createdAt: string;
}

// Fonctions API pour l'authentification
export const authAPI = {
  async login(email: string, password: string) {
    console.log('Tentative de connexion pour:', email);
    console.log('URL de l\'API:', `${API_BASE_URL}/auth/login`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Login failed');
      }
      
      const data = await response.json();
      console.log('Login response:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    userType: 'CLIENT' | 'ARTISAN';
    category?: string;
    description?: string;
    experience?: number;
    hourlyRate?: number;
  }) {
    console.log('Tentative d\'inscription pour:', userData.email);
    console.log('URL de l\'API:', `${API_BASE_URL}/auth/register`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Registration failed');
      }
      
      const data = await response.json();
      console.log('Registration response:', data);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async logout(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.ok;
  },
};

// Fonctions API pour les services
export const servicesAPI = {
  async getServiceRequests(token: string) {
    const response = await fetch(`${API_BASE_URL}/services/requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch service requests');
    }
    
    return response.json();
  },

  async createServiceRequest(token: string, requestData: Omit<ServiceRequest, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>) {
    const response = await fetch(`${API_BASE_URL}/services/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create service request');
    }
    
    return response.json();
  },

  async updateServiceRequest(token: string, id: string, updates: Partial<ServiceRequest>) {
    const response = await fetch(`${API_BASE_URL}/services/requests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update service request');
    }
    
    return response.json();
  },
};

// Fonctions API pour les artisans
export const artisansAPI = {
  async getArtisans(category?: string, location?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    
    const response = await fetch(`${API_BASE_URL}/artisans?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch artisans');
    }
    
    return response.json();
  },

  async getArtisanById(id: string) {
    const response = await fetch(`${API_BASE_URL}/artisans/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch artisan');
    }
    
    return response.json();
  },

  async getArtisanReviews(id: string) {
    const response = await fetch(`${API_BASE_URL}/artisans/${id}/reviews`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch artisan reviews');
    }
    
    return response.json();
  },

  async createReview(token: string, reviewData: Omit<Review, 'id' | 'createdAt'>) {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create review');
    }
    
    return response.json();
  },
};

// Fonctions API pour le profil utilisateur
export const profileAPI = {
  async getProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  async updateProfile(token: string, updates: Partial<User>) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json();
  },
};

// Helper pour gérer les tokens d'authentification
export const tokenManager = {
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
