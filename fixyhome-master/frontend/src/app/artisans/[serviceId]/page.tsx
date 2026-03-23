'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

interface Artisan {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName?: string;
  description: string;
  services: string[];
  rating: number;
  reviewCount: number;
  avatar?: string;
  verified: boolean;
  location: string;
  experience: number;
  responseTime: string;
  hourlyRate?: number;
}

const mockArtisans: { [key: string]: Artisan[] } = {
  plumbing: [
    {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '06 12 34 56 78',
      businessName: 'Plomberie Dupont',
      description: 'Artisan plombier avec 15 ans d\'expérience dans le dépannage et l\'installation. Spécialiste en chauffage et sanitaires.',
      services: ['Débouchage', 'Installation sanitaires', 'Chauffe-eau', 'Réparation fuites'],
      rating: 4.8,
      reviewCount: 47,
      verified: true,
      location: 'Le Havre',
      experience: 15,
      responseTime: '30 min',
      hourlyRate: 45
    },
    {
      id: '2',
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@email.com',
      phone: '06 23 45 67 89',
      businessName: 'Martin Plomberie',
      description: 'Plombier qualifié, intervention rapide 24/7. Expert en rénovation et dépannage d\'urgence.',
      services: ['Dépannage urgence', 'Rénovation salle de bain', 'Chauffage', 'VMC'],
      rating: 4.9,
      reviewCount: 63,
      verified: true,
      location: 'Le Havre',
      experience: 12,
      responseTime: '15 min',
      hourlyRate: 50
    },
    {
      id: '3',
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@email.com',
      phone: '06 34 56 78 90',
      businessName: 'Bernard Artisan',
      description: 'Plombier polyvalent, spécialisé dans les installations neuves et la maintenance préventive.',
      services: ['Installation neuve', 'Maintenance', 'Diagnostic', 'Mise aux normes'],
      rating: 4.6,
      reviewCount: 28,
      verified: true,
      location: 'Le Havre',
      experience: 8,
      responseTime: '1h',
      hourlyRate: 40
    }
  ],
  electricity: [
    {
      id: '4',
      firstName: 'Thomas',
      lastName: 'Petit',
      email: 'thomas.petit@email.com',
      phone: '06 45 67 89 01',
      businessName: 'Électricité Pro',
      description: 'Électricien certifié, spécialiste en mise aux normes et installations domotiques.',
      services: ['Mise aux normes', 'Tableau électrique', 'Domotique', 'Éclairage'],
      rating: 4.7,
      reviewCount: 35,
      verified: true,
      location: 'Le Havre',
      experience: 10,
      responseTime: '45 min',
      hourlyRate: 55
    },
    {
      id: '5',
      firstName: 'Sophie',
      lastName: 'Leroy',
      email: 'sophie.leroy@email.com',
      phone: '06 56 78 90 12',
      businessName: 'Leroy Électricité',
      description: 'Électricienne professionnelle, experte en rénovation énergétique et installations solaires.',
      services: ['Rénovation énergétique', 'Solaire', 'Prises et interrupteurs', 'Dépannage'],
      rating: 4.9,
      reviewCount: 52,
      verified: true,
      location: 'Le Havre',
      experience: 14,
      responseTime: '30 min',
      hourlyRate: 60
    }
  ],
  cleaning: [
    {
      id: '6',
      firstName: 'Isabelle',
      lastName: 'Moreau',
      email: 'isabelle.moreau@email.com',
      phone: '06 67 89 01 23',
      businessName: 'Nettoyage Plus',
      description: 'Service de nettoyage professionnel, spécialisé en ménage régulier et grand nettoyage.',
      services: ['Ménage régulier', 'Grand nettoyage', 'Nettoyage vitres', 'Repassage'],
      rating: 4.8,
      reviewCount: 89,
      verified: true,
      location: 'Le Havre',
      experience: 6,
      responseTime: '2h',
      hourlyRate: 25
    },
    {
      id: '7',
      firstName: 'Claude',
      lastName: 'Dubois',
      email: 'claude.dubois@email.com',
      phone: '06 78 90 12 34',
      businessName: 'Propreté Services',
      description: 'Entreprise de nettoyage complète, solutions sur mesure pour particuliers et professionnels.',
      services: ['Bureaux', 'Particuliers', 'Après chantier', 'Fenêtres'],
      rating: 4.7,
      reviewCount: 41,
      verified: true,
      location: 'Le Havre',
      experience: 9,
      responseTime: '1h',
      hourlyRate: 30
    }
  ]
};

