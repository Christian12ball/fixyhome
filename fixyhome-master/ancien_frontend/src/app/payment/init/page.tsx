"use client";

import { useState, useEffect } from "react";
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

export default function FarotyPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interventionId = searchParams.get("interventionId");
  const amount = searchParams.get("amount") || "20";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState<PaymentTokenResponse | null>(null);

  useEffect(() => {
    if (interventionId) {
      initializePayment();
    } else {
      setError("ID d'intervention manquant");
      setLoading(false);
    }
  }, [interventionId]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Appeler notre API route pour obtenir le token Faroty
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interventionId: parseInt(interventionId!),
          amount: parseFloat(amount)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPaymentData(data);
        
        // Stocker le token Faroty localement pour la session de paiement
        localStorage.setItem("farotyToken", data.farotyToken);
        localStorage.setItem("farotyWalletId", data.walletId);
        
        // Rediriger vers la page de paiement Faroty après 2 secondes
        setTimeout(() => {
          window.location.href = data.sessionUrl;
        }, 2000);
        
      } else {
        setError(data.error || "Erreur lors de l'initialisation du paiement");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToInterventions = () => {
    router.push("/dashboard/client/interventions");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-600 font-medium">Initialisation du paiement...</p>
          <p className="text-sm text-gray-500 mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <main className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur de paiement
            </h1>

            <p className="text-gray-600 mb-8">
              {error}
            </p>

            <div className="space-y-4">
              <button
                onClick={initializePayment}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
              >
                Réessayer
              </button>
              
              <button
                onClick={handleGoToInterventions}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Logo Faroty */}
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-bold">F</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Préparation du paiement
          </h1>

          <p className="text-gray-600 mb-8">
            Nous préparons votre session de paiement sécurisée avec Faroty. Vous allez être redirigé dans quelques instants...
          </p>

          {/* Informations de paiement */}
          {paymentData && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de la transaction</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Intervention:</span>
                  <span className="font-medium">#{paymentData.interventionId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-medium">{paymentData.amount} XAF</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet ID:</span>
                  <span className="font-medium text-sm">{paymentData.walletId.substring(0, 8)}...</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Session:</span>
                  <span className="font-medium text-sm">{paymentData.sessionToken.substring(0, 8)}...</span>
                </div>
              </div>
            </div>
          )}

          {/* Animation de chargement */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>

          <p className="text-sm text-gray-500">
            Redirection vers la page de paiement Faroty...
          </p>

          <p className="text-xs text-gray-400 mt-4">
            Ne fermez pas cette page pendant la redirection
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
