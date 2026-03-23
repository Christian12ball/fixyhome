"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ServiceCategory {
  id: number;
  name: string;
  label: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
}

interface Artisan {
  id: number;
  description: string;
  experience: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  hourlyRate: number;
  location: string;
  category?: ServiceCategory;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  createdAt: string;
  artisan?: Artisan;
}

export default function ArtisanProfile() {
  const params = useParams();
  const router = useRouter();
  const artisanId = params.id as string;
  
  const [artisan, setArtisan] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArtisan();
  }, [artisanId]);

  const fetchArtisan = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/public/artisans`);
      if (response.ok) {
        const data: User[] = await response.json();
        const foundArtisan = data.find(user => user.id.toString() === artisanId);
        
        if (foundArtisan) {
          setArtisan(foundArtisan);
        } else {
          setError("Artisan non trouvé");
        }
      } else {
        setError("Erreur lors du chargement du profil");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (!artisan) return "";
    
    const message = `Bonjour ${artisan.firstName} ${artisan.lastName},\n\n` +
      `J'ai vu votre profil sur FixyHome et je suis intéressé(e) par vos services.\n\n` +
      `🔧 **Spécialité**: ${artisan.artisan?.category?.label || "Non spécifiée"}\n` +
      `📍 **Localisation**: ${artisan.artisan?.location || "Non spécifiée"}\n` +
      `⭐ **Note**: ${artisan.artisan?.rating || 0}/5 (${artisan.artisan?.reviewCount || 0} avis)\n` +
      `💰 **Tarif**: ${artisan.artisan?.hourlyRate || 0}€/heure\n` +
      `📝 **Description**: ${artisan.artisan?.description || "Non spécifiée"}\n\n` +
      `Je souhaiterais discuter d'une prestation avec vous. Pourriez-vous me dire vos disponibilités ?\n\n` +
      `Merci d'avance,\n` +
      `[Votre nom]`;
    
    return encodeURIComponent(message);
  };

  const generateEmailSubject = () => {
    if (!artisan) return "";
    return `Demande de service - ${artisan.artisan?.category?.label || "Service"} - FixyHome`;
  };

  const generateEmailBody = () => {
    if (!artisan) return "";
    
    const body = `Bonjour ${artisan.firstName} ${artisan.lastName},\n\n` +
      `J'ai vu votre profil sur FixyHome et je suis intéressé(e) par vos services.\n\n` +
      `🔧 **Spécialité**: ${artisan.artisan?.category?.label || "Non spécifiée"}\n` +
      `📍 **Localisation**: ${artisan.artisan?.location || "Non spécifiée"}\n` +
      `⭐ **Note**: ${artisan.artisan?.rating || 0}/5 (${artisan.artisan?.reviewCount || 0} avis)\n` +
      `💰 **Tarif**: ${artisan.artisan?.hourlyRate || 0}€/heure\n` +
      `📝 **Description**: ${artisan.artisan?.description || "Non spécifiée"}\n\n` +
      `Je souhaiterais discuter d'une prestation avec vous. Pourriez-vous me dire vos disponibilités ?\n\n` +
      `Cordialement,\n` +
      `[Votre nom]\n` +
      `[Votre numéro de téléphone]\n` +
      `[Votre adresse]`;
    
    return encodeURIComponent(body);
  };

  const handleWhatsAppClick = () => {
    if (!artisan) return;
    const message = generateWhatsAppMessage();
    const phone = artisan.phone.replace(/\s/g, '').replace(/[+]/g, '');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    if (!artisan) return;
    const subject = generateEmailSubject();
    const body = generateEmailBody();
    window.location.href = `mailto:${artisan.email}?subject=${subject}&body=${body}`;
  };

  const handlePhoneClick = () => {
    if (!artisan) return;
    window.location.href = `tel:${artisan.phone}`;
  };

  const handleServiceRequest = () => {
    // Rediriger vers la page de login client
    router.push('/login?redirect=/dashboard/client');
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

  if (error || !artisan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
            <p className="text-gray-600">{error || "Artisan non trouvé"}</p>
            <button 
              onClick={() => router.push('/directory')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à l'annuaire
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {artisan.firstName.charAt(0)}{artisan.lastName.charAt(0)}
              </div>
              
              {/* Info principales */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {artisan.firstName} {artisan.lastName}
                  </h1>
                  {artisan.artisan?.isVerified && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      ✅ Vérifié
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium">{artisan.artisan?.rating || 0}</span>
                    <span>({artisan.artisan?.reviewCount || 0} avis)</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{artisan.artisan?.location || "Non spécifiée"}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span>💼</span>
                    <span>{artisan.artisan?.experience || 0} ans d'expérience</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span>💰</span>
                    <span>{artisan.artisan?.hourlyRate || 0}€/heure</span>
                  </div>
                </div>
                
                {artisan.artisan?.category && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <span className="mr-2">{artisan.artisan.category.iconUrl}</span>
                    {artisan.artisan.category.label}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {artisan.artisan?.description || "Aucune description disponible"}
            </p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contacter l'artisan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppClick}
                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </button>

              {/* Email */}
              <button
                onClick={handleEmailClick}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </button>

              {/* Téléphone */}
              <button
                onClick={handlePhoneClick}
                className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Téléphone
              </button>

              {/* Demande de service */}
              <button
                onClick={handleServiceRequest}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Demande de service
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>💡 Astuce :</strong> Pour faire une demande de service formelle et suivre son avancement, 
                cliquez sur "Demande de service" et connectez-vous à votre espace client.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}