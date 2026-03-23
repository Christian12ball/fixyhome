"use client";

import { useState, useEffect } from "react";

interface SettingsProps {
  token: string;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  features: {
    enableRegistration: boolean;
    enableReviews: boolean;
    enableNotifications: boolean;
    maintenanceMode: boolean;
  };
  limits: {
    maxRequestsPerDay: number;
    maxArtisansPerRequest: number;
    minRatingThreshold: number;
  };
}

export default function SettingsManagement({ token }: SettingsProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "FixyHome",
    siteDescription: "Plateforme de mise en relation entre clients et artisans",
    contactEmail: "contact@fixyhome.com",
    contactPhone: "+33 1 23 45 67 89",
    address: "123 Rue de la République, 75001 Paris",
    socialMedia: {
      facebook: "https://facebook.com/fixyhome",
      twitter: "https://twitter.com/fixyhome",
      instagram: "https://instagram.com/fixyhome",
      linkedin: "https://linkedin.com/company/fixyhome"
    },
    features: {
      enableRegistration: true,
      enableReviews: true,
      enableNotifications: true,
      maintenanceMode: false
    },
    limits: {
      maxRequestsPerDay: 5,
      maxArtisansPerRequest: 10,
      minRatingThreshold: 3.0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès' });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const resetSettings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/settings/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchSettings();
        setMessage({ type: 'success', text: 'Paramètres réinitialisés avec succès' });
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la réinitialisation' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* En-tête */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Paramètres du Site</h2>
            <p className="text-sm text-gray-600">Configurez les paramètres généraux de la plateforme</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={resetSettings}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>

      {/* Paramètres généraux */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Informations Générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description du site</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Réseaux Sociaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <input
              type="url"
              value={settings.socialMedia.facebook}
              onChange={(e) => setSettings({
                ...settings, 
                socialMedia: {...settings.socialMedia, facebook: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
            <input
              type="url"
              value={settings.socialMedia.twitter}
              onChange={(e) => setSettings({
                ...settings, 
                socialMedia: {...settings.socialMedia, twitter: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input
              type="url"
              value={settings.socialMedia.instagram}
              onChange={(e) => setSettings({
                ...settings, 
                socialMedia: {...settings.socialMedia, instagram: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="url"
              value={settings.socialMedia.linkedin}
              onChange={(e) => setSettings({
                ...settings, 
                socialMedia: {...settings.socialMedia, linkedin: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Fonctionnalités */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Fonctionnalités</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.features.enableRegistration}
              onChange={(e) => setSettings({
                ...settings, 
                features: {...settings.features, enableRegistration: e.target.checked}
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">Activer l'inscription des nouveaux utilisateurs</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.features.enableReviews}
              onChange={(e) => setSettings({
                ...settings, 
                features: {...settings.features, enableReviews: e.target.checked}
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">Activer le système d'avis</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.features.enableNotifications}
              onChange={(e) => setSettings({
                ...settings, 
                features: {...settings.features, enableNotifications: e.target.checked}
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">Activer les notifications par email</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.features.maintenanceMode}
              onChange={(e) => setSettings({
                ...settings, 
                features: {...settings.features, maintenanceMode: e.target.checked}
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">Mode maintenance (désactive le site pour les utilisateurs)</span>
          </label>
        </div>
      </div>

      {/* Limites et restrictions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Limites et Restrictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max demandes par jour (par utilisateur)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={settings.limits.maxRequestsPerDay}
              onChange={(e) => setSettings({
                ...settings, 
                limits: {...settings.limits, maxRequestsPerDay: parseInt(e.target.value)}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max artisans par demande
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={settings.limits.maxArtisansPerRequest}
              onChange={(e) => setSettings({
                ...settings, 
                limits: {...settings.limits, maxArtisansPerRequest: parseInt(e.target.value)}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note minimale requise
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={settings.limits.minRatingThreshold}
              onChange={(e) => setSettings({
                ...settings, 
                limits: {...settings.limits, minRatingThreshold: parseFloat(e.target.value)}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
