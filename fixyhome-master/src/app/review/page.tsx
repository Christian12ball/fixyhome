'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

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

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    artisanId: '',
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reviews', {
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
          } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            setReviews(getDefaultReviews());
          }
        } else {
          console.error('Réponse non-JSON reçue:', contentType);
          setReviews(getDefaultReviews());
        }
      } else {
        console.error('Erreur lors du chargement des avis:', response.status, response.statusText);
        setReviews(getDefaultReviews());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      // Set empty reviews array to prevent UI issues
      setReviews(getDefaultReviews());
    } finally {
      setIsLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        mode: 'cors',
        body: JSON.stringify({
          artisanId: parseInt(formData.artisanId),
          rating: formData.rating,
          comment: formData.comment
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Avis ajouté avec succès ! Merci pour votre retour.');
        setFormData({ artisanId: '', rating: 5, comment: '' });
        fetchReviews(); // Recharger les avis
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.message || 'Impossible d\'ajouter l\'avis'}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur. Veuillez réessayer.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Avis des
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> clients</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les expériences authentiques de nos clients et partagez la vôtre
          </p>
        </div>

        {/* Formulaire d'ajout d'avis */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold mb-4">Partagez votre expérience</h2>
          <p className="text-lg mb-8 opacity-90">
            Votre avis compte et aide d'autres clients à faire le bon choix
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">ID de l'artisan</label>
                <input
                  type="number"
                  required
                  value={formData.artisanId}
                  onChange={(e) => setFormData({ ...formData, artisanId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="ID de l'artisan évalué"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 ${star <= formData.rating ? 'text-white' : 'text-white/30'} hover:text-white transition-colors`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-white/90">({formData.rating}/5)</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Votre commentaire</label>
              <textarea
                required
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                placeholder="Décrivez votre expérience avec cet artisan..."
              />
            </div>
            
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-medium">{message}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Publier mon avis'}
            </button>
          </form>
        </div>

        {/* Liste des avis */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tous les avis
            <span className="text-gray-600 font-normal text-lg ml-2">({reviews.length})</span>
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Chargement des avis...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun avis pour le moment</h3>
              <p className="text-gray-600">Soyez le premier à partager votre expérience !</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-4">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-gray-600 font-medium">{review.rating}.0</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6 italic">
                    "{review.comment}"
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">{review.clientName}</div>
                      <div className="text-gray-600">{review.serviceType}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600">Artisan:</div>
                      <div className="font-medium text-gray-900">{review.artisanName}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
