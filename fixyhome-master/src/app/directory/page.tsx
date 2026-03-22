"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ServiceType {
  id: number;
  label: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  createdAt: string;
  artisan?: {
    description: string;
    experience: number;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    hourlyRate: number;
    category?: {
      id: number;
      name: string;
      label: string;
      description: string;
      iconUrl: string;
    };
    serviceType?: ServiceType; // Pour la compatibilité avec d'anciennes références
  };
}

export default function DirectoryPage() {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMethod, setContactMethod] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Utiliser l'endpoint public pour les artisans
      const response = await fetch('http://localhost:8080/api/users/public/artisans', {
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
            const transformedData = Array.isArray(data) ? data.map((item: any) => ({
              id: item.id,
              firstName: item.firstName,
              lastName: item.lastName,
              email: item.email,
              phone: item.phone,
              userType: item.userType,
              createdAt: item.createdAt,
              artisan: item.artisan
            })) : [];
            setUsers(transformedData);
          } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            setUsers(getDefaultArtisans());
          }
        } else {
          console.error('Réponse non-JSON reçue:', contentType);
          setUsers(getDefaultArtisans());
        }
      } else {
        const errorText = await response.text();
        console.error(`Erreur ${response.status} lors de la récupération des artisans:`, errorText);
        console.error('URL appelée:', 'http://localhost:8080/api/users/public/artisans');
        setUsers(getDefaultArtisans());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
      if (error instanceof TypeError) {
        console.error('Erreur de réseau ou CORS - vérifiez que le backend est démarré et accessible');
      }
      setUsers(getDefaultArtisans());
    } finally {
      setLoading(false);
    }
  };

