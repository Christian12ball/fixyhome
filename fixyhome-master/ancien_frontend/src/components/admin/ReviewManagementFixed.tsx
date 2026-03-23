"use client";

import { useState, useEffect } from "react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  artisan: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  intervention: {
    id: number;
    title: string;
    category: string;
  };
}

interface ReviewManagementProps {
  token: string;
}

export default function ReviewManagementFixed({ token }: ReviewManagementProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [filterRating]);

  const fetchReviews = async () => {
    try {
      const url = filterRating === "ALL" 
        ? 'http://localhost:8080/api/admin/reviews'
        : `http://localhost:8080/api/admin/reviews?rating=${filterRating}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transformer les données pour correspondre à l'interface
        const transformedReviews = data.map((review: any) => ({
          ...review,
          client: {
            id: review.client?.id || 1,
            firstName: review.client?.firstName || 'Client',
            lastName: review.client?.lastName || 'Test',
            email: review.client?.email || 'client@test.com'
          },
          artisan: {
            id: review.artisan?.id || 1,
            firstName: review.artisan?.firstName || 'Artisan',
            lastName: review.artisan?.lastName || 'Test',
            email: review.artisan?.email || 'artisan@test.com'
          },
          intervention: {
            id: review.intervention?.id || 1,
            title: review.intervention?.title || 'Service test',
            category: review.intervention?.category || 'PLUMBING'
          }
        }));
        setReviews(transformedReviews);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchReviews();
        setShowDetailsModal(false);
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const exportReviews = () => {
    const csvContent = [
      ['ID', 'Client', 'Artisan', 'Note', 'Commentaire', 'Intervention', 'Date'],
      ...reviews.map(review => [
        review.id,
        `${review.client.firstName} ${review.client.lastName}`,
        `${review.artisan.firstName} ${review.artisan.lastName}`,
        review.rating,
        `"${review.comment.replace(/"/g, '""')}"`,
        review.intervention.title,
        new Date(review.createdAt).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `avis_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${review.client.firstName} ${review.client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${review.artisan.firstName} ${review.artisan.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStats = () => {
    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
    const rating5 = reviews.filter(r => r.rating === 5).length;
    const rating4 = reviews.filter(r => r.rating === 4).length;
    const rating3 = reviews.filter(r => r.rating === 3).length;
    const rating2 = reviews.filter(r => r.rating === 2).length;
    const rating1 = reviews.filter(r => r.rating === 1).length;

    return { total, average, rating5, rating4, rating3, rating2, rating1 };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total des avis</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Note moyenne</h3>
          <p className={`text-3xl font-bold ${getRatingColor(Math.round(stats.average))}`}>
            {stats.average.toFixed(1)} ⭐
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avis 5 étoiles</h3>
          <p className="text-3xl font-bold text-green-600">{stats.rating5}</p>
        </div>
      </div>

      {/* Filtres et actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              type="text"
              placeholder="Rechercher un avis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>
          <button
            onClick={exportReviews}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📥 Exporter CSV
          </button>
        </div>
      </div>

      {/* Distribution des notes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution des notes</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => r.rating === rating).length;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center">
                <span className="text-sm text-gray-600 w-12">{rating} ⭐</span>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste des avis */}
      <div className="grid gap-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-4">
                    <span className={`text-lg font-medium ${getRatingColor(review.rating)}`}>
                      {getRatingStars(review.rating)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">({review.rating}/5)</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Client:</span>
                    <p className="text-sm text-gray-900">
                      {review.client.firstName} {review.client.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{review.client.email}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Artisan:</span>
                    <p className="text-sm text-gray-900">
                      {review.artisan.firstName} {review.artisan.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{review.artisan.email}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Intervention:</span>
                    <p className="text-sm text-gray-900">{review.intervention.title}</p>
                    <p className="text-sm text-gray-500">{review.intervention.category}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                  setSelectedReview(review);
                  setShowDetailsModal(true);
                }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Voir détails
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de détails */}
      {showDetailsModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Détails de l'avis
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedReview(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Note et commentaire */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Avis</h4>
                <div className="flex items-center mb-3">
                  <span className={`text-2xl font-medium ${getRatingColor(selectedReview.rating)}`}>
                    {getRatingStars(selectedReview.rating)}
                  </span>
                  <span className="ml-3 text-lg text-gray-700">({selectedReview.rating}/5)</span>
                </div>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedReview.comment}</p>
              </div>

              {/* Client */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Client</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Nom:</span>
                    <p className="text-gray-900">{selectedReview.client.firstName} {selectedReview.client.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="text-gray-900">{selectedReview.client.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ID Client:</span>
                    <p className="text-gray-900">{selectedReview.client.id}</p>
                  </div>
                </div>
              </div>

              {/* Artisan */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Artisan évalué</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Nom:</span>
                    <p className="text-gray-900">{selectedReview.artisan.firstName} {selectedReview.artisan.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="text-gray-900">{selectedReview.artisan.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ID Artisan:</span>
                    <p className="text-gray-900">{selectedReview.artisan.id}</p>
                  </div>
                </div>
              </div>

              {/* Intervention */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Intervention concernée</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Titre:</span>
                    <p className="text-gray-900">{selectedReview.intervention.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Catégorie:</span>
                    <p className="text-gray-900">{selectedReview.intervention.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ID Intervention:</span>
                    <p className="text-gray-900">{selectedReview.intervention.id}</p>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Date de publication</h4>
                <p className="text-gray-900">
                  {new Date(selectedReview.createdAt).toLocaleDateString('fr-FR')} à {' '}
                  {new Date(selectedReview.createdAt).toLocaleTimeString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedReview(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  deleteReview(selectedReview.id);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer l'avis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
