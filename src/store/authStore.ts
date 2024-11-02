import { create } from 'zustand';
import type { AuthState, User } from '../types/auth';

// In a real app, these would be API calls
const mockAuth = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@example.com' && password === 'demo') {
    return {
      id: '1',
      email,
      name: 'Demo User',
      role: 'admin'
    };
  }
  throw new Error('Invalid credentials');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const user = await mockAuth(email, password);
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  signup: async (email: string, password: string, name: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user: User = { id: crypto.randomUUID(), email, name, role: 'user' };
    set({ user, isAuthenticated: true });
  },

  resetPassword: async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would trigger a password reset email
    console.log('Password reset email sent to:', email);
  },
}))