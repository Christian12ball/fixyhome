"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams, useRouter } from "next/navigation";

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
  createdAt: string;
}

interface PaymentSession {
  success: boolean;
  sessionUrl: string;
  sessionToken: string;
  amount: number;
  interventionId: number;
}

export default function PaymentPage() {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();
  const interventionId = params.interventionId as string;
  
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.userType !== 'CLIENT') {
      router.push('/login');
      return;
    }
    
    if (interventionId) {
      fetchIntervention();
    }
  }, [isAuthenticated, user, interventionId, router]);

  const fetchIntervention = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/interventions/${interventionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIntervention(data);
      } else {
        setError('Intervention non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'intervention:', error);
      setError('Erreur lors du chargement de l\'intervention');
    } finally {
      setLoading(false);
    }
  };

  const createPaymentSession = async () => {
    if (!intervention) return;
    
    setCreatingSession(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/payments/create-session/${interventionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const sessionData = await response.json();
        setPaymentSession(sessionData);
        
        // Rediriger vers la page de paiement Faroty
        window.location.href = sessionData.sessionUrl;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la création de la session de paiement');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
      setError('Erreur lors de la création de la session de paiement');
    } finally {
      setCreatingSession(false);
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

  if (!isAuthenticated || (user && user.userType !== 'CLIENT')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-8">Cette page est réservée aux clients.</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Se connecter
          </button>
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

  if (error || !intervention) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800">Erreur</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={() => router.push('/dashboard/client/interventions')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retour aux interventions
              </button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button 
            onClick={() => router.push('/dashboard/client/interventions')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux interventions
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Paiement</h1>
          <p className="mt-2 text-gray-600">
            Procédez au paiement pour le service complété
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Détails de l'intervention */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Détails de l'intervention</h2>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {intervention.serviceRequest.title}
                  </h3>
                  <p className="text-gray-600">
                    {intervention.serviceRequest.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-gray-500">Artisan:</span>
                    <span className="ml-2 font-medium">
                      {intervention.artisan.firstName} {intervention.artisan.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Statut:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(intervention.status)}`}>
                      {getStatusText(intervention.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Lieu:</span>
                    <span className="ml-2 font-medium">{intervention.serviceRequest.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Durée prévue:</span>
                    <span className="ml-2 font-medium">{intervention.serviceRequest.timeAllocatedHours}h</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Contact artisan:</span>
                    <span className="ml-2 font-medium">{intervention.artisan.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email artisan:</span>
                    <span className="ml-2 font-medium">{intervention.artisan.email}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Informations de contact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Téléphone:</span>
                      <span className="font-medium">{intervention.artisan.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{intervention.artisan.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé du paiement */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Résumé du paiement</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {intervention.serviceRequest.budget}€
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">
                      {intervention.serviceRequest.title}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-medium">
                      {intervention.serviceRequest.timeAllocatedHours}h
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total à payer:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {intervention.serviceRequest.budget}€
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={createPaymentSession}
                    disabled={creatingSession}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {creatingSession ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Création de la session...
                      </div>
                    ) : (
                      'Payer maintenant'
                    )}
                  </button>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Paiement sécurisé</p>
                      <p>Vous serez redirigé vers notre partenaire de paiement Faroty pour finaliser la transaction.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
