'use client';

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

interface Review {
  id: number;
  clientId: number;
  artisanId: number;
  rating: number;
  comment: string;
  createdAt: string;
  clientName: string;
  artisanName: string;
  serviceType: string;
}

interface ServiceCategory {
  id: number;
  name: string;
  label: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
}

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    fetchReviews();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/services/public/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        mode: 'cors'
      });
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            // Ensure all categories have the required isActive property
            const processedData = Array.isArray(data) ? data.map(cat => ({
              ...cat,
              isActive: cat.isActive !== undefined ? cat.isActive : true
            })) : [];
            setCategories(processedData);
          } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            setCategories(getDefaultCategories());
          }
        } else {
          console.error('Réponse non-JSON reçue:', contentType);
          setCategories(getDefaultCategories());
        }
      } else {
        console.error('Erreur lors du chargement des catégories:', response.status, response.statusText);
        setCategories(getDefaultCategories());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      setCategories(getDefaultCategories());
    } finally {
      setIsLoadingCategories(false);
    }
  };

const getDefaultCategories = () => [
  { id: 1, name: 'plumbing', label: 'Plomberie', description: 'Services de plomberie', iconUrl: '🔧', isActive: true },
  { id: 2, name: 'electricity', label: 'Électricité', description: 'Services électriques', iconUrl: '⚡', isActive: true },
  { id: 3, name: 'cleaning', label: 'Ménage', description: 'Services de nettoyage', iconUrl: '🧹', isActive: true },
  { id: 4, name: 'gardening', label: 'Jardinage', description: 'Services de jardinage', iconUrl: '🌿', isActive: true },
  { id: 5, name: 'painting', label: 'Peinture', description: 'Services de peinture', iconUrl: '🎨', isActive: true },
  { id: 6, name: 'carpentry', label: 'Menuiserie', description: 'Services de menuiserie', iconUrl: '🔨', isActive: true },
  { id: 7, name: 'hvac', label: 'Climatisation', description: 'Services de climatisation', iconUrl: '❄️', isActive: true },
  { id: 8, name: 'roofing', label: 'Couverture', description: 'Services de couverture', iconUrl: '🏠', isActive: true },
  { id: 9, name: 'moving', label: 'Déménagement', description: 'Services de déménagement', iconUrl: '🚚', isActive: true },
  { id: 10, name: 'security', label: 'Sécurité', description: 'Services de sécurité', iconUrl: '🔒', isActive: true }
];

  const fetchReviews = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        mode: 'cors'
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            setReviews(Array.isArray(data) ? data : []);
            setTotalPages(Math.ceil((Array.isArray(data) ? data : []).length / reviewsPerPage));
          } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            setReviews(getDefaultReviews());
            setTotalPages(Math.ceil(getDefaultReviews().length / reviewsPerPage));
          }
        } else {
          console.error('Réponse non-JSON reçue:', contentType);
          setReviews(getDefaultReviews());
          setTotalPages(Math.ceil(getDefaultReviews().length / reviewsPerPage));
        }
      } else {
        console.error('Erreur lors du chargement des avis:', response.status, response.statusText);
        setReviews(getDefaultReviews());
        setTotalPages(Math.ceil(getDefaultReviews().length / reviewsPerPage));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      // Set empty reviews array to prevent UI issues
      setReviews(getDefaultReviews());
      setTotalPages(Math.ceil(getDefaultReviews().length / reviewsPerPage));
    } finally {
      setIsLoadingReviews(false);
    }
  };

