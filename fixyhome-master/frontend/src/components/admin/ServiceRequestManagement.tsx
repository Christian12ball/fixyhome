"use client";

import { useState, useEffect } from "react";

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
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  artisan?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ServiceRequestManagementProps {
  token: string;
}

export default function ServiceRequestManagement({ token }: ServiceRequestManagementProps) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    try {
      const url = filterStatus === "ALL" 
        ? 'http://localhost:8080/api/admin/service-requests'
        : `http://localhost:8080/api/admin/service-requests?status=${filterStatus}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/service-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const deleteRequest = async (requestId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/service-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchRequests();
        setShowDetailsModal(false);
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const exportRequests = () => {
    const csvContent = [
      ['ID', 'Titre', 'Client', 'Catégorie', 'Statut', 'Budget', 'Date', 'Artisan assigné'],
      ...requests.map(request => [
        request.id,
        request.title,
        `${request.client.firstName} ${request.client.lastName}`,
        request.category,
        request.status,
        request.budget || 'N/A',
        new Date(request.createdAt).toLocaleDateString('fr-FR'),
        request.artisan ? `${request.artisan.firstName} ${request.artisan.lastName}` : 'Non assigné'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `demandes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'PLUMBING': return 'Plomberie';
      case 'ELECTRICITY': return 'Électricité';
      case 'CLEANING': return 'Ménage';
      case 'GARDENING': return 'Jardinage';
      case 'PAINTING': return 'Peinture';
      case 'CARPENTRY': return 'Menuiserie';
      default: return category;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'ACCEPTED': return 'Acceptée';
      case 'IN_PROGRESS': return 'En cours';
      case 'COMPLETED': return 'Terminée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${request.client.firstName} ${request.client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              type="text"
              placeholder="Rechercher une demande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="ACCEPTED">Acceptées</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminées</option>
              <option value="CANCELLED">Annulées</option>
            </select>
          </div>
          <button
            onClick={exportRequests}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📥 Exporter CSV
          </button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="grid gap-6">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    {request.title}
                  </h3>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{request.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Client:</span>
                    <p className="text-sm text-gray-900">
                      {request.client.firstName} {request.client.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{request.client.email}</p>
                    <p className="text-sm text-gray-500">{request.client.phone}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Catégorie:</span>
                    <p className="text-sm text-gray-900">{getCategoryText(request.category)}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Lieu:</span>
                    <p className="text-sm text-gray-900">{request.location}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Budget:</span>
                    <p className="text-sm text-gray-900">
                      {request.budget ? `${request.budget}€` : 'Non spécifié'}
                    </p>
                  </div>
                </div>

                {request.artisan && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-900">Artisan assigné:</span>
                    <p className="text-sm text-blue-800">
                      {request.artisan.firstName} {request.artisan.lastName} ({request.artisan.email})
                    </p>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                  Créée le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedRequest(request);
                  setShowDetailsModal(true);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Voir détails
              </button>
              
              {request.status === 'PENDING' && (
                <button
                  onClick={() => updateRequestStatus(request.id, 'ACCEPTED')}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Accepter
                </button>
              )}
              
              {request.status === 'ACCEPTED' && (
                <button
                  onClick={() => updateRequestStatus(request.id, 'IN_PROGRESS')}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Démarrer
                </button>
              )}
              
              {request.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => updateRequestStatus(request.id, 'COMPLETED')}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Terminer
                </button>
              )}
              
              <button
                onClick={() => deleteRequest(request.id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de détails */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Détails de la demande
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Informations principales */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Informations principales</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Titre:</span>
                    <p className="text-gray-900 font-medium">{selectedRequest.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Description:</span>
                    <p className="text-gray-900">{selectedRequest.description}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Statut:</span>
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusText(selectedRequest.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Client */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Client</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Nom:</span>
                    <p className="text-gray-900">{selectedRequest.client.firstName} {selectedRequest.client.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="text-gray-900">{selectedRequest.client.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Téléphone:</span>
                    <p className="text-gray-900">{selectedRequest.client.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ID Client:</span>
                    <p className="text-gray-900">{selectedRequest.client.id}</p>
                  </div>
                </div>
              </div>

              {/* Détails de la demande */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Détails de la demande</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Catégorie:</span>
                    <p className="text-gray-900">{getCategoryText(selectedRequest.category)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Lieu:</span>
                    <p className="text-gray-900">{selectedRequest.location}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Budget:</span>
                    <p className="text-gray-900">
                      {selectedRequest.budget ? `${selectedRequest.budget}€` : 'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Date de création:</span>
                    <p className="text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleDateString('fr-FR')} à {' '}
                      {new Date(selectedRequest.createdAt).toLocaleTimeString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Artisan assigné */}
              {selectedRequest.artisan && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Artisan assigné</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Nom:</span>
                      <p className="text-gray-900">{selectedRequest.artisan.firstName} {selectedRequest.artisan.lastName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="text-gray-900">{selectedRequest.artisan.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
              
              {selectedRequest.status === 'PENDING' && (
                <button
                  onClick={() => {
                    updateRequestStatus(selectedRequest.id, 'ACCEPTED');
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accepter
                </button>
              )}
              
              <button
                onClick={() => {
                  deleteRequest(selectedRequest.id);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
