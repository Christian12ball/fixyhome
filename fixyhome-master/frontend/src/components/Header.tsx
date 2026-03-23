'use client';

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { profiles, currentProfile, switchProfile, switchProfileWithAuth } = useProfile();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const getUserRoleLabel = (userType: string) => {
    switch (userType) {
      case 'CLIENT': return 'Client';
      case 'ARTISAN': return 'Artisan';
      default: return userType;
    }
  };

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
        setShowProfileMenu(false);
        
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

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center">
            <img 
              src="/fixyhome-logo.svg" 
              alt="FixyHome - Votre artisan, juste à côté" 
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/directory" className="text-gray-700 hover:text-blue-600 transition-colors">
              Annuaire
            </Link>
            <Link href="/#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
              Comment ça marche
            </Link>
            
            {isLoading ? (
              <div className="text-gray-500">Chargement...</div>
            ) : isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-4 border-l border-gray-300 pl-8">
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                        </span>
                      </div>
                      <div className="text-sm text-left">
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-gray-500">
                          {getUserRoleLabel(user.userType)}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">Profil actuel</h3>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600">
                                {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                                {getUserRoleLabel(user.userType)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {profiles.filter(p => p.createdBy === currentProfile?.id).length > 1 && (
                          <div className="p-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Autres profils</h3>
                            <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                              {profiles
                                .filter(p => p.id !== currentProfile?.id && p.createdBy === currentProfile?.id)
                                .map((profile) => (
                                  <button
                                    key={profile.id}
                                    onClick={() => handleSwitchProfile(profile.id)}
                                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
                                  >
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-600">
                                        {profile.firstName?.charAt(0) || ''}{profile.lastName?.charAt(0) || ''}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {profile.profileName}
                                      </p>
                                      <p className="text-xs text-gray-500">{profile.email}</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                      {getUserRoleLabel(profile.userType)}
                                    </span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}

                        <div className="p-2">
                          <Link
                            href="/profiles"
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            Gérer les profils
                          </Link>
                          <Link
                            href={user.userType === 'ARTISAN' ? '/dashboard/artisan' : '' + (user.userType === 'CLIENT' ? '/dashboard' : '') + (user.userType === 'ADMIN' ? '/admin/dashboard' : '')}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            Mon tableau de bord
                          </Link>
                          <Link
                            href="/profile"
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            Mon profil
                          </Link>
                          <hr className="my-2" />
                          <button
                            onClick={() => {
                              logout();
                              setShowProfileMenu(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Mon tableau de bord
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

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
    </header>
  );
}
