"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  token: string;
  profileName: string;
  createdAt: string;
  lastLogin: string;
  createdBy: string; // ID de l'utilisateur créateur
}

interface ProfileContextType {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  addProfile: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'lastLogin'>) => void;
  removeProfile: (profileId: string) => void;
  switchProfile: (profileId: string) => void;
  switchProfileWithAuth: (profileId: string, password: string) => Promise<boolean>;
  updateProfile: (profileId: string, updates: Partial<UserProfile>) => void;
  clearAllProfiles: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);

  // Charger les profils depuis localStorage au démarrage
  useEffect(() => {
    const savedProfiles = localStorage.getItem('userProfiles');
    const savedCurrentProfile = localStorage.getItem('currentProfile');
    
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
    
    if (savedCurrentProfile) {
      setCurrentProfile(JSON.parse(savedCurrentProfile));
    }
  }, []);

  // Sauvegarder les profils dans localStorage à chaque modification
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('userProfiles', JSON.stringify(profiles));
    } else {
      localStorage.removeItem('userProfiles');
    }
  }, [profiles]);

  // Sauvegarder le profil actuel dans localStorage
  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('currentProfile', JSON.stringify(currentProfile));
      localStorage.setItem('token', currentProfile.token);
    } else {
      localStorage.removeItem('currentProfile');
      localStorage.removeItem('token');
    }
  }, [currentProfile]);

  const addProfile = (profile: Omit<UserProfile, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newProfile: UserProfile = {
      ...profile,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setProfiles(prev => {
      // Vérifier si un profil avec le même email existe déjà pour le même créateur
      const existingProfileIndex = prev.findIndex(p => p.email === profile.email && p.createdBy === profile.createdBy);
      if (existingProfileIndex !== -1) {
        // Mettre à jour le profil existant avec le même ID
        return prev.map((p, index) => 
          index === existingProfileIndex
            ? { ...newProfile, id: prev[existingProfileIndex].id, createdAt: prev[existingProfileIndex].createdAt }
            : p
        );
      }
      return [...prev, newProfile];
    });

    setCurrentProfile(newProfile);
  };

  const removeProfile = (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    
    if (currentProfile?.id === profileId) {
      // Si on supprime le profil actuel, passer au premier profil disponible
      const remainingProfiles = profiles.filter(p => p.id !== profileId);
      setCurrentProfile(remainingProfiles.length > 0 ? remainingProfiles[0] : null);
    }
  };

  const switchProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      const updatedProfile = {
        ...profile,
        lastLogin: new Date().toISOString()
      };
      
      setProfiles(prev => prev.map(p => 
        p.id === profileId ? updatedProfile : p
      ));
      
      setCurrentProfile(updatedProfile);
    }
  };

  const updateProfile = (profileId: string, updates: Partial<UserProfile>) => {
    setProfiles(prev => prev.map(p => 
      p.id === profileId ? { ...p, ...updates } : p
    ));
    
    if (currentProfile?.id === profileId) {
      setCurrentProfile(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const clearAllProfiles = () => {
    setProfiles([]);
    setCurrentProfile(null);
    localStorage.removeItem('userProfiles');
    localStorage.removeItem('currentProfile');
    localStorage.removeItem('token');
  };

  const switchProfileWithAuth = async (profileId: string, password: string): Promise<boolean> => {
    try {
      const profile = profiles.find(p => p.id === profileId);
      if (!profile) {
        throw new Error('Profil non trouvé');
      }

      // Vérifier le mot de passe en appelant l'API de connexion
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: profile.email, password }),
      });

      if (!response.ok) {
        return false; // Mot de passe incorrect
      }

      const data = await response.json();
      
      // Mettre à jour le token et la dernière connexion
      const updatedProfile = {
        ...profile,
        token: data.token,
        lastLogin: new Date().toISOString(),
      };

      // Mettre à jour le profil dans la liste
      setProfiles(prev => prev.map(p => p.id === profileId ? updatedProfile : p));
      
      // Définir comme profil actuel
      setCurrentProfile(updatedProfile);
      
      return true;
    } catch (error) {
      console.error('Erreur lors du changement de profil:', error);
      return false;
    }
  };

  const value: ProfileContextType = {
    profiles,
    currentProfile,
    addProfile,
    removeProfile,
    switchProfile,
    switchProfileWithAuth,
    updateProfile,
    clearAllProfiles,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