const getDefaultReviews = () => [
  {
    id: 1,
    clientId: 1,
    artisanId: 1,
    rating: 5,
    comment: "Excellent service ! L'artisan est arrivé à l'heure, a fait un travail impeccable et le prix était très raisonnable. Je recommande vivement !",
    createdAt: new Date().toISOString(),
    clientName: "Marie Dupont",
    artisanName: "Jean Martin",
    serviceType: "Service de plomberie"
  },
  {
    id: 2,
    clientId: 2,
    artisanId: 2,
    rating: 5,
    comment: "Plateforme très pratique pour trouver rapidement un artisan qualifié. La mise en relation est simple et efficace. Super expérience !",
    createdAt: new Date().toISOString(),
    clientName: "Jean Martin",
    artisanName: "Sophie Bernard",
    serviceType: "Service d'électricité"
  },
  {
    id: 3,
    clientId: 3,
    artisanId: 3,
    rating: 5,
    comment: "Très satisfait du service de ménage. L'équipe est professionnelle, ponctuelle et le résultat est parfait. Je ferai appel à eux encore !",
    createdAt: new Date().toISOString(),
    clientName: "Sophie Bernard",
    artisanName: "Marie Dupont",
    serviceType: "Service de ménage"
  }
];

  const getCurrentPageReviews = () => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return reviews.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'fill-current' : 'fill-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <Header />
      
      {/* Hero Section Spectaculaire */}
      <section className="relative py-24 overflow-hidden">
        {/* Background décoratif */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                🏠 La plateforme N°1 pour trouver votre artisan
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Trouvez votre artisan
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                de confiance
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Connectez-vous avec des professionnels vérifiés et qualifiés pour tous vos projets de rénovation, 
              d'entretien et de construction. Disponibles 24/7 pour répondre à vos besoins.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link 
                href="/services" 
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <span className="mr-2">🔍</span>
                Je cherche un service
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/directory" 
                className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="mr-2">👥</span>
                Voir l'annuaire
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/register/pro" 
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <span className="mr-2">👨‍🔧</span>
                Je suis un artisan
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques Impressionnantes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Artisans vérifiés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">10k+</div>
              <div className="text-gray-600 font-medium">Projets réalisés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">4.8★</div>
              <div className="text-gray-600 font-medium">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section Premium */}
      <section id="services" className="py-24 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
              🛠️ Services disponibles ({categories.length})
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tous les services
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> dont vous avez besoin</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des professionnels vérifiés et expérimentés pour tous vos projets de rénovation et d'entretien
            </p>
          </div>
          
          {isLoadingCategories ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 rounded-2xl mx-auto mb-6"></div>
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-16 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.slice(0, 8).map((category) => (
                <div key={category.id} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    {category.iconUrl ? (
                      <span className="text-3xl">{category.iconUrl}</span>
                    ) : (
                      <span className="text-3xl">🔧</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{category.label}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 cursor-pointer" onClick={() => window.location.href = `/services?category=${category.name}`}>
                    <span>Découvrir</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune catégorie disponible</h3>
              <p className="text-gray-600">Veuillez réessayer plus tard</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <span className="mr-2">🔍</span>
              Voir tous les services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works Premium */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              🚀 Processus simple
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comment ça
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> marche</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme conçue pour vous simplifier la vie, du premier clic à la réalisation de votre projet
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Décrivez votre besoin</h3>
                <p className="text-gray-600">Précisez le service souhaité, votre localisation et vos préférences</p>
              </div>
              <div className="hidden md:block absolute top-8 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                →
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Recevez des devis</h3>
                <p className="text-gray-600">Les artisans qualifiés vous proposent leurs prestations rapidement</p>
              </div>
              <div className="hidden md:block absolute top-8 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                →
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Choisissez votre artisan</h3>
                <p className="text-gray-600">Comparez les avis, tarifs et disponibilités pour faire le bon choix</p>
              </div>
              <div className="hidden md:block absolute top-8 right-0 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                →
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Payez en toute sécurité</h3>
                <p className="text-gray-600">Paiement sécurisé et libération du fonds après validation du travail</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services/request" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <span className="mr-2">🚀</span>
              Commencer maintenant
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Avis Clients */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-4">
              ⭐ Avis clients ({reviews.length})
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ce que nos clients
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> disent de nous</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les témoignages authentiques de {reviews.length} clients satisfaits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {isLoadingReviews ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="animate-pulse">
                      <div className="flex items-center mb-4">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, j) => (
                            <div key={j} className="w-5 h-5 bg-gray-300 rounded"></div>
                          ))}
                        </div>
                        <div className="ml-2 w-8 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className="h-20 bg-gray-300 rounded mb-6"></div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="ml-4">
                          <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="w-32 h-3 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : reviews.length === 0 ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-center mb-4">
                      {renderStars(5)}
                      <span className="ml-2 text-gray-600 font-medium">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-6 italic">
                      {i === 1 && '"Excellent service ! L\'artisan est arrivé à l\'heure, a fait un travail impeccable et le prix était très raisonnable. Je recommande vivement !"'}
                      {i === 2 && '"Plateforme très pratique pour trouver rapidement un artisan qualifié. La mise en relation est simple et efficace. Super expérience !"'}
                      {i === 3 && '"Très satisfait du service de ménage. L\'équipe est professionnelle, ponctuelle et le résultat est parfait. Je ferai appel à eux encore !"'}
                    </p>
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        i === 1 ? 'bg-gradient-to-br from-blue-500 to-purple-500' :
                        i === 2 ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                        'bg-gradient-to-br from-amber-500 to-orange-500'
                      }`}>
                        {i === 1 ? 'M' : i === 2 ? 'J' : 'S'}
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-gray-900">
                          {i === 1 ? 'Marie Dupont' : i === 2 ? 'Jean Martin' : 'Sophie Bernard'}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {i === 1 ? 'Service de plomberie' : i === 2 ? 'Service d\'électricité' : 'Service de ménage'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              getCurrentPageReviews().map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-4">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-gray-600 font-medium">{review.rating}.0</span>
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.clientName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900">{review.clientName}</div>
                      <div className="text-gray-600 text-sm">{review.serviceType}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {reviews.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mb-12">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Précédent
              </button>
              
              <div className="flex items-center space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Suivant
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Formulaire d'ajout d'avis */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Vous avez utilisé nos services ?</h3>
            <p className="text-xl mb-8 opacity-90">Partagez votre expérience et aidez d'autres clients à faire le bon choix</p>
            <button 
              onClick={() => window.location.href = '/review'}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <span className="mr-2">⭐</span>
              Laisser un avis
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
