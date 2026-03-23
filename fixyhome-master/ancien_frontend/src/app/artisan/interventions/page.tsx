"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export default function ArtisanInterventions() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [interventions, setInterventions] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated && user && user.userType === 'ARTISAN') {
      fetchInterventions();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchInterventions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:8080/api/interventions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setInterventions(data);
        } else {
          console.error('Erreur lors du chargement des interventions:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/interventions/${requestId}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (response.ok) {
          // Mettre à jour la liste des interventions
          fetchInterventions();
          alert(`Statut mis à jour avec succès!`);
        } else {
          alert('Erreur lors de la mise à jour du statut');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'ACCEPTED': return 'Accepté';
      case 'IN_PROGRESS': return 'En cours';
      case 'COMPLETED': return 'Terminé';
      default: return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PLUMBING': return '🔧';
      case 'ELECTRICITY': return '⚡';
      case 'CLEANING': return '🧹';
      default: return '🔨';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'PLUMBING': return 'Plomberie';
      case 'ELECTRICITY': return 'Électricité';
      case 'CLEANING': return 'Ménage';
      default: return category;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'ACCEPTED': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'COMPLETED';
      default: return null;
    }
  };

  const getNextStatusText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'ACCEPTED': return 'Commencer l\'intervention';
      case 'IN_PROGRESS': return 'Terminer l\'intervention';
      default: return null;
    }
  };

  const filteredInterventions = interventions.filter(intervention => {
    const matchesFilter = filter === 'all' || intervention.status === filter;
    const matchesSearch = intervention.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${intervention.client.firstName} ${intervention.client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStats = () => {
    const total = interventions.length;
    const inProgress = interventions.filter(i => i.status === 'IN_PROGRESS').length;
    const completed = interventions.filter(i => i.status === 'COMPLETED').length;
    const accepted = interventions.filter(i => i.status === 'ACCEPTED').length;
    
    return { total, inProgress, completed, accepted };
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des interventions...</p>
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
          <Link href="/login" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (user.userType !== 'ARTISAN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès réservé aux artisans</h1>
          <p className="text-gray-600 mb-8">Cette page est réservée aux artisans.</p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/artisan" 
            className="text-green-600 hover:text-green-800 font-medium text-sm mb-4 inline-block"
          >
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Mes interventions
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos interventions acceptées et suivez leur progression
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher une intervention
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par titre, description, client ou localisation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="md:w-48">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par statut
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Toutes les interventions</option>
                <option value="ACCEPTED">Acceptées</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Terminées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des interventions */}
        {filteredInterventions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A6 6 0 0112 7.255a6 6 0 00-9 6.255V21h3v-6.255a3 3 0 016 0V21h3V13.255z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune intervention trouvée</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Essayez de modifier vos filtres ou votre recherche.'
                : 'Vous n\'avez aucune intervention pour le moment. Consultez les demandes disponibles pour en accepter.'
              }
            </p>
            {filter === 'all' && !searchTerm && (
              <Link 
                href="/artisan/requests" 
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mt-4"
              >
                Voir les demandes disponibles
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredInterventions.map((intervention) => (
              <div key={intervention.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    {/* En-tête de l'intervention */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getCategoryIcon(intervention.category)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{intervention.title}</h3>
                          <p className="text-sm text-gray-500">
                            {getCategoryText(intervention.category)} • {intervention.location}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(intervention.status)}`}>
                        {getStatusText(intervention.status)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4">{intervention.description}</p>

                    {/* Informations client et détails */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Informations client</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Nom:</strong> {intervention.client.firstName} {intervention.client.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Email:</strong> {intervention.client.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Téléphone:</strong> {intervention.client.phone || 'Non spécifié'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Détails de l'intervention</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Budget:</strong> {intervention.budget ? `${intervention.budget}€` : 'Non spécifié'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Acceptée le:</strong> {new Date(intervention.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        {intervention.updatedAt !== intervention.createdAt && (
                          <p className="text-sm text-gray-600">
                            <strong>Dernière mise à jour:</strong> {new Date(intervention.updatedAt).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {getNextStatus(intervention.status) && (
                        <button
                          onClick={() => handleUpdateStatus(intervention.id, getNextStatus(intervention.status)!)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          {getNextStatusText(intervention.status)}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          // TODO: Implémenter la fonctionnalité de contact
                          alert('Fonctionnalité de contact bientôt disponible');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Contacter le client
                      </button>
                      {intervention.status === 'COMPLETED' && (
                        <button
                          onClick={() => {
                            // TODO: Implémenter la fonctionnalité d'avis
                            alert('Fonctionnalité d\'avis bientôt disponible');
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Demander un avis
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
