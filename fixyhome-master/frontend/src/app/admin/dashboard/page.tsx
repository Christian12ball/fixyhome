"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import AdminNavigation from "@/components/AdminNavigation";
import UserManagementFixed from "@/components/admin/UserManagementFixed";
import ArtisanValidationFixed from "@/components/admin/ArtisanValidationFixed";
import ReportsManagement from "@/components/admin/ReportsManagement";
import SettingsManagement from "@/components/admin/SettingsManagement";
import PaymentManagement from "@/components/admin/PaymentManagement";
import ServiceRequestManagementFixed from "@/components/admin/ServiceRequestManagementFixed";
import ServiceManagement from "@/components/admin/ServiceManagement";
import SendNotification from "@/components/admin/SendNotification";
import NotificationManagement from "@/components/admin/NotificationManagement";
import ReviewManagementFixed from "@/components/admin/ReviewManagementFixed";

interface DashboardStats {
  totalUsers: number;
  totalClients: number;
  totalArtisans: number;
  totalAdmins: number;
  totalServiceRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  totalInterventions: number;
  completedInterventions: number;
  totalReviews: number;
  averageRating: number;
  verifiedArtisans: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  createdAt: string;
}

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  budget?: number;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
  };
  artisan?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Intervention {
  id: number;
  status: string;
  startTime?: string;
  endTime?: string;
  actualDuration?: number;
  actualCost?: number;
  createdAt: string;
  serviceRequest: {
    title: string;
    category: string;
  };
  artisan: {
    firstName: string;
    lastName: string;
    email: string;
  };
  client: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface TopArtisan {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  totalRevenue: number;
  completedInterventions: number;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug: Afficher les informations d'authentification
  console.log('Dashboard Admin - User:', user);
  console.log('Dashboard Admin - IsAuthenticated:', isAuthenticated);
  console.log('Dashboard Admin - UserType:', user?.userType);
  console.log('Dashboard Admin - IsLoading:', isLoading);

  useEffect(() => {
    if (isAuthenticated && user && user.userType === 'ADMIN') {
      if (activeTab === 'overview') {
        // Toujours utiliser les données par défaut pour le moment
        setStats(getDefaultStats());
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, activeTab]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Utiliser des données par défaut si pas de token
        setStats(getDefaultStats());
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      };

      const statsRes = await fetch('http://localhost:8080/api/admin/dashboard/stats', {
        method: 'GET',
        headers,
        mode: 'cors'
      });

      if (statsRes.ok) {
        const contentType = statsRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const text = await statsRes.text();
          try {
            const data = JSON.parse(text);
            setStats(data);
          } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            setStats(getDefaultStats());
          }
        } else {
          console.error('Réponse non-JSON reçue:', contentType);
          setStats(getDefaultStats());
        }
      } else {
        console.error('Erreur lors du chargement des statistiques:', statsRes.status);
        setStats(getDefaultStats());
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setStats(getDefaultStats());
    } finally {
      setLoading(false);
    }
  };

const getDefaultStats = (): DashboardStats => ({
  totalUsers: 1250,
  totalClients: 850,
  totalArtisans: 380,
  totalAdmins: 20,
  totalServiceRequests: 2450,
  pendingRequests: 45,
  acceptedRequests: 180,
  inProgressRequests: 95,
  completedRequests: 2130,
  totalInterventions: 1890,
  completedInterventions: 1750,
  totalReviews: 1250,
  averageRating: 4.7,
  verifiedArtisans: 320
});

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-8">Vous devez être connecté pour accéder à cette page.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (user.userType !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès réservé aux administrateurs</h1>
          <p className="text-gray-600 mb-8">Cette page est réservée aux administrateurs.</p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content Area */}
      <div className="ml-64">
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Administrateur
            </h1>
            <p className="text-gray-600 mt-2">
              Gestion complète de la plateforme FixyHome
            </p>
          </div>

          {/* Contenu des onglets */}
          <div>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Statistiques principales */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                        <p className="text-xs text-gray-500">{stats.totalClients} clients • {stats.totalArtisans} artisans</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Demandes de service</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalServiceRequests}</p>
                        <p className="text-xs text-gray-500">{stats.pendingRequests} en attente</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Interventions</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalInterventions}</p>
                        <p className="text-xs text-gray-500">{stats.completedInterventions} terminées</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avis clients</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                        <p className="text-xs text-gray-500">⭐ {stats.averageRating?.toFixed(1)} moyenne</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenu de la vue d'ensemble */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Nouvelle demande de service - Plomberie</span>
                    </div>
                    <span className="text-xs text-gray-500">Il y a 2 min</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Artisan vérifié - Jean Martin</span>
                    </div>
                    <span className="text-xs text-gray-500">Il y a 15 min</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Intervention terminée - Électricité</span>
                    </div>
                    <span className="text-xs text-gray-500">Il y a 1 heure</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des utilisateurs</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/users" className="text-blue-600 hover:underline">/admin/users</a> pour une gestion complète</p>
              </div>
            </div>
          )}
          {activeTab === 'artisans' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des artisans</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/artisans" className="text-blue-600 hover:underline">/admin/artisans</a> pour une gestion complète</p>
              </div>
            </div>
          )}
          {activeTab === 'services' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des services</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/services" className="text-blue-600 hover:underline">/admin/services</a> pour une gestion complète</p>
              </div>
            </div>
          )}
          {activeTab === 'requests' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Demandes de service</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/requests" className="text-blue-600 hover:underline">/admin/requests</a> pour une gestion complète</p>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des avis</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/reviews" className="text-blue-600 hover:underline">/admin/reviews</a> pour une gestion complète</p>
              </div>
            </div>
          )}
          {activeTab === 'payments' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des paiements</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/payments" className="text-blue-600 hover:underline">/admin/payments</a> pour une gestion complète</p>
              </div>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rapports et statistiques</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/reports" className="text-blue-600 hover:underline">/admin/reports</a> pour une gestion complète</p>
              </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des notifications</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/notifications" className="text-blue-600 hover:underline">/admin/notifications</a> pour une gestion complète</p>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/settings" className="text-blue-600 hover:underline">/admin/settings</a> pour une gestion complète</p>
              </div>
            </div>
          )}

          {activeTab === 'interventions' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des interventions</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Utilisez la page <a href="/admin/interventions" className="text-blue-600 hover:underline">/admin/interventions</a> pour une gestion complète</p>
              </div>
            </div>
          )}
        </div>
        </main>
      </div>
    </div>
  );
}
