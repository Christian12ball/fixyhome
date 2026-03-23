"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

export default function ProfilesPage() {
  const { profiles, currentProfile, switchProfile, removeProfile, switchProfileWithAuth } = useProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Filtrer les profils pour n'afficher que ceux créés par l'utilisateur actuel
  const userProfiles = profiles.filter(profile => 
    profile.createdBy === currentProfile?.id
  );

  const handleSwitchProfile = (profileId: string) => {
    // Si c'est le profil actuel, ne rien faire
    if (currentProfile?.id === profileId) return;
    
    // Demander le mot de passe
    setShowPasswordModal(profileId);
    setPassword('');
    setAuthError('');
  };

  const handleSwitchWithAuth = async () => {
    if (!showPasswordModal) return;
    
    try {
      const success = await switchProfileWithAuth(showPasswordModal, password);
      if (success) {
        setShowPasswordModal(null);
        setPassword('');
        setAuthError('');
        
        // Rediriger vers le tableau de bord approprié
        const profile = profiles.find(p => p.id === showPasswordModal);
        if (profile) {
          window.location.href = profile.userType === 'ARTISAN' ? '/dashboard/artisan' : '/dashboard';
        }
      } else {
        setAuthError('Mot de passe incorrect');
      }
    } catch (error) {
      setAuthError('Erreur lors du changement de profil');
    }
  };

  const handleRemoveProfile = (profileId: string) => {
    removeProfile(profileId);
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'CLIENT': return 'Client';
      case 'ARTISAN': return 'Artisan';
      default: return userType;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'CLIENT': return 'bg-blue-100 text-blue-800';
      case 'ARTISAN': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Profils utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos différents comptes et passez facilement de l'un à l'autre
          </p>
        </div>

        {userProfiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun profil</h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore de compte enregistré. Créez un compte pour commencer.
            </p>
            <div className="flex space-x-4 justify-center">
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Créer un compte client
              </Link>
              <Link 
                href="/register/pro" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Créer un compte artisan
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {userProfiles.map((profile) => (
              <div
                key={profile.id}
                className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
                  currentProfile?.id === profile.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-600">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profile.profileName}
                      </h3>
                      <p className="text-gray-600">{profile.email}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(profile.userType)}`}>
                          {getUserTypeLabel(profile.userType)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Dernière connexion: {formatDate(profile.lastLogin)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {currentProfile?.id === profile.id ? (
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Actif
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSwitchProfile(profile.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Choisir ce profil
                      </button>
                    )}
                    
                    {userProfiles.filter(p => p.id !== currentProfile?.id).length > 0 && currentProfile?.id !== profile.id && (
                      <button
                        onClick={() => setShowDeleteConfirm(profile.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {showDeleteConfirm === profile.id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm mb-3">
                      Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleRemoveProfile(profile.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        )}

        {userProfiles.length > 0 && (
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ajouter un nouveau profil</h3>
            <p className="text-gray-600 mb-4">
              Vous pouvez ajouter plusieurs comptes pour tester différentes fonctionnalités.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Nouveau compte client
              </Link>
              <Link 
                href="/register/pro" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Nouveau compte artisan
              </Link>
            </div>
          </div>
        )}
      </main>
      
      {/* Modale de mot de passe pour changer de profil */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-96 max-w-md mx-4 transform transition-all">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Vérification requise
                </h3>
                <p className="text-sm text-gray-600">
                  Confirmez votre identité pour continuer
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compte sélectionné
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-gray-600">
                      {profiles.find(p => p.id === showPasswordModal)?.firstName?.charAt(0)}
                      {profiles.find(p => p.id === showPasswordModal)?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {profiles.find(p => p.id === showPasswordModal)?.profileName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {profiles.find(p => p.id === showPasswordModal)?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSwitchWithAuth()}
                autoFocus
              />
              {authError && (
                <div className="mt-3 flex items-center text-red-600 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {authError}
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSwitchWithAuth}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Confirmer l'accès
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(null);
                  setPassword('');
                  setAuthError('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
