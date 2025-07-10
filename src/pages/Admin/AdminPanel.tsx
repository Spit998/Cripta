import React, { useState } from 'react';
import { useEffect } from 'react';
import { Users, DollarSign, Activity, Settings, Search, Edit2, Save, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/authService';
import { settingsService } from '../../services/settingsService';
import { tradingService } from '../../services/tradingService';

const AdminPanel: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [settingsMessage, setSettingsMessage] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(authService.getAllUsers());
    setTransactions(tradingService.getTransactions());
    setSettings(settingsService.getSettings());
  };

  const handleSuspendUser = (userId: string) => {
    authService.suspendUser(userId);
    loadData();
  };

  const handleActivateUser = (userId: string) => {
    authService.activateUser(userId);
    loadData();
  };

  const handleSaveSettings = () => {
    const success = settingsService.updateSettings(settings);
    setSettingsMessage(success ? 'Settings saved successfully!' : 'Failed to save settings');
    setTimeout(() => setSettingsMessage(''), 3000);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
    });
  };

  const handleSaveUser = () => {
    if (editingUser) {
      authService.updateUser(editingUser, editForm);
      setEditingUser(null);
      setEditForm({});
      loadData();
      
      // Show success message
      setSettingsMessage('User updated successfully!');
      setTimeout(() => setSettingsMessage(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const stats = [
    { title: t('total_users'), value: users.length.toString(), icon: Users, color: 'bg-blue-600' },
    { title: t('total_volume'), value: `$${(transactions.reduce((sum, tx) => sum + tx.total, 0) / 1000).toFixed(1)}K`, icon: DollarSign, color: 'bg-green-600' },
    { title: t('active_trades'), value: transactions.filter(tx => tx.status === 'completed').length.toString(), icon: Activity, color: 'bg-purple-600' },
    { title: t('system_status'), value: settings.maintenanceMode ? 'Maintenance' : 'Online', icon: Settings, color: settings.maintenanceMode ? 'bg-red-600' : 'bg-green-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('admin_panel')}
        </h1>
        <div className="flex items-center space-x-2">
          <Settings className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            {t('system_management')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-lg p-6 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {stat.title}
                </div>
                <div className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`rounded-lg border ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className={`flex border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : isDark 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('users')}
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : isDark 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('transactions')}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : isDark 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('settings')}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('user_management')}
                </h2>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input
                    type="text"
                    placeholder={t('search_users')}
                    className={`pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
                    }`}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t('name')}
                      </th>
                      <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t('email')}
                      </th>
                      <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t('role')}
                      </th>
                      <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t('balance')}
                      </th>
                      <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t('status')}
                      </th>
                      <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                        <td className="py-3">
                          {editingUser === user.id ? (
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              className={`px-2 py-1 rounded text-sm w-full ${
                                isDark 
                                  ? 'bg-slate-700 text-white border-slate-600' 
                                  : 'bg-slate-50 text-slate-900 border-slate-300'
                              }`}
                            />
                          ) : (
                            <span className={isDark ? 'text-white' : 'text-slate-900'}>
                              {user.name}
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          {editingUser === user.id ? (
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              className={`px-2 py-1 rounded text-sm w-full ${
                                isDark 
                                  ? 'bg-slate-700 text-white border-slate-600' 
                                  : 'bg-slate-50 text-slate-900 border-slate-300'
                              }`}
                            />
                          ) : (
                            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                              {user.email}
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          {editingUser === user.id ? (
                            <select
                              value={editForm.role}
                              onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                              className={`px-2 py-1 rounded text-sm ${
                                isDark 
                                  ? 'bg-slate-700 text-white border-slate-600' 
                                  : 'bg-slate-50 text-slate-900 border-slate-300'
                              }`}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          {editingUser === user.id ? (
                            <input
                              type="number"
                              value={editForm.balance}
                              onChange={(e) => setEditForm({...editForm, balance: parseFloat(e.target.value)})}
                              className={`px-2 py-1 rounded text-sm w-20 ${
                                isDark 
                                  ? 'bg-slate-700 text-white border-slate-600' 
                                  : 'bg-slate-50 text-slate-900 border-slate-300'
                              }`}
                            />
                          ) : (
                            <span className={isDark ? 'text-white' : 'text-slate-900'}>
                              ${user.balance.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            user.isActive 
                              ? 'bg-green-600 text-white' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {user.isActive ? 'active' : 'suspended'}
                          </span>
                        </td>
                        <td className="py-3">
                          {editingUser === user.id ? (
                            <div className="flex space-x-2">
                              <button 
                                onClick={handleSaveUser}
                                className="text-green-400 hover:text-green-300"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-blue-400 hover:text-blue-300 mr-2"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => user.isActive ? handleSuspendUser(user.id) : handleActivateUser(user.id)}
                            className={user.isActive ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"}
                          >
                            {user.isActive ? t('suspend') : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
             <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
               {t('transaction_history')}
             </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                   <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                     <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                       {t('user')}
                     </th>
                     <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                       {t('type')}
                     </th>
                     <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                       {t('amount')}
                     </th>
                     <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                       {t('value')}
                     </th>
                     <th className={`py-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                       {t('date')}
                     </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 10).map((tx) => (
                     <tr key={tx.id} className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                       <td className={`py-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                         {users.find(u => u.id === tx.userId)?.name || 'Unknown'}
                       </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          tx.type === 'buy' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white'
                        }`}>
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                       <td className={`py-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                         {tx.amount} {tx.symbol}
                       </td>
                       <td className={`py-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                         ${tx.total.toLocaleString()}
                       </td>
                       <td className={`py-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                         {new Date(tx.timestamp).toLocaleDateString()}
                       </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
             <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
               {t('system_settings')}
             </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {t('trading_fee')}
                    </label>
                    <input
                      type="number"
                      value={settings.tradingFee}
                      onChange={(e) => setSettings({...settings, tradingFee: parseFloat(e.target.value)})}
                      className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {t('minimum_deposit')}
                    </label>
                    <input
                      type="number"
                      value={settings.minimumDeposit}
                      onChange={(e) => setSettings({...settings, minimumDeposit: parseFloat(e.target.value)})}
                      className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {t('max_withdrawal')}
                    </label>
                    <input
                      type="number"
                      value={settings.maxWithdrawal}
                      onChange={(e) => setSettings({...settings, maxWithdrawal: parseFloat(e.target.value)})}
                      className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {t('maintenance_mode')}
                    </label>
                    <select 
                      value={settings.maintenanceMode ? 'true' : 'false'}
                      onChange={(e) => setSettings({...settings, maintenanceMode: e.target.value === 'true'})}
                      className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="false">{t('disabled')}</option>
                      <option value="true">{t('enabled')}</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {settingsMessage && (
                <div className={`p-3 border rounded-lg mb-4 ${
                  isDark 
                    ? 'bg-green-900/50 border-green-500 text-green-200' 
                    : 'bg-green-50 border-green-300 text-green-700'
                }`}>
                  {settingsMessage}
                </div>
              )}
              
              <button 
                onClick={handleSaveSettings}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('save_settings')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;