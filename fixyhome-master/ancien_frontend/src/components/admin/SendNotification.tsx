"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

interface SendNotificationProps {
  token: string;
}

export default function SendNotification({ token }: SendNotificationProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    notificationType: "MESSAGE"
  });

  useEffect(() => {
    if (userType !== "ALL") {
      fetchUsersByType(userType);
    } else {
      fetchAllUsers();
    }
  }, [userType]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/profiles", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByType = async (type: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/profiles/type/${type}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      alert("Veuillez sélectionner un destinataire");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/notifications/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recipientId: selectedUser.id,
          title: formData.title,
          message: formData.message,
          notificationType: formData.notificationType
        })
      });

      if (response.ok) {
        alert("Notification envoyée avec succès!");
        setFormData({ title: "", message: "", notificationType: "MESSAGE" });
        setSelectedUser(null);
      } else {
        alert("Erreur lors de l'envoi de la notification");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur lors de l'envoi de la notification");
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'ARTISAN':
        return 'bg-blue-100 text-blue-800';
      case 'CLIENT':
        return 'bg-green-100 text-green-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Envoyer une notification</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire d'envoi */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de notification
              </label>
              <select
                value={formData.notificationType}
                onChange={(e) => setFormData({...formData, notificationType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MESSAGE">Message privé</option>
                <option value="SERVICE_REQUEST">Demande de service</option>
                <option value="PAYMENT">Paiement</option>
                <option value="REVIEW">Avis</option>
                <option value="GENERAL">Général</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sujet de la notification"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Contenu du message"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Destinataire:</strong> {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email})` : 'Non sélectionné'}
              </p>
            </div>

            <button
              type="submit"
              disabled={!selectedUser}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer la notification
            </button>
          </form>
        </div>

        {/* Sélection du destinataire */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Destinataire</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'utilisateur
              </label>
              <select
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                  setSelectedUser(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tous les utilisateurs</option>
                <option value="ARTISAN">Artisans uniquement</option>
                <option value="CLIENT">Clients uniquement</option>
                <option value="ADMIN">Administrateurs uniquement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Liste des utilisateurs
              </label>
              <div className="border border-gray-300 rounded-lg p-2 max-h-64 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Aucun utilisateur trouvé</p>
                ) : (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedUser?.id === user.id
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-gray-600">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeColor(user.userType)}`}>
                            {user.userType === 'ARTISAN' ? 'Artisan' : 
                             user.userType === 'CLIENT' ? 'Client' : 'Admin'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
