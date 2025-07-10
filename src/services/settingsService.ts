interface SystemSettings {
  tradingFee: number;
  minimumDeposit: number;
  maxWithdrawal: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailVerificationRequired: boolean;
  maxDailyTrades: number;
  supportedLanguages: string[];
}

class SettingsService {
  private settings: SystemSettings = {
    tradingFee: 0.1,
    minimumDeposit: 10,
    maxWithdrawal: 10000,
    maintenanceMode: false,
    allowRegistration: true,
    emailVerificationRequired: false,
    maxDailyTrades: 100,
    supportedLanguages: ['ru', 'en', 'de'],
  };

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    const saved = localStorage.getItem('system_settings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  private saveSettings() {
    localStorage.setItem('system_settings', JSON.stringify(this.settings));
  }

  getSettings(): SystemSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<SystemSettings>): boolean {
    try {
      this.settings = { ...this.settings, ...newSettings };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }

  getTradingFee(): number {
    return this.settings.tradingFee / 100; // Convert percentage to decimal
  }

  isMaintenanceMode(): boolean {
    return this.settings.maintenanceMode;
  }

  canRegister(): boolean {
    return this.settings.allowRegistration && !this.settings.maintenanceMode;
  }

  getMinimumDeposit(): number {
    return this.settings.minimumDeposit;
  }

  getMaxWithdrawal(): number {
    return this.settings.maxWithdrawal;
  }
}

export const settingsService = new SettingsService();