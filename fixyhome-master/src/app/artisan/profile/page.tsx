"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
}

interface ArtisanProfile {
  id: string;
  category: string;
  description: string;
  experience: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  hourlyRate?: number;
}

export default function ArtisanProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [artisanProfile, setArtisanProfile] = useState<ArtisanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState({
    description: '',
    experience: 0,
    hourlyRate: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserData(token);
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        if (userData.userType !== 'ARTISAN') {
          setMessage('Cette page est réservée aux artisans');
          setMessageType('error');
          router.push('/dashboard');
          return;
        }
        
        // Récupérer le profil artisan
        fetchArtisanProfile(token, userData.id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setMessage('Erreur lors du chargement du profil');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtisanProfile = async (token: string, userId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/artisans/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const profileData = await response.json();
        setArtisanProfile(profileData);
        setFormData({
          description: profileData.description || '',
          experience: profileData.experience || 0,
          hourlyRate: profileData.hourlyRate || 0,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil artisan:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    
    if (!token || !artisanProfile) return;

    try {
      const response = await fetch(`http://localhost:8080/api/artisans/${artisanProfile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const updatedProfile = await response.json();
        setArtisanProfile(updatedProfile);
        setEditing(false);
        setMessage('Profil artisan mis à jour avec succès');
        setMessageType('success');
      } else {
        setMessage('Erreur lors de la mise à jour du profil');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setMessage('Erreur lors de la mise à jour du profil');
      setMessageType('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' || name === 'hourlyRate' ? parseInt(value) || 0 : value
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PLUMBING': return '🔧';
      case 'ELECTRICITY': return '⚡';
      case 'CLEANING': return '🧹';
      default: return '🔨';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'PLUMBING': return 'Plomberie';
      case 'ELECTRICITY': return 'Électricité';
      case 'CLEANING': return 'Ménage';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !artisanProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Profil non trouvé</p>
          <Link href="/dashboard" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4 inline-block"
          >
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Mon profil artisan
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos informations professionnelles et votre visibilité
          </p>
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

        <div className="grid md:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="md:col-span-2 space-y-6">
            {/* Profil professionnel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Profil professionnel</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Modifier
                  </button>
                )}
              </div>
              
              <div className="p-6">
                {editing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                          Description professionnelle
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Décrivez votre expertise, vos services, votre expérience..."
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                            Années d'expérience
                          </label>
                          <input
                            type="number"
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                            Taux horaire (€)
                          </label>
                          <input
                            type="number"
                            id="hourlyRate"
                            name="hourlyRate"
                            value={formData.hourlyRate}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          if (artisanProfile) {
                            setFormData({
                              description: artisanProfile.description || '',
                              experience: artisanProfile.experience || 0,
                              hourlyRate: artisanProfile.hourlyRate || 0,
                            });
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Catégorie</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-2xl">{getCategoryIcon(artisanProfile.category)}</span>
                        <span className="font-medium">{getCategoryName(artisanProfile.category)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="mt-1">{artisanProfile.description || 'Non renseignée'}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Expérience</p>
                        <p className="font-medium">{artisanProfile.experience} ans</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Taux horaire</p>
                        <p className="font-medium">{artisanProfile.hourlyRate ? `${artisanProfile.hourlyRate}€/h` : 'Non spécifié'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Statut</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            artisanProfile.isVerified ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          <span className="font-medium">
                            {artisanProfile.isVerified ? 'Vérifié' : 'En attente de vérification'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Mes statistiques</h2>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {artisanProfile.rating.toFixed(1)}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">Note moyenne</div>
                    <div className="text-yellow-400 mt-2">
                      {'★'.repeat(Math.round(artisanProfile.rating))}
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {artisanProfile.reviewCount}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">Avis reçus</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link
                  href="/artisan/requests"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Voir les demandes
                </Link>
                <Link
                  href="/artisan/interventions"
                  className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Mes interventions
                </Link>
                <Link
                  href="/artisan/availability"
                  className="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Gérer mes disponibilités
                </Link>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">Informations personnelles</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Nom complet</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Téléphone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              <Link
                href="/profile"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Modifier mes informations →
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