const getDefaultArtisans = (): User[] => [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Martin",
    email: "jean.martin@email.com",
    phone: "06 12 34 56 78",
    userType: "ARTISAN",
    createdAt: new Date().toISOString(),
    artisan: {
      description: "Artisan électricien avec 10 ans d'expérience",
      experience: 10,
      rating: 4.8,
      reviewCount: 25,
      isVerified: true,
      hourlyRate: 45,
      category: {
        id: 2,
        name: "electricity",
        label: "Électricité",
        description: "Services électriques",
        iconUrl: "⚡"
      }
    }
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Dupont",
    email: "marie.dupont@email.com",
    phone: "06 23 45 67 89",
    userType: "ARTISAN",
    createdAt: new Date().toISOString(),
    artisan: {
      description: "Plombier professionnelle et fiable",
      experience: 8,
      rating: 4.9,
      reviewCount: 32,
      isVerified: true,
      hourlyRate: 50,
      category: {
        id: 1,
        name: "plumbing",
        label: "Plomberie",
        description: "Services de plomberie",
        iconUrl: "🔧"
      }
    }
  },
  {
    id: 3,
    firstName: "Sophie",
    lastName: "Bernard",
    email: "sophie.bernard@email.com",
    phone: "06 34 56 78 90",
    userType: "ARTISAN",
    createdAt: new Date().toISOString(),
    artisan: {
      description: "Spécialiste du nettoyage et ménage",
      experience: 5,
      rating: 4.7,
      reviewCount: 18,
      isVerified: true,
      hourlyRate: 25,
      category: {
        id: 3,
        name: "cleaning",
        label: "Ménage",
        description: "Services de nettoyage",
        iconUrl: "🧹"
      }
    }
  },
  {
    id: 4,
    firstName: "Pierre",
    lastName: "Lefebvre",
    email: "pierre.lefebvre@email.com",
    phone: "06 45 67 89 01",
    userType: "ARTISAN",
    createdAt: new Date().toISOString(),
    artisan: {
      description: "Jardinier paysagiste expérimenté",
      experience: 12,
      rating: 4.6,
      reviewCount: 21,
      isVerified: true,
      hourlyRate: 35,
      category: {
        id: 4,
        name: "gardening",
        label: "Jardinage",
        description: "Services de jardinage",
        iconUrl: "🌿"
      }
    }
  },
  {
    id: 5,
    firstName: "Isabelle",
    lastName: "Moreau",
    email: "isabelle.moreau@email.com",
    phone: "06 56 78 90 12",
    userType: "ARTISAN",
    createdAt: new Date().toISOString(),
    artisan: {
      description: "Peintre et décoratrice intérieure",
      experience: 7,
      rating: 4.8,
      reviewCount: 15,
      isVerified: true,
      hourlyRate: 40,
      category: {
        id: 5,
        name: "painting",
        label: "Peinture",
        description: "Services de peinture",
        iconUrl: "🎨"
      }
    }
  },
  {
    id: 6,
    firstName: "Thomas",
    lastName: "Petit",
    email: "thomas.petit@email.com",
    phone: "06 67 89 01 23",
    userType: "ARTISAN",
    createdAt: new Date().toISOString(),
    artisan: {
      description: "Menuisier spécialisé en aménagement",
      experience: 15,
      rating: 4.9,
      reviewCount: 28,
      isVerified: true,
      hourlyRate: 55,
      category: {
        id: 6,
        name: "carpentry",
        label: "Menuiserie",
        description: "Services de menuiserie",
        iconUrl: "🔨"
      }
    }
  }
];

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || user.userType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleContact = (user: User, method: string) => {
    setSelectedUser(user);
    setContactMethod(method);
    setShowContactModal(true);
  };

  const executeContact = () => {
    if (!selectedUser) return;

    switch (contactMethod) {
      case 'whatsapp':
        window.open(`https://wa.me/${selectedUser.phone.replace(/\s/g, '')}`, '_blank');
        break;
      case 'call':
        window.open(`tel:${selectedUser.phone}`, '_blank');
        break;
      case 'message':
        if (isAuthenticated && user) {
          sendNotification(selectedUser);
        } else {
          alert('Vous devez être connecté pour envoyer un message');
        }
        break;
    }
    setShowContactModal(false);
  };

  const sendNotification = async (recipientUser: User) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8080/api/notifications/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: recipientUser.id,
          title: `Nouveau message de ${user?.firstName} ${user?.lastName}`,
          message: `Vous avez reçu un nouveau message. Connectez-vous pour le consulter.`,
          notificationType: 'MESSAGE'
        })
      });

      if (response.ok) {
        alert('Message envoyé avec succès!');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Erreur lors de l\'envoi du message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Chargement de l'annuaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center p-9">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Découvrez nos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                artisans qualifiés
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Connectez-vous avec des artisans vérifiés et professionnels pour tous vos projets
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <input
                type="text"
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type d'utilisateur</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl"
              >
                <option value="ALL">Tous les utilisateurs</option>
                <option value="ARTISAN">Artisans</option>
                <option value="CLIENT">Clients</option>
                <option value="ADMIN">Administrateurs</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredUsers.length}</div>
                  <div className="text-sm text-gray-600">profils trouvés</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des profils */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="relative h-32 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                <div className="flex items-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h3>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.userType}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13 2.257a1 1 0 001.21.502l4.493 1.498a1 1 0 00.684-.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{user.phone}</span>
                  </div>
                  {user.artisan?.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>{user.artisan.category.label || 'Non spécifiée'}</span>
                    </div>
                  )}
                  {/* Afficher la catégorie même si la structure est différente */}
                  {user.artisan && !user.artisan?.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Catégorie non spécifiée</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleContact(user, 'whatsapp')}
                    className="bg-green-500 text-white px-3 py-2 rounded-xl text-xs font-medium"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleContact(user, 'call')}
                    className="bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-medium"
                  >
                    Appeler
                  </button>
                  <button
                    onClick={() => handleContact(user, 'message')}
                    className="bg-purple-500 text-white px-3 py-2 rounded-xl text-xs font-medium"
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
