"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  location: string;
  budget: number;
  timeAllocatedHours: number;
  estimatedCost: number;
  hourlyRate: number;
  status: string;
  createdAt: string;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  serviceType: {
    id: number;
    label: string;
  };
}

interface CompletionFormData {
  actualDurationMinutes: string;
  notes: string;
}

export default function ArtisanReservationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<ServiceRequest | null>(null);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completionData, setCompletionData] = useState<CompletionFormData>({
    actualDurationMinutes: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.userType !== 'ARTISAN') {
      window.location.href = '/login';
      return;
    }
    fetchReservations();
  }, [isAuthenticated, user]);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8080/api/artisan/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReservation = async (reservationId: number) => {
    if (!completionData.actualDurationMinutes || !completionData.notes) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/artisan/reservations/${reservationId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          actualDurationMinutes: parseInt(completionData.actualDurationMinutes),
          notes: completionData.notes
        })
      });

      if (response.ok) {
        alert('Réservation marquée comme terminée avec succès!');
        setShowCompletionForm(false);
        setCompletionData({ actualDurationMinutes: "", notes: "" });
        setSelectedReservation(null);
        fetchReservations();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Erreur lors de la finalisation');
      }
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
      alert('Erreur lors de la finalisation de la réservation');
    } finally {
      setSubmitting(false);
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

  if (!isAuthenticated || (user && user.userType !== 'ARTISAN')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-8">Cette page est réservée aux artisans.</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes réservations</h1>
          <p className="mt-2 text-gray-600">
            Gérez les réservations de services acceptées
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Liste des réservations</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {reservations.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
                <p className="text-gray-600">Vous n'avez pas encore de réservations à gérer.</p>
              </div>
            ) : (
              reservations.map((reservation) => (
                <div key={reservation.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{reservation.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{reservation.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-gray-500">Client:</span>
                          <span className="ml-2 font-medium">
                            {reservation.client.firstName} {reservation.client.lastName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Service:</span>
                          <span className="ml-2 font-medium">
                            {reservation.serviceType?.label || 'Non spécifié'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Budget:</span>
                          <span className="ml-2 font-medium">{reservation.budget}€</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Durée prévue:</span>
                          <span className="ml-2 font-medium">{reservation.timeAllocatedHours}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Lieu:</span>
                          <span className="ml-2 font-medium">{reservation.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Contact:</span>
                          <span className="ml-2 font-medium">{reservation.client.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 font-medium">{reservation.client.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <span className="ml-2 font-medium">
                            {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                      
                      {reservation.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowCompletionForm(true);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                          Terminer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal de finalisation */}
        {showCompletionForm && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Finaliser la réservation</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Service:</strong> {selectedReservation.title}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Client:</strong> {selectedReservation.client.firstName} {selectedReservation.client.lastName}
                </p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleCompleteReservation(selectedReservation.id);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durée réelle (minutes)
                    </label>
                    <input
                      type="number"
                      required
                      value={completionData.actualDurationMinutes}
                      onChange={(e) => setCompletionData({...completionData, actualDurationMinutes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Durée en minutes"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      required
                      value={completionData.notes}
                      onChange={(e) => setCompletionData({...completionData, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Notes sur l'intervention..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCompletionForm(false);
                      setSelectedReservation(null);
                      setCompletionData({ actualDurationMinutes: "", notes: "" });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting ? 'Traitement...' : 'Terminer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
