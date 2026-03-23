"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const interventionId = searchParams.get('intervention');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.userType !== 'CLIENT') {
      router.push('/login');
      return;
    }
    
    // Simuler une attente pour le traitement du webhook
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [isAuthenticated, user, router]);

  const handleViewInterventions = () => {
    router.push('/dashboard/client/interventions');
  };

  const handleViewReceipt = () => {
    // Implémenter la vue du reçu si nécessaire
    alert('Fonctionnalité de reçu à implémenter');
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Traitement du paiement...</h2>
          <p className="text-gray-600 mt-2">Nous confirmons votre paiement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Carte de succès */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-6 py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-green-900 mb-2">Paiement réussi!</h1>
              <p className="text-green-700">
                Votre paiement a été traité avec succès. L'artisan a été notifié.
              </p>
            </div>
            
            <div className="px-6 py-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Référence intervention:</span>
                  <span className="font-medium">#{interventionId || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Date du paiement:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Statut:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Payé
                  </span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Prochaines étapes</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>L'artisan a été notifié du paiement</li>
                      <li>Vous pouvez laisser un avis sur le service</li>
                      <li>Un reçu sera disponible dans votre historique</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleViewInterventions}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Voir mes interventions
                </button>
                
                <button
                  onClick={handleViewReceipt}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Voir le reçu
                </button>
              </div>
            </div>
          </div>
          
          {/* Section avis */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Partagez votre expérience</h2>
            <p className="text-gray-600 mb-4">
              Votre avis aide la communauté à faire les meilleurs choix.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Implémenter la redirection vers la page d'avis
                  if (interventionId) {
                    router.push(`/dashboard/client/review/${interventionId}`);
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
              >
                Laisser un avis
              </button>
              
              <button
                onClick={handleViewInterventions}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
