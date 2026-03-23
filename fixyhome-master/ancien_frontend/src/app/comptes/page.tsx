"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ComptesDisponiblesPage() {
  const [showPasswords, setShowPasswords] = useState(false);

  const adminAccounts = [
    { email: 'admin@fixyhome.com', password: 'admin123', type: 'ADMIN', nom: 'Admin FixyHome', description: 'Administrateur principal' }
  ];

  const artisanAccounts = [
    { email: 'pierre.plombier@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Pierre Durand', service: 'Plomberie', experience: '12 ans' },
    { email: 'sophie.electricienne@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Sophie Lefebvre', service: 'Électricité', experience: '8 ans' },
    { email: 'michel.menage@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Michel Bertrand', service: 'Ménage', experience: '6 ans' },
    { email: 'isabelle.jardinage@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Isabelle Moreau', service: 'Jardinage', experience: '10 ans' },
    { email: 'robert.peinture@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Robert Garnier', service: 'Peinture', experience: '15 ans' },
    { email: 'marc.menuiserie@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Marc Dubois', service: 'Menuiserie', experience: '20 ans' },
    { email: 'chantal.climatisation@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Chantal Rousseau', service: 'Climatisation', experience: '7 ans' },
    { email: 'antoine.couverture@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Antoine Petit', service: 'Couverture', experience: '18 ans' },
    { email: 'lucie.demenagement@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Lucie Martin', service: 'Déménagement', experience: '5 ans' },
    { email: 'franck.securite@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Franck Leroy', service: 'Sécurité', experience: '9 ans' },
    // Artisans supplémentaires
    { email: 'thomas.plombier@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Thomas Bernard', service: 'Plomberie', experience: '8 ans' },
    { email: 'nathalie.electricienne@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Nathalie Martin', service: 'Électricité', experience: '12 ans' },
    { email: 'fatou.menage@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Fatou Diop', service: 'Ménage', experience: '8 ans' },
    { email: 'ibrahima.jardinage@fixyhome.com', password: 'admin123', type: 'ARTISAN', nom: 'Ibrahim Sarr', service: 'Jardinage', experience: '14 ans' }
  ];

  const clientAccounts = [
    { email: 'jean.client@fixyhome.com', password: 'admin123', type: 'CLIENT', nom: 'Jean Dupont', description: 'Client résidentiel' },
    { email: 'marie.client@fixyhome.com', password: 'admin123', type: 'CLIENT', nom: 'Marie Curie', description: 'Client résidentiel' },
    { email: 'paul.client@fixyhome.com', password: 'admin123', type: 'CLIENT', nom: 'Paul Martin', description: 'Client résidentiel' },
    { email: 'sophie.client@fixyhome.com', password: 'admin123', type: 'CLIENT', nom: 'Sophie Bernard', description: 'Client résidentiel' },
    { email: 'pierre.client@fixyhome.com', password: 'admin123', type: 'CLIENT', nom: 'Pierre Petit', description: 'Client résidentiel' },
    { email: 'amelie.client@fixyhome.com', password: 'admin123', type: 'CLIENT', nom: 'Amélie Rousseau', description: 'Client résidentiel' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const AccountCard = ({ account, showPassword }: { account: any, showPassword: boolean }) => (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{account.nom}</h3>
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            account.type === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
            account.type === 'ARTISAN' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {account.type}
          </span>
        </div>
        <button
          onClick={() => copyToClipboard(account.email)}
          className="text-gray-400 hover:text-gray-600"
          title="Copier l'email"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <span className="text-gray-500 w-16">Email:</span>
          <span className="font-mono text-gray-900">{account.email}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-500 w-16">Mot de passe:</span>
          <span className="font-mono text-gray-900">
            {showPassword ? account.password : '••••••••'}
          </span>
        </div>
        {account.service && (
          <div className="flex items-center">
            <span className="text-gray-500 w-16">Service:</span>
            <span className="text-gray-900">{account.service}</span>
          </div>
        )}
        {account.experience && (
          <div className="flex items-center">
            <span className="text-gray-500 w-16">Expérience:</span>
            <span className="text-gray-900">{account.experience}</span>
          </div>
        )}
        {account.description && (
          <div className="flex items-center">
            <span className="text-gray-500 w-16">Description:</span>
            <span className="text-gray-900">{account.description}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link
          href="/login"
          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comptes Disponibles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accédez à tous les comptes de démonstration pour tester la plateforme FixyHome
          </p>
        </div>

        <div className="mb-6 text-center">
          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showPasswords ? 'Masquer' : 'Afficher'} les mots de passe
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Tous les comptes utilisent le mot de passe: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
          </p>
        </div>

        {/* Section Admin */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            Administrateur
          </h2>
          <div className="grid md:grid-cols-1 gap-4">
            {adminAccounts.map((account, index) => (
              <AccountCard key={`admin-${index}`} account={account} showPassword={showPasswords} />
            ))}
          </div>
        </div>

        {/* Section Artisans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            Artisans ({artisanAccounts.length} comptes)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artisanAccounts.map((account, index) => (
              <AccountCard key={`artisan-${index}`} account={account} showPassword={showPasswords} />
            ))}
          </div>
        </div>

        {/* Section Clients */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 005.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            Clients ({clientAccounts.length} comptes)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientAccounts.map((account, index) => (
              <AccountCard key={`client-${index}`} account={account} showPassword={showPasswords} />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions de connexion</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Choisissez un compte dans la liste ci-dessus</li>
            <li>Cliquez sur "Se connecter" ou copiez l'email</li>
            <li>Utilisez le mot de passe : <code className="bg-blue-100 px-2 py-1 rounded">admin123</code></li>
            <li>Vous serez redirigé automatiquement vers votre dashboard</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-100 rounded">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Les comptes admin vont vers <code>/admin/dashboard</code>, 
              les artisans et clients vont vers <code>/dashboard</code>.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aller à la page de connexion
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
