"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ServiceCategory {
  id: number;
  label: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
}

interface ServiceType {
  id: number;
  label: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
  category: ServiceCategory;
  artisanCount?: number;
}

interface Artisan {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  hourlyRate: number;
  experience: number;
  location: string;
  description: string;
  category?: ServiceCategory;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  
  const [service, setService] = useState<ServiceType | null>(null);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      // Récupérer les détails du service
      const serviceResponse = await fetch(`http://localhost:8080/api/services/public/category/${serviceId}`);
      if (serviceResponse.ok) {
        const serviceData = await serviceResponse.json();
        if (serviceData.length > 0) {
          // Prendre le premier service pour obtenir les infos de la catégorie
          const firstService = serviceData[0];
          setService({
            id: parseInt(serviceId),
            label: firstService.category?.label || "Service",
            description: firstService.category?.description || "Description du service",
            iconUrl: firstService.category?.iconUrl || "/icons/service.svg",
            isActive: true,
            category: firstService.category || {
              id: parseInt(serviceId),
              label: "Service",
              description: "Description",
              iconUrl: "/icons/service.svg",
              isActive: true
            }
          });

          // Récupérer les artisans pour cette catégorie
          const artisansResponse = await fetch(`http://localhost:8080/api/artisans/category/${serviceId}`);
          if (artisansResponse.ok) {
            const artisansData = await artisansResponse.json();
            setArtisans(artisansData);
          }
        } else {
          setError("Service non trouvé");
        }
      } else {
        setError("Erreur lors du chargement du service");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleArtisanProfileClick = (artisanId: number) => {
    router.push(`/artisan-profile/${artisanId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
            <p className="text-gray-600">{error || "Service non trouvé"}</p>
            <button 
              onClick={() => router.push('/services')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour aux services
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* En-tête du service */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">{service.iconUrl}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{service.label}</h1>
              <p className="text-gray-600 mt-1">{service.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {artisans.length} artisan{artisans.length > 1 ? 's' : ''} disponible{artisans.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Liste des artisans */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Artisans disponibles</h2>
          
          {artisans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">Aucun artisan disponible pour ce service actuellement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisans.map((artisan) => (
                <div key={artisan.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                  {/* Header de la carte */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {artisan.firstName.charAt(0)}{artisan.lastName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {artisan.firstName} {artisan.lastName}
                        </h3>
                        {artisan.isVerified && (
                          <span className="inline-flex items-center text-xs text-green-600">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Vérifié
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-medium">{artisan.rating}</span>
                      <span className="ml-1">({artisan.reviewCount} avis)</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      <span>{artisan.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💼</span>
                      <span>{artisan.experience} ans d'expérience</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💰</span>
                      <span>{artisan.hourlyRate}€/heure</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {artisan.description}
                  </p>

                  {/* Boutons d'action */}
                  <div className="space-y-3">
                    {/* Bouton principal - Voir profil */}
                    <button
                      onClick={() => handleArtisanProfileClick(artisan.userId)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      👤 Voir profil complet
                    </button>
                    
                    {/* Boutons de contact */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => window.location.href = `tel:${artisan.phone}`}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-xs font-medium flex flex-col items-center"
                        title="Appeler"
                      >
                        📞
                        <span className="mt-1">Appeler</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          const message = `Bonjour ${artisan.firstName} ${artisan.lastName},\n\nJ'ai vu votre profil sur FixyHome et je suis intéressé(e) par vos services de ${service.label}.\n\n🔧 **Service**: ${service.label}\n📍 **Localisation**: ${artisan.location}\n⭐ **Note**: ${artisan.rating}/5 (${artisan.reviewCount} avis)\n💰 **Tarif**: ${artisan.hourlyRate}€/heure\n\nPourriez-vous me dire vos disponibilités ?\n\nMerci d'avance,\n[Votre nom]`;
                          const phone = artisan.phone.replace(/\s/g, '').replace(/[+]/g, '');
                          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex flex-col items-center"
                        title="WhatsApp"
                      >
                        💬
                        <span className="mt-1">WhatsApp</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          const subject = `Demande de service - ${service.label} - FixyHome`;
                          const body = `Bonjour ${artisan.firstName} ${artisan.lastName},\n\nJ'ai vu votre profil sur FixyHome et je suis intéressé(e) par vos services de ${service.label}.\n\n🔧 **Service**: ${service.label}\n📍 **Localisation**: ${artisan.location}\n⭐ **Note**: ${artisan.rating}/5 (${artisan.reviewCount} avis)\n💰 **Tarif**: ${artisan.hourlyRate}€/heure\n\nJe souhaiterais discuter d'une prestation avec vous. Pourriez-vous me dire vos disponibilités ?\n\nCordialement,\n[Votre nom]\n[Votre numéro de téléphone]\n[Votre adresse]`;
                          window.location.href = `mailto:${artisan.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        }}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium flex flex-col items-center"
                        title="Email"
                      >
                        📧
                        <span className="mt-1">Email</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
