"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interventionId = searchParams.get("interventionId");
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier le statut du paiement
    const checkPaymentStatus = async () => {
      if (!interventionId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/interventions/${interventionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPaymentStatus(data.paymentStatus);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [interventionId]);

  const handleGoToDashboard = () => {
    router.push('/dashboard/client/interventions');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-600 font-medium">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icône de succès */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement réussi !
          </h1>

          <p className="text-gray-600 mb-8">
            Votre paiement a été traité avec succès. L'artisan a été notifié et votre intervention est maintenant marquée comme payée.
          </p>

          {/* Détails du paiement */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de la transaction</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Intervention:</span>
                <span className="font-medium">#{interventionId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  paymentStatus === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {paymentStatus === 'COMPLETED' ? 'Payé' : 'En cours'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Méthode:</span>
                <span className="font-medium">Faroty Wallet</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Voir mes interventions
            </button>

            <button
              onClick={() => window.print()}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Imprimer le reçu
            </button>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              Un email de confirmation a été envoyé à votre adresse.
            </p>
            <p className="text-xs text-gray-500">
              Pour toute question, contactez notre support client.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
