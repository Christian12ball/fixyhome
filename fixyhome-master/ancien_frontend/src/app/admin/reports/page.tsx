"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminNavigation from "@/components/AdminNavigation";
import ReportsManagement from "@/components/admin/ReportsManagement";

export default function AdminReportsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.userType !== 'ADMIN')) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.userType !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-8">Cette page est réservée aux administrateurs.</p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="ml-64">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Rapports et statistiques</h1>
            <p className="text-gray-600 mt-2">Consultez les rapports détaillés de la plateforme</p>
          </div>
          
          <ReportsManagement token={localStorage.getItem('token') || ''} />
        </main>
      </div>
    </div>
  );
}
