"use client";

import { useState, useEffect } from "react";

interface ServiceCategory {
  id: number;
  label: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
}

interface Service {
  id: number;
  label: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
  category?: ServiceCategory;
}

interface ServiceFormData {
  label: string;
  description: string;
  isActive: boolean;
  categoryId: string;
}

interface CategoryFormData {
  label: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
}

interface ServiceManagementProps {
  token: string;
}

export default function ServiceManagement({ token }: ServiceManagementProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'service' | 'category'>('service');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(12);
  const [servicesPerPage] = useState(10);
  const [formData, setFormData] = useState<ServiceFormData>({
    label: "",
    description: "",
    isActive: true,
    categoryId: ""
  });

  const [error, setError] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    label: "",
    description: "",
    iconUrl: "",
    isActive: true
  });

  const getDefaultServices = (): Service[] => [
    {
      id: 1,
      label: "Plomberie",
      description: "Services de plomberie résidentielle et commerciale",
      iconUrl: "🔧",
      isActive: true
    },
    {
      id: 2,
      label: "Électricité",
      description: "Installation et dépannage électrique",
      iconUrl: "⚡",
      isActive: true
    },
    {
      id: 3,
      label: "Ménage",
      description: "Services de nettoyage et entretien",
      iconUrl: "🧹",
      isActive: true
    },
    {
      id: 4,
      label: "Jardinage",
      description: "Aménagement paysager et entretien de jardins",
      iconUrl: "🌿",
      isActive: true
    },
    {
      id: 5,
      label: "Peinture",
      description: "Peinture intérieure et extérieure",
      iconUrl: "🎨",
      isActive: true
    },
    {
      id: 6,
      label: "Menuiserie",
      description: "Travaux de menuiserie et charpente",
      iconUrl: "🔨",
      isActive: true
    },
    {
      id: 7,
      label: "Climatisation",
      description: "Installation et maintenance HVAC",
      iconUrl: "❄️",
      isActive: true
    },
    {
      id: 8,
      label: "Couverture",
      description: "Travaux de toiture et couverture",
      iconUrl: "🏠",
      isActive: true
    },
    {
      id: 9,
      label: "Déménagement",
      description: "Services de déménagement et transport",
      iconUrl: "🚚",
      isActive: true
    },
    {
      id: 10,
      label: "Sécurité",
      description: "Systèmes de sécurité et alarme",
      iconUrl: "🔒",
      isActive: true
    }
  ];

  const getDefaultCategories = (): ServiceCategory[] => [
    {
      id: 1,
      label: "Plomberie",
      description: "Services de plomberie",
      iconUrl: "🔧",
      isActive: true
    },
    {
      id: 2,
      label: "Électricité",
      description: "Services électriques",
      iconUrl: "⚡",
      isActive: true
    },
    {
      id: 3,
      label: "Ménage",
      description: "Services de nettoyage",
      iconUrl: "🧹",
      isActive: true
    },
    {
      id: 4,
      label: "Jardinage",
      description: "Services de jardinage",
      iconUrl: "🌿",
      isActive: true
    },
    {
      id: 5,
      label: "Peinture",
      description: "Services de peinture",
      iconUrl: "🎨",
      isActive: true
    },
    {
      id: 6,
      label: "Menuiserie",
      description: "Services de menuiserie",
      iconUrl: "🔨",
      isActive: true
    }
  ];

  useEffect(() => {
    const checkTokenAndLoad = () => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Token found, loading services and categories...');
        fetchServices();
        fetchCategories();
        setLoading(false); // Arrêter le chargement général
      } else {
        console.log('No token available, waiting for authentication...');
        setServicesLoading(false);
        setLoading(false); // Arrêter le chargement même sans token
      }
    };

    // Vérifier immédiatement
    checkTokenAndLoad();

    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        console.log('Token changed in localStorage, reloading data...');
        checkTokenAndLoad();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Vérifier périodiquement (pour les changements dans le même onglet)
    const interval = setInterval(checkTokenAndLoad, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const addCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8080/api/service-categories", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(categoryForm)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      fetchCategories();
      setIsCategoryModalOpen(false);
      setCategoryForm({ label: "", description: "", iconUrl: "", isActive: true });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
    }
  };

  const openCategoryModal = () => {
    setModalType('category');
    setIsCategoryModalOpen(true);
  };

  const openServiceModal = (categoryId?: string) => {
    setModalType('service');
    setEditingService(null);
    setError(null);
    setFormData({ 
      label: "", 
      description: "", 
      isActive: true, 
      categoryId: categoryId || ""
    });
    setIsModalOpen(true);
  };

  // Pagination pour les catégories
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPagesCategories = Math.ceil(categories.length / categoriesPerPage);

  // Pagination pour les services (dans la page de détail)
  const [servicePage, setServicePage] = useState(1);
  const indexOfLastService = servicePage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);
  const totalPagesServices = Math.ceil(services.length / servicesPerPage);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching categories with token:', token ? 'present' : 'missing');
      
      if (!token) {
        console.error('No token found in localStorage');
        setCategories(getDefaultCategories());
        return;
      }
      
      const response = await fetch("http://localhost:8080/api/service-categories", {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Cache-Control": "no-cache"
        },
        mode: 'cors'
      });

      console.log('Categories response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Categories error response:', errorText);
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication failed - token may be expired or invalid');
          setAuthError('Votre session a expiré. Veuillez vous reconnecter.');
          localStorage.removeItem('token');
        }
        // Utiliser les données par défaut en cas d'erreur
        setCategories(getDefaultCategories());
        return;
      }
      
      // Gestion sécurisée de la réponse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Categories raw response:', text);
        let data;
        try {
          data = text ? JSON.parse(text) : [];
        } catch (parseError) {
          console.error('Erreur de parsing JSON:', parseError);
          data = getDefaultCategories();
        }
        console.log('Categories parsed data:', data);
        setCategories(Array.isArray(data) ? data : getDefaultCategories());
      } else {
        console.error('Réponse non-JSON reçue:', contentType);
        setCategories(getDefaultCategories());
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      setCategories(getDefaultCategories());
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching services with token:', token ? 'present' : 'missing');
      
      if (!token) {
        console.error('No token found in localStorage');
        setServices(getDefaultServices());
        setServicesLoading(false);
        return;
      }
      
      const response = await fetch("http://localhost:8080/api/services/all", {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Cache-Control": "no-cache"
        },
        mode: 'cors'
      });

      console.log('Services response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Services error response:', errorText);
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication failed - token may be expired or invalid');
          setAuthError('Votre session a expiré. Veuillez vous reconnecter.');
          // Optionally redirect to login or clear token
          localStorage.removeItem('token');
        }
        // Utiliser les données par défaut en cas d'erreur
        setServices(getDefaultServices());
        setServicesLoading(false);
        return;
      }
      
      // Gestion sécurisée de la réponse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Services raw response:', text);
        let data;
        try {
          data = text ? JSON.parse(text) : [];
        } catch (parseError) {
          console.error('Erreur de parsing JSON:', parseError);
          data = getDefaultServices();
        }
        console.log('Services parsed data:', data);
        setServices(Array.isArray(data) ? data : getDefaultServices());
      } else {
        console.error('Réponse non-JSON reçue:', contentType);
        setServices(getDefaultServices());
      }
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      setServices(getDefaultServices());
    } finally {
      setServicesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingService 
        ? `http://localhost:8080/api/services/${editingService.id}`
        : "http://localhost:8080/api/services";
      
      const method = editingService ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Si ce n'est pas du JSON, utiliser le texte d'erreur
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      fetchServices();
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ label: "", description: "", isActive: true, categoryId: "" });
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/services/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchServices();
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setError(null);
    setFormData({
      label: service.label,
      description: service.description,
      isActive: service.isActive,
      categoryId: service.category?.id?.toString() || ""
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message d'erreur d'authentification */}
      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur d'authentification</h3>
              <p className="mt-1 text-sm text-red-700">{authError}</p>
              <div className="mt-3">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="bg-red-100 text-red-800 px-3 py-1 text-sm font-semibold rounded hover:bg-red-200 transition-colors"
                >
                  Se reconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gestion des services</h2>
        <button
          onClick={openCategoryModal}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Ajouter une catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCategories.map((category) => {
          const categoryServices = services.filter(service => service.category?.id === category.id);
          return (
            <div 
              key={category.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
              onClick={() => window.location.href = `/admin/services/${category.id}`}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {category.iconUrl && (
                    <img
                      src={category.iconUrl}
                      alt={category.label}
                      className="w-12 h-12 mr-3 rounded group-hover:scale-110 transition-transform"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.label}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold rounded-full">
                      {categoryServices.length} service{categoryServices.length > 1 ? 's' : ''}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openServiceModal(category.id.toString());
                      }}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      title="Ajouter un service"
                    >
                      + Service
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/admin/services/${category.id}`;
                      }}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les services"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {categories.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
            <p className="text-gray-500">Les catégories de services apparaîtront ici.</p>
          </div>
        )}
        
        {/* Section pour afficher tous les services */}
        {servicesLoading ? (
          <div className="mt-8 flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Tous les services ({services.length})</h2>
              <button
                onClick={() => openServiceModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Ajouter un service
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {service.iconUrl && (
                              <img
                                src={service.iconUrl}
                                alt={service.label}
                                className="w-8 h-8 mr-3 rounded"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {service.label}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {service.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {service.category?.label || 'Non défini'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            service.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {service.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(service)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center py-8">
            <p className="text-gray-500">Aucun service trouvé</p>
          </div>
        )}
      </div>

      {/* Pagination pour les catégories */}
      {totalPagesCategories > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} sur {totalPagesCategories}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesCategories))}
            disabled={currentPage === totalPagesCategories}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingService ? 'Modifier le service' : 'Ajouter un service'}
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du service
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Service actif
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingService ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter une catégorie</h3>
            <form onSubmit={(e) => { e.preventDefault(); addCategory(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la catégorie
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.label}
                    onChange={(e) => setCategoryForm({...categoryForm, label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'icône
                  </label>
                  <input
                    type="url"
                    value={categoryForm.iconUrl}
                    onChange={(e) => setCategoryForm({...categoryForm, iconUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActiveCategory"
                    checked={categoryForm.isActive}
                    onChange={(e) => setCategoryForm({...categoryForm, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isActiveCategory" className="text-sm font-medium text-gray-700">
                    Catégorie active
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
