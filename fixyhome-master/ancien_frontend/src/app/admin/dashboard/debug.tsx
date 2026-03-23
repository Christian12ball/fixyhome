"use client";

import { useEffect, useState } from "react";

export default function DebugDashboard() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Récupérer toutes les informations de debug
    const token = localStorage.getItem('token');
    const profiles = localStorage.getItem('profiles');
    const currentProfile = localStorage.getItem('currentProfile');
    
    setDebugInfo({
      token: token ? token.substring(0, 50) + '...' : 'none',
      tokenExists: !!token,
      profiles: profiles ? JSON.parse(profiles) : [],
      currentProfile: currentProfile ? JSON.parse(currentProfile) : null,
      localStorageKeys: Object.keys(localStorage),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Debug Dashboard Admin</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations d'authentification</h2>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions de test</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) {
                  console.log('Token trouvé:', token.substring(0, 50));
                } else {
                  console.log('Aucun token trouvé');
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tester le token
            </button>
            
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Clear localStorage et retour login
            </button>
            
            <button
              onClick={() => {
                window.location.href = '/login';
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Aller à login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
