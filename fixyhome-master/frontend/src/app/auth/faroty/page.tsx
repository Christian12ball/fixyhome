"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DeviceInfo {
  deviceId: string;
  deviceType: string;
  deviceModel: string;
  osName: string;
}

function FarotyAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interventionId = searchParams.get("interventionId");
  const amount = searchParams.get("amount") || "20";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  const handleFarotyAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simuler l'authentification Faroty
      const mockDeviceInfo: DeviceInfo = {
        deviceId: "device_" + Date.now(),
        deviceType: "mobile",
        deviceModel: "Mock Device",
        osName: "Mock OS"
      };

      setDeviceInfo(mockDeviceInfo);

      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Rediriger vers la page de paiement
      router.push(`/payment/init?intervention=${interventionId}&amount=${amount}`);
    } catch (err) {
      setError("Erreur lors de l'authentification Faroty");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/client/interventions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Authentification Faroty
            </h1>
            
            <p className="text-gray-600">
              Authentifiez-vous pour continuer avec le paiement sécurisé
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xs">!</span>
                </div>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Détails de la transaction</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant:</span>
                <span className="font-bold text-blue-600">{parseInt(amount).toLocaleString('fr-FR')} FCFA</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Référence:</span>
                <span className="font-medium">INT-{interventionId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Méthode:</span>
                <span className="font-medium">Faroty Wallet</span>
              </div>
            </div>
          </div>

          {deviceInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-green-900 mb-4">Appareil détecté</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Appareil:</span>
                  <span className="font-medium">{deviceInfo.deviceId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{deviceInfo.deviceType}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Modèle:</span>
                  <span className="font-medium">{deviceInfo.deviceModel}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Système:</span>
                  <span className="font-medium">{deviceInfo.osName}</span>
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
                <h3 className="font-medium text-yellow-900 mb-2">Sécurité</h3>
                <p className="text-yellow-800 text-sm">
                  Faroty utilise une authentification biométrique et multi-facteurs pour sécuriser vos transactions. 
                  Vos données sont chiffrées de bout en bout.
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
              onClick={handleFarotyAuth}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authentification...
                </div>
              ) : (
                "S'authentifier avec Faroty"
              )}
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function FarotyAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <FarotyAuthContent />
    </Suspense>
  );
}
