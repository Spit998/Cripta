import { User } from '../types';
import { settingsService } from './settingsService';
import { tradingService } from './tradingService';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  password: string;
  createdAt: string;
  isVerified: boolean;
  balance: number;
  isActive: boolean;
}

class AuthService {
  private users: UserData[] = [
    {
      id: '1',
      email: 'admin@crypto.com',
      name: 'Admin User',
      role: 'admin',
      password: 'admin123',
      createdAt: new Date().toISOString(),
      isVerified: true,
      balance: 50000,
      isActive: true,
    },
    {
      id: '2',
      email: 'user@crypto.com',
      name: 'Regular User',
      role: 'user',
      password: 'user123',
      createdAt: new Date().toISOString(),
      isVerified: true,
      balance: 10000,
      isActive: true,
    },
  ];

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    const saved = localStorage.getItem('platform_users');
    if (saved) {
      this.users = JSON.parse(saved);
    }
  }

  private saveUsers() {
    localStorage.setItem('platform_users', JSON.stringify(this.users));
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (settingsService.isMaintenanceMode()) {
      throw new Error('Platform is under maintenance');
    }

    const userData = this.users.find(u => u.email === email && u.password === password);
    
    if (!userData) {
      throw new Error('Invalid credentials');
    }

    if (!userData.isActive) {
      throw new Error('Account is suspended');
    }

    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: new Date(userData.createdAt),
      isVerified: userData.isVerified,
    };

    const token = `token-${userData.id}-${Date.now()}`;
    
    return { user, token };
  }

  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!settingsService.canRegister()) {
      throw new Error('Registration is currently disabled');
    }

    if (this.users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const newUser: UserData = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      password,
      createdAt: new Date().toISOString(),
      isVerified: !settingsService.getSettings().emailVerificationRequired,
      balance: settingsService.getMinimumDeposit(),
      isActive: true,
    };

    this.users.push(newUser);
    this.saveUsers();

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: new Date(newUser.createdAt),
      isVerified: newUser.isVerified,
    };

    const token = `token-${newUser.id}-${Date.now()}`;
    
    return { user, token };
  }

  async validateToken(token: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userId = token.split('-')[1];
    const userData = this.users.find(u => u.id === userId);
    
    if (!userData || !userData.isActive) {
      return null;
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: new Date(userData.createdAt),
      isVerified: userData.isVerified,
    };
  }

  getAllUsers(): UserData[] {
    return [...this.users];
  }

  updateUser(id: string, updates: Partial<UserData>): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.saveUsers();
    
    // If balance was updated, also update trading service
    if (updates.balance !== undefined) {
      tradingService.updateUserBalance(id, updates.balance);
    }
    
    return true;
  }

  getUserBalance(id: string): number {
    const user = this.users.find(u => u.id === id);
    return user ? user.balance : 0;
  }

  updateUserBalance(id: string, newBalance: number): boolean {
    return this.updateUser(id, { balance: newBalance });
  }

  suspendUser(id: string): boolean {
    return this.updateUser(id, { isActive: false });
  }

  activateUser(id: string): boolean {
    return this.updateUser(id, { isActive: true });
  }
}

export const authService = new AuthService();