const serviceInfo: { [key: string]: { title: string; icon: string; description: string } } = {
  plumbing: {
    title: 'Plomberie',
    icon: '🔧',
    description: 'Installation, dépannage, entretien de vos installations sanitaires'
  },
  electricity: {
    title: 'Électricité',
    icon: '⚡',
    description: 'Mise aux normes, dépannage, installation électrique complète'
  },
  cleaning: {
    title: 'Ménage',
    icon: '🧹',
    description: 'Entretien régulier, grand nettoyage, services sur mesure'
  }
};

// Obtenir les informations du service ou utiliser des valeurs par défaut
const getServiceInfo = (serviceId: string) => {
  return serviceInfo[serviceId] || {
    title: serviceId.charAt(0).toUpperCase() + serviceId.slice(1),
    icon: '🔧',
    description: 'Services professionnels pour ' + serviceId
  };
};

export default function ArtisansPage() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'response'>('rating');
  const service = getServiceInfo(serviceId);

  useEffect(() => {
    fetchArtisans();
  }, [serviceId]);

  const fetchArtisans = async () => {
    try {
      // Utiliser l'endpoint public pour les artisans
      const response = await fetch(`http://localhost:8080/api/users/public/artisans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transformer les données du backend pour correspondre à l'interface
        const transformedArtisans = data.map((artisan: any) => ({
          id: artisan.id.toString(),
          firstName: artisan.firstName || '',
          lastName: artisan.lastName || '',
          email: artisan.email || '',
          phone: artisan.phone || '',
          businessName: artisan.artisan?.description || '',
          description: artisan.artisan?.description || '',
          services: [],
          rating: artisan.artisan?.rating || 0,
          reviewCount: artisan.artisan?.reviewCount || 0,
          avatar: '',
          verified: artisan.artisan?.isVerified || false,
          location: artisan.artisan?.location || '',
          experience: artisan.artisan?.experience || 0,
          responseTime: '30 min',
          hourlyRate: artisan.artisan?.hourlyRate || 0,
          category: artisan.artisan?.category?.label || 'Non spécifiée'
        }));
        setArtisans(transformedArtisans);
      } else {
        console.error('Erreur lors du chargement des artisans:', response.status);
        setArtisans([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des artisans:', error);
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedArtisans = [...artisans].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      case 'response':
        return parseInt(a.responseTime) - parseInt(b.responseTime);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const serviceData = serviceInfo[serviceId];

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service non trouvé</h1>
          <p className="text-gray-600 mb-8">Ce service n'existe pas ou n'est pas encore disponible.</p>
          <Link href="/services" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Retour aux services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header />

      {/* Header Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Link href="/services" className="text-blue-600 hover:text-blue-500 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux services
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">{service.icon}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Artisans {service.title}
              </h1>
              <p className="text-gray-600 mt-1">{service.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {artisans.length} artisans disponibles
              </h2>
              <p className="text-gray-600">Triés par : {sortBy === 'rating' ? 'Note' : sortBy === 'price' ? 'Prix' : 'Temps de réponse'}</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setSortBy('rating')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'rating'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Note
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'price'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Prix
              </button>
              <button
                onClick={() => setSortBy('response')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'response'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Disponibilité
              </button>
            </div>
          </div>

          {/* Artisans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedArtisans.map((artisan) => (
              <div key={artisan.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600">
                          {artisan.firstName.charAt(0)}{artisan.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {artisan.firstName} {artisan.lastName}
                        </h3>
                        {artisan.businessName && (
                          <p className="text-sm text-gray-600">{artisan.businessName}</p>
                        )}
                      </div>
                    </div>
                    {artisan.verified && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {artisan.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {artisan.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {artisan.responseTime} de réponse
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {artisan.experience} ans d'expérience
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {artisan.rating} ({artisan.reviewCount})
                      </span>
                    </div>
                    {artisan.hourlyRate && (
                      <span className="text-lg font-semibold text-blue-600">
                        {artisan.hourlyRate}€/h
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {artisan.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {service}
                      </span>
                    ))}
                    {artisan.services.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{artisan.services.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Contacter
                    </button>
                    <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      Voir profil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {artisans.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun artisan disponible</h3>
              <p className="text-gray-600 mb-4">
                Il n'y a pas encore d'artisan pour ce service dans votre région.
              </p>
              <Link href="/services" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Voir d'autres services
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
