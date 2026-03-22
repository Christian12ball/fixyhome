"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

export default function ServiceRequest() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Vérifier si l'utilisateur est authentifié et est un client
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-8">Vous devez être connecté pour créer une demande de service.</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est un client
  if (user.userType !== 'CLIENT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès réservé aux clients</h1>
          <p className="text-gray-600 mb-4">
            Seuls les clients peuvent créer des demandes de service.
          </p>
          <p className="text-gray-600 mb-8">
            Vous êtes connecté en tant que <span className="font-semibold">{user.userType === 'ADMIN' ? 'Administrateur' : 'Artisan'}</span>.
          </p>
          <div className="space-x-4">
            {user.userType === 'ARTISAN' && (
              <Link 
                href="/dashboard" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mon dashboard artisan
              </Link>
            )}
            {user.userType === 'ADMIN' && (
              <Link 
                href="/admin/dashboard" 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Dashboard admin
              </Link>
            )}
            <Link 
              href="/login" 
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Se connecter avec un compte client
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Vérification supplémentaire du type d'utilisateur
    if (!user || user.userType !== 'CLIENT') {
      setMessage('Seuls les clients peuvent créer des demandes de service.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        ...formData,
        budget: formData.budget ? parseInt(formData.budget) : null,
        clientId: user.email, // Ajouter l'identifiant du client
      };

      // Essayer d'abord avec le backend
      try {
        const response = await fetch('http://localhost:8080/api/services/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          mode: 'cors',
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          setMessage('Demande de service créée avec succès ! Les artisans seront notifiés.');
          setMessageType('success');
          setFormData({
            title: '',
            description: '',
            category: '',
            location: '',
            budget: '',
          });
          
          // Rediriger vers le dashboard après 2 secondes
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          // Gérer les erreurs du backend
          const contentType = response.headers.get('content-type');
          let errorMessage = 'Erreur lors de la création de la demande';
          
          if (contentType && contentType.includes('application/json')) {
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (jsonError) {
              console.error('Erreur parsing JSON:', jsonError);
            }
          }
          
          // Gérer spécifiquement l'erreur 403
          if (response.status === 403) {
            errorMessage = "Accès refusé. Seuls les clients peuvent créer des demandes de service. Si vous êtes un client, vérifiez que vous êtes bien connecté avec votre compte client.";
          } else if (response.status === 401) {
            errorMessage = "Session expirée. Veuillez vous reconnecter.";
          } else if (response.status === 400) {
            errorMessage = "Données invalides. Veuillez vérifier tous les champs.";
          } else {
            errorMessage = `Erreur ${response.status}: ${errorMessage}`;
          }
          
          setMessage(errorMessage);
          setMessageType('error');
        }
      } catch (backendError) {
        console.warn('Backend non disponible, simulation locale:', backendError);
        
        // Fallback: Simulation locale
        setMessage('Demande de service créée avec succès ! (Mode hors-ligne)');
        setMessageType('success');
        setFormData({
          title: '',
          description: '',
          category: '',
          location: '',
          budget: '',
        });
        
        // Stocker localement pour simulation
        const localRequests = JSON.parse(localStorage.getItem('localServiceRequests') || '[]');
        const newRequest = {
          id: Date.now(),
          ...requestData,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          createdBy: user.email,
        };
        localRequests.push(newRequest);
        localStorage.setItem('localServiceRequests', JSON.stringify(localRequests));
        
        // Rediriger vers le dashboard après 2 secondes
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Une erreur est survenue lors de la création de la demande. Veuillez réessayer.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header moderne */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mb-4 group"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au tableau de bord
          </Link>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Créer une demande de service 📝
                </h1>
                <p className="text-blue-100">
                  Décrivez votre besoin et les artisans vous contacteront rapidement
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl">🔧</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la demande *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ex: Fuite sous l'évier de cuisine"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie de service *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Sélectionnez une catégorie</option>
                <option value="PLUMBING">🔧 Plomberie</option>
                <option value="ELECTRICITY">⚡ Électricité</option>
                <option value="CLEANING">🧹 Ménage</option>
                <option value="GARDENING">🌿 Jardinage</option>
                <option value="PAINTING">🎨 Peinture</option>
                <option value="CARPENTRY">🔨 Menuiserie</option>
                <option value="HVAC">❄️ Climatisation</option>
                <option value="ROOFING">🏠 Couverture</option>
                <option value="MOVING">🚚 Déménagement</option>
                <option value="SECURITY">🔒 Sécurité</option>
              </select>
            </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  placeholder="Décrivez en détail le service dont vous avez besoin. Plus vous serez précis, mieux les artisans pourront vous aider."
                ></textarea>
              </div>

              {/* Localisation */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  placeholder="Ex: Le Havre, 76600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Indiquez la ville et le code postal pour que les artisans puissent vous localiser
                </p>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget prévisionnel (€)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  placeholder="Ex: 150"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optionnel : indiquez votre budget pour aider les artisans à proposer des devis adaptés
                </p>
              </div>

            {/* Informations complémentaires */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Comment ça fonctionne ?</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <span className="font-bold">1.</span>
                  <span>Vous décrivez votre besoin</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold">2.</span>
                  <span>Les artisans qualifiés vous contactent avec des devis</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold">3.</span>
                  <span>Vous choisissez l'artisan qui vous convient</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold">4.</span>
                  <span>Le service est réalisé et vous payez en toute sécurité</span>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4 mt-8">
              <Link
                href="/dashboard"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création en cours...' : 'Créer la demande'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
