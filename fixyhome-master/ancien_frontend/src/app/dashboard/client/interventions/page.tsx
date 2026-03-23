"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Intervention {
  id: number;
  serviceRequest: {
    id: number;
    title: string;
    description: string;
    location: string;
    budget: number;
    timeAllocatedHours: number;
    createdAt: string;
  };
  artisan: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: string;
  scheduledDate: string;
  actualDurationMinutes?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus?: string; // PENDING, COMPLETED, FAILED
  paymentSessionToken?: string;
  paymentCompletedAt?: string;
  completedAt?: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
}

export default function ClientInterventionsPage() {
  const { user, isAuthenticated } = useAuth();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.userType !== 'CLIENT') {
      window.location.href = '/login';
      return;
    }
    fetchInterventions();
    fetchNotifications();
  }, [isAuthenticated, user]);

  const fetchInterventions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8080/api/interventions/client', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInterventions(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8080/api/notifications/client', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const handleWorkCompleted = async (interventionId: number) => {
    try {
      // Trouver l'intervention pour obtenir le montant
      const intervention = interventions.find(i => i.id === interventionId);
      const amount = intervention?.serviceRequest?.budget || 20;
      
      // Rediriger vers la page d'initialisation de paiement avec les paramètres
      window.location.href = `/payment/init?interventionId=${interventionId}&amount=${amount}`;
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la redirection vers le paiement');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Planifiée';
      case 'IN_PROGRESS': return 'En cours';
      case 'COMPLETED': return 'Terminée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status?: string) => {
    switch (status) {
      case 'COMPLETED': return 'Payé';
      case 'PENDING': return 'En attente';
      case 'FAILED': return 'Échoué';
      default: return 'Non payé';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  if (!isAuthenticated || (user && user.userType !== 'CLIENT')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-8">Cette page est réservée aux clients.</p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes interventions</h1>
            <p className="mt-2 text-gray-600">
              Suivez l'état de vos interventions et gérez les paiements
            </p>
          </div>
          
          {/* Bouton notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadNotifications.length > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              )}
            </button>

            {/* Menu notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.read ? 'font-semibold' : ''} text-gray-900`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString('fr-FR')} à{' '}
                              {new Date(notification.createdAt).toLocaleTimeString('fr-FR')}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Liste des interventions</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {interventions.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune intervention</h3>
                <p className="text-gray-600">Vous n'avez pas encore d'interventions planifiées.</p>
              </div>
            ) : (
              interventions.map((intervention) => (
                <div key={intervention.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {intervention.serviceRequest.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {intervention.serviceRequest.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-gray-500">Artisan:</span>
                          <span className="ml-2 font-medium">
                            {intervention.artisan.firstName} {intervention.artisan.lastName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Date prévue:</span>
                          <span className="ml-2 font-medium">
                            {intervention.scheduledDate ? 
                              new Date(intervention.scheduledDate).toLocaleDateString('fr-FR') : 
                              'Non définie'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Budget:</span>
                          <span className="ml-2 font-medium">
                            {intervention.serviceRequest.budget}€
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Durée prévue:</span>
                          <span className="ml-2 font-medium">
                            {intervention.serviceRequest.timeAllocatedHours}h
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Lieu:</span>
                          <span className="ml-2 font-medium">
                            {intervention.serviceRequest.location}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Contact:</span>
                          <span className="ml-2 font-medium">
                            {intervention.artisan.phone}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 font-medium">
                            {intervention.artisan.email}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Date demande:</span>
                          <span className="ml-2 font-medium">
                            {new Date(intervention.serviceRequest.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>

                      {intervention.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <strong>Notes:</strong> {intervention.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(intervention.status)}`}>
                          {getStatusText(intervention.status)}
                        </span>
                        {intervention.paymentStatus && (
                          <div className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(intervention.paymentStatus)}`}>
                              {getPaymentStatusText(intervention.paymentStatus)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {intervention.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleWorkCompleted(intervention.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                          Tâche accomplie
                        </button>
                      )}
                      
                      {intervention.status === 'COMPLETED' && !intervention.paymentStatus && (
                        <span className="text-orange-600 text-sm font-medium">
                          En attente de paiement
                        </span>
                      )}
                      
                      {intervention.status === 'COMPLETED' && intervention.paymentStatus === 'COMPLETED' && (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Payée
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
