"use client";

import { useState, useEffect } from "react";

interface Artisan {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  experience: number;
  hourlyRate: number;
  isVerified: boolean;
  rating: number;
  createdAt: string;
  user: {
    id: number;
    email: string;
  };
}

interface ArtisanValidationProps {
  token: string;
}

export default function ArtisanValidation({ token }: ArtisanValidationProps) {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchArtisans();
  }, [filterStatus]);

  const fetchArtisans = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/artisans?status=${filterStatus}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setArtisans(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveArtisan = async (artisanId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/artisans/${artisanId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchArtisans();
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const rejectArtisan = async (artisanId: number, reason: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/artisans/${artisanId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        fetchArtisans();
        setShowDetailsModal(false);
        setSelectedArtisan(null);
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Validation des artisans</h2>
          <div className="flex space-x-2">
            {['PENDING', 'VERIFIED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'PENDING' ? 'En attente' :
                 status === 'VERIFIED' ? 'Validés' : 'Rejetés'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des artisans */}
      <div className="grid gap-6">
        {artisans.map((artisan) => (
          <div key={artisan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-medium text-blue-600">
                      {artisan.firstName.charAt(0)}{artisan.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {artisan.firstName} {artisan.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{artisan.email}</p>
                    <p className="text-sm text-gray-500">{artisan.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Catégorie:</span>
                    <p className="text-sm text-gray-900">{getCategoryText(artisan.category)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Expérience:</span>
                    <p className="text-sm text-gray-900">{artisan.experience} ans</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Taux horaire:</span>
                    <p className="text-sm text-gray-900">{artisan.hourlyRate}€/h</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Note:</span>
                    <p className="text-sm text-gray-900">
                      {artisan.rating ? '⭐'.repeat(Math.round(artisan.rating)) : 'Pas encore noté'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">Description:</span>
                  <p className="text-sm text-gray-900 mt-1">{artisan.description}</p>
                </div>

                <div className="text-sm text-gray-500">
                  Inscrit le {new Date(artisan.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="ml-4">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  artisan.isVerified ? 'bg-green-100 text-green-800' :
                  filterStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {artisan.isVerified ? 'Validé' :
                   filterStatus === 'REJECTED' ? 'Rejeté' : 'En attente'}
                </span>
              </div>
            </div>

            {/* Actions */}
            {!artisan.isVerified && filterStatus === 'PENDING' && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedArtisan(artisan);
                    setShowDetailsModal(true);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Voir détails
                </button>
                <button
                  onClick={() => rejectArtisan(artisan.id, 'Informations insuffisantes')}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Rejeter
                </button>
                <button
                  onClick={() => approveArtisan(artisan.id)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Approuver
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de détails */}
      {showDetailsModal && selectedArtisan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Détails de l'artisan
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedArtisan(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Informations personnelles */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Informations personnelles</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Nom:</span>
                    <p className="text-gray-900">{selectedArtisan.firstName} {selectedArtisan.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="text-gray-900">{selectedArtisan.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Téléphone:</span>
                    <p className="text-gray-900">{selectedArtisan.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Date d'inscription:</span>
                    <p className="text-gray-900">{new Date(selectedArtisan.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              {/* Professionnelles */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Informations professionnelles</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Catégorie:</span>
                    <p className="text-gray-900">{getCategoryText(selectedArtisan.category)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Expérience:</span>
                    <p className="text-gray-900">{selectedArtisan.experience} ans</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Taux horaire:</span>
                    <p className="text-gray-900">{selectedArtisan.hourlyRate}€/h</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Note actuelle:</span>
                    <p className="text-gray-900">
                      {selectedArtisan.rating ? `${selectedArtisan.rating}/5 ⭐` : 'Pas encore noté'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Description</h4>
                <p className="text-gray-900">{selectedArtisan.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedArtisan(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => rejectArtisan(selectedArtisan.id, 'Après examen du dossier')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Rejeter
              </button>
              <button
                onClick={() => approveArtisan(selectedArtisan.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approuver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
