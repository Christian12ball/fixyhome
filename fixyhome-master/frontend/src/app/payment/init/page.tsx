"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PaymentTokenResponse {
  success: boolean;
  farotyToken: string;
  sessionUrl: string;
  walletId: string;
  sessionToken: string;
  amount: number;
  interventionId: number;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentTokenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interventionId = searchParams.get('intervention');
    const amount = searchParams.get('amount');
    
    if (!interventionId || !amount) {
      setError('Paramètres de paiement manquants');
      setLoading(false);
      return;
    }

    // Simuler l'initialisation du paiement
    setTimeout(() => {
      const mockPaymentData: PaymentTokenResponse = {
        success: true,
        farotyToken: 'mock_faroty_token_' + Date.now(),
        sessionUrl: 'https://mock-payment-url.com',
        walletId: 'mock_wallet_id',
        sessionToken: 'mock_session_token',
        amount: parseInt(amount),
        interventionId: parseInt(interventionId)
      };
      
      setPaymentData(mockPaymentData);
      setLoading(false);
    }, 2000);
  }, [searchParams, router]);

  const handlePayment = () => {
    if (paymentData?.sessionUrl) {
      // Rediriger vers la page de paiement Faroty
      window.location.href = paymentData.sessionUrl;
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/client/interventions');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation du paiement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de paiement</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleCancel}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retour aux interventions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Initialisation du paiement
            </h1>
            
            <p className="text-gray-600">
              Préparez votre paiement sécurisé via Faroty
            </p>
          </div>

          {paymentData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">Détails de la transaction</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-bold text-blue-600">{paymentData.amount.toLocaleString('fr-FR')} FCFA</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence:</span>
                  <span className="font-medium">INT-{paymentData.interventionId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Prêt pour paiement
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-yellow-600 text-sm">ℹ️</span>
              </div>
              <div>
                <h3 className="font-medium text-yellow-900 mb-2">Information importante</h3>
                <p className="text-yellow-800 text-sm">
                  Vous allez être redirigé vers la plateforme de paiement sécurisée Faroty. 
                  Ne fermez pas cette fenêtre pendant le processus de paiement.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            
            <button
              onClick={handlePayment}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Payer avec Faroty
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function FarotyPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
