"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminNavigation({ activeTab, onTabChange, isOpen, onClose }: AdminNavigationProps) {
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPaymentsDropdownOpen, setIsPaymentsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push('/admin/profile');
  };

  const handlePaymentsList = () => {
    setIsPaymentsDropdownOpen(false);
    router.push('/admin/payments');
  };

  const handlePaymentsSection = (section: string) => {
    setIsPaymentsDropdownOpen(false);
    
    switch (section) {
      case 'payments-list':
        router.push('/admin/payments');
        break;
      case 'wallets':
        router.push('/admin/payments#wallets');
        break;
      case 'accounts':
        router.push('/admin/payments#accounts');
        break;
      case 'payment-methods':
        router.push('/admin/payments#methods');
        break;
      case 'payment-stats':
        router.push('/admin/payments/stats');
        break;
      case 'payment-settings':
        router.push('/admin/payments/settings');
        break;
      default:
        router.push('/admin/payments');
    }
  };

  const handleNavigation = (itemId: string) => {
    if (itemId === 'payments') return;
    
    if (onTabChange) {
      onTabChange(itemId);
    } else {
      switch (itemId) {
        case 'overview':
          router.push('/admin');
          break;
        case 'users':
          router.push('/admin/users');
          break;
        case 'artisans':
          router.push('/admin/artisans');
          break;
        case 'services':
          router.push('/admin/services');
          break;
        case 'requests':
          router.push('/admin/requests');
          break;
        case 'interventions':
          router.push('/admin/interventions');
          break;
        case 'reviews':
          router.push('/admin/reviews');
          break;
        case 'reports':
          router.push('/admin/reports');
          break;
        case 'notifications':
          router.push('/admin/notifications');
          break;
        case 'settings':
          router.push('/admin/settings');
          break;
        default:
          router.push('/admin');
      }
    }
  };

  const navigation = [
    { id: 'overview', label: 'Aperçu', icon: '📊' },
    { id: 'users', label: 'Gestion des utilisateurs', icon: '👥' },
    { id: 'artisans', label: 'Artisans', icon: '🔧' },
    { id: 'services', label: 'Services', icon: '🔨' },
    { id: 'requests', label: 'Demandes services', icon: '📋' },
    { id: 'interventions', label: 'Interventions artisans', icon: '🛠️' },
    { id: 'reviews', label: 'Avis clients', icon: '⭐' },
    { id: 'payments', label: 'Paiements', icon: '💳' },
    { id: 'reports', label: 'Rapports', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
  ];

  const paymentsSubItems = [
    { id: 'payments-list', label: 'Liste des paiements', icon: '💰', description: 'Tous les paiements effectués' },
    { id: 'wallets', label: 'Wallets créés', icon: '👛', description: 'Gestion des wallets FarotyPay' },
    { id: 'accounts', label: 'Comptes créés', icon: '👤', description: 'Utilisateurs et leurs comptes' },
    { id: 'payment-methods', label: 'Méthodes de paiement', icon: '💳', description: 'Configuration des méthodes' },
    { id: 'payment-stats', label: 'Statistiques', icon: '📊', description: 'Rapports et analyses' },
    { id: 'payment-settings', label: 'Configuration', icon: '⚙️', description: 'Paramètres FarotyPay' },
  ];

  // Si onTabChange est fourni, utiliser la navigation par onglets horizontale
  if (onTabChange) {
    return (
      <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // Pendant le montage initial, rendre la version de chargement
  if (!mounted) {
    return (
      <div className={`w-64 h-screen bg-[#1E3A5F] text-white fixed left-0 top-0 z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-[#2A4A6F]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FixyHome</h1>
              <p className="text-xs text-gray-300">Admin Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-64 h-screen bg-[#1E3A5F] text-white fixed left-0 top-0 z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-[#2A4A6F]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FixyHome</h1>
            <p className="text-xs text-gray-300">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-4 border-b border-[#2A4A6F]">
        <div className="relative dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-[#2A4A6F] rounded-lg p-3 hover:bg-[#3A5A7F] transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-gray-300">Organisation</p>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-300 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#2A4A6F] rounded-lg shadow-lg border border-[#3A5A7F] z-50">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-[#3A5A7F] hover:text-white transition-colors duration-200 rounded-t-lg"
              >
                <span className="text-lg">👤</span>
                <span>Profil</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-2">
          {navigation.map((item) => {
            if (item.id === 'payments') {
              return (
                <li key={item.id} className="payments-dropdown-container">
                  <button
                    onClick={() => setIsPaymentsDropdownOpen(!isPaymentsDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-gray-300 hover:bg-[#2A4A6F] hover:text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                      <span className="px-2 py-1 bg-yellow-400 text-[#1E3A5F] text-xs font-bold rounded-full">Nouveau</span>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-300 transform transition-transform duration-200 ${isPaymentsDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isPaymentsDropdownOpen && (
                    <div className="ml-4 mt-2 space-y-1">
                      {paymentsSubItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            if (subItem.id === 'payments-list') {
                              handlePaymentsList();
                            } else {
                              handlePaymentsSection(subItem.id);
                            }
                          }}
                          className="w-full flex items-start space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 text-gray-400 hover:bg-[#2A4A6F] hover:text-white"
                        >
                          <span className="text-lg mt-0.5">{subItem.icon}</span>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{subItem.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{subItem.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              );
            }
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-gray-300 hover:bg-[#2A4A6F] hover:text-white"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#2A4A6F] mt-auto">
        <div className="space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#2A4A7F] hover:text-white transition-all duration-200"
          >
            <span className="text-lg">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
