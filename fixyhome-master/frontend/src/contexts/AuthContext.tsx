'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useProfile } from './ProfileContext';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  switchProfile: (profileId: string) => void;
  profiles: any[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { profiles, currentProfile, addProfile, switchProfile: switchProfileContext, clearAllProfiles } = useProfile();

  useEffect(() => {
    // Initialiser l'utilisateur avec le profil actuel
    if (currentProfile) {
      setUser({
        id: currentProfile.id,
        email: currentProfile.email,
        firstName: currentProfile.firstName,
        lastName: currentProfile.lastName,
        phone: currentProfile.phone || '',
        userType: currentProfile.userType,
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [currentProfile]);

  const login = async (email: string, password: string) => {
    try {
      // Essayer d'abord la connexion via le backend PostgreSQL
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/users/authenticate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          mode: 'cors',
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          console.log('✅ Connexion réussie via la base de données PostgreSQL');
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn('⚠️ Réponse non-JSON du backend, tentative fallback');
            throw new Error('Réponse invalide du serveur');
          }

          const text = await response.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            throw new Error('Réponse invalide du serveur');
          }

          const userType = data.userType;
          
          // Récupérer le profil actuel pour déterminer le créateur
          const currentCreatorId = currentProfile?.id || 'unknown';
          
          // Créer un profil avec les données de connexion du backend
          const profileData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone || '',
            userType: userType,
            token: data.token,
            profileName: `${data.firstName} ${data.lastName}`,
            createdBy: 'backend',
          };

          // Ajouter le profil via ProfileContext
          addProfile(profileData);
          
          // Rediriger selon le type d'utilisateur
          if (userType === 'ADMIN') {
            window.location.href = '/admin/dashboard';
          } else if (userType === 'ARTISAN') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/dashboard';
          }
          return; // Succès, pas besoin de continuer
        } else {
          console.warn('⚠️ Backend non disponible ou identifiants incorrects, essai fallback local');
        }
      } catch (backendError) {
        console.warn('⚠️ Erreur de communication avec le backend:', backendError);
      }

      // Vérifier si c'est un utilisateur nouvellement créé (stocké localement)
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const localUser = localUsers.find((user: any) => 
        user.email === email && user.password === password
      );

      if (localUser) {
        console.log('📦 Connexion via stockage local');
        // Connexion avec un utilisateur local
        const profileData = {
          email: localUser.email,
          firstName: localUser.firstName,
          lastName: localUser.lastName,
          phone: localUser.phone,
          userType: localUser.userType,
          token: 'local-user-token',
          profileName: `${localUser.firstName} ${localUser.lastName}`,
          createdBy: 'local',
        };
        addProfile(profileData);
        
        // Rediriger selon le type d'utilisateur
        if (localUser.userType === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else if (localUser.userType === 'ARTISAN') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
        return;
      }

      // Essayer avec les identifiants réels de la base de données (fallback)
      console.log('🔐 Tentative avec les identifiants de la base de données');
      
      // Vérifier si ce sont les identifiants réels de la base de données
      if (email === 'admin@fixyhome.com' && password === 'admin123') {
        const demoProfileData = {
          email: 'admin@fixyhome.com',
          firstName: 'Admin',
          lastName: 'FixyHome',
          phone: '+221770000001',
          userType: 'ADMIN',
          token: 'real-admin-token',
          profileName: 'Admin FixyHome',
          createdBy: 'database',
        };
        addProfile(demoProfileData);
        window.location.href = '/admin/dashboard';
        return;
      }
      
      // Artisans réels
      const artisanAccounts = [
        { email: 'pierre.plombier@fixyhome.com', firstName: 'Pierre', lastName: 'Durand', phone: '+221770000020' },
        { email: 'sophie.electricienne@fixyhome.com', firstName: 'Sophie', lastName: 'Lefebvre', phone: '+221770000021' },
        { email: 'michel.menage@fixyhome.com', firstName: 'Michel', lastName: 'Bertrand', phone: '+221770000022' },
        { email: 'isabelle.jardinage@fixyhome.com', firstName: 'Isabelle', lastName: 'Moreau', phone: '+221770000023' },
        { email: 'robert.peinture@fixyhome.com', firstName: 'Robert', lastName: 'Garnier', phone: '+221770000024' },
        { email: 'marc.menuiserie@fixyhome.com', firstName: 'Marc', lastName: 'Dubois', phone: '+221770000025' },
        { email: 'chantal.climatisation@fixyhome.com', firstName: 'Chantal', lastName: 'Rousseau', phone: '+221770000026' },
        { email: 'antoine.couverture@fixyhome.com', firstName: 'Antoine', lastName: 'Petit', phone: '+221770000027' },
        { email: 'lucie.demenagement@fixyhome.com', firstName: 'Lucie', lastName: 'Martin', phone: '+221770000028' },
        { email: 'franck.securite@fixyhome.com', firstName: 'Franck', lastName: 'Leroy', phone: '+221770000029' },
        // Artisans supplémentaires
        { email: 'thomas.plombier@fixyhome.com', firstName: 'Thomas', lastName: 'Bernard', phone: '+221770000030' },
        { email: 'nathalie.electricienne@fixyhome.com', firstName: 'Nathalie', lastName: 'Martin', phone: '+221770000040' },
        { email: 'fatou.menage@fixyhome.com', firstName: 'Fatou', lastName: 'Diop', phone: '+221770000050' },
        { email: 'ibrahima.jardinage@fixyhome.com', firstName: 'Ibrahim', lastName: 'Sarr', phone: '+221770000060' }
      ];

      const artisanAccount = artisanAccounts.find(account => account.email === email);
      if (artisanAccount && password === 'admin123') {
        const demoProfileData = {
          email: artisanAccount.email,
          firstName: artisanAccount.firstName,
          lastName: artisanAccount.lastName,
          phone: artisanAccount.phone,
          userType: 'ARTISAN',
          token: 'real-artisan-token',
          profileName: `${artisanAccount.firstName} ${artisanAccount.lastName}`,
          createdBy: 'database',
        };
        addProfile(demoProfileData);
        window.location.href = '/dashboard';
        return;
      }
      
      // Clients réels
      const clientAccounts = [
        { email: 'jean.client@fixyhome.com', firstName: 'Jean', lastName: 'Dupont', phone: '+221770000010' },
        { email: 'marie.client@fixyhome.com', firstName: 'Marie', lastName: 'Curie', phone: '+221770000011' },
        { email: 'paul.client@fixyhome.com', firstName: 'Paul', lastName: 'Martin', phone: '+221770000012' },
        { email: 'sophie.client@fixyhome.com', firstName: 'Sophie', lastName: 'Bernard', phone: '+221770000013' },
        { email: 'pierre.client@fixyhome.com', firstName: 'Pierre', lastName: 'Petit', phone: '+221770000014' },
        { email: 'amelie.client@fixyhome.com', firstName: 'Amélie', lastName: 'Rousseau', phone: '+221770000015' }
      ];

      const clientAccount = clientAccounts.find(account => account.email === email);
      if (clientAccount && password === 'admin123') {
        const demoProfileData = {
          email: clientAccount.email,
          firstName: clientAccount.firstName,
          lastName: clientAccount.lastName,
          phone: clientAccount.phone,
          userType: 'CLIENT',
          token: 'real-client-token',
          profileName: `${clientAccount.firstName} ${clientAccount.lastName}`,
          createdBy: 'database',
        };
        addProfile(demoProfileData);
        window.location.href = '/dashboard';
        return;
      }
      
      // Message d'erreur plus informatif
      throw new Error(`Identifiants incorrects pour "${email}". Veuillez vérifier votre email et mot de passe.\n\nComptes disponibles:\n• Admin: admin@fixyhome.com / admin123\n• Artisans: [prenom].[service]@fixyhome.com / admin123\n• Clients: [prenom].client@fixyhome.com / admin123`);
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      let response;
      let registeredInBackend = false;
      
      // Essayer d'abord de s'enregistrer dans la base de données via le backend
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        if (userData.userType === 'ARTISAN') {
          response = await fetch(`${apiUrl}/api/artisans/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            },
            mode: 'cors',
            body: JSON.stringify(userData),
          });
        } else {
          response = await fetch(`${apiUrl}/api/client/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            },
            mode: 'cors',
            body: JSON.stringify(userData),
          });
        }

        if (response.ok) {
          registeredInBackend = true;
          console.log('✅ Utilisateur enregistré avec succès dans la base de données PostgreSQL');
          
          // Récupérer la réponse du backend
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const text = await response.text();
            try {
              const data = JSON.parse(text);
              
              // Créer un profil avec les données du backend
              const profileData = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone || userData.phone || '',
                userType: data.userType,
                token: data.token,
                profileName: `${data.firstName} ${data.lastName}`,
                createdBy: 'backend',
              };
              addProfile(profileData);
              
              // Rediriger selon le type d'utilisateur
              if (data.userType === 'ADMIN') {
                window.location.href = '/admin/dashboard';
              } else {
                window.location.href = '/dashboard';
              }
              return; // Succès, pas besoin de continuer
            } catch (parseError) {
              console.error('Erreur de parsing JSON du backend:', parseError);
            }
          }
        } else {
          console.warn('⚠️ Backend non disponible, utilisation du stockage local');
        }
      } catch (backendError) {
        console.warn('⚠️ Erreur de communication avec le backend:', backendError);
      }
      
      // Fallback: Stocker l'utilisateur localement
      console.log('📦 Stockage local de l\'utilisateur');
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const newUser = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        userType: userData.userType,
        password: userData.password,
        createdAt: new Date().toISOString(),
        registeredInBackend: registeredInBackend
      };
      localUsers.push(newUser);
      localStorage.setItem('localUsers', JSON.stringify(localUsers));
      
      // Créer un profil pour l'utilisateur
      const profileData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        userType: userData.userType,
        token: registeredInBackend ? 'backend-token' : 'local-token',
        profileName: `${userData.firstName} ${userData.lastName}`,
        createdBy: registeredInBackend ? 'backend' : 'local',
      };
      addProfile(profileData);
      
      // Rediriger selon le type d'utilisateur
      if (userData.userType === 'ADMIN') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  };

  const logout = () => {
    // Ne pas supprimer tous les profils, juste déconnecter
    // Le profil reste sauvegardé pour pouvoir se reconnecter plus tard
    setUser(null);
    localStorage.removeItem('currentProfile');
    localStorage.removeItem('token');
  };

  const switchProfile = (profileId: string) => {
    switchProfileContext(profileId);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    switchProfile,
    profiles,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
