'use client';

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function FAQ() {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const faqItems = [
    {
      id: 1,
      category: "Général",
      question: "Comment fonctionne FixyHome ?",
      answer: "FixyHome est une plateforme qui met en relation les clients avec des artisans qualifiés. Vous pouvez rechercher des services, contacter des artisans, demander des devis et suivre vos interventions en temps réel."
    },
    {
      id: 2,
      category: "Général",
      question: "Est-ce gratuit d'utiliser FixyHome ?",
      answer: "Oui, l'utilisation de la plateforme FixyHome est entièrement gratuite pour les clients. Vous pouvez rechercher des artisans, contacter des professionnels et demander des devis sans aucun coût."
    },
    {
      id: 3,
      category: "Artisans",
      question: "Comment devenir artisan sur FixyHome ?",
      answer: "Pour devenir artisan, inscrivez-vous via le lien 'Devenir artisan' sur notre page d'accueil. Vous devrez fournir vos informations professionnelles, vos certifications et une description de vos services."
    },
    {
      id: 4,
      category: "Artisans",
      question: "Les artisans sont-ils vérifiés ?",
      answer: "Oui, tous nos artisans passent par un processus de vérification rigoureux. Nous vérifions leurs identités, leurs certifications, leurs assurances et leurs expériences professionnelles."
    },
    {
      id: 5,
      category: "Paiement",
      question: "Comment payer pour les services ?",
      answer: "Le paiement se fait directement via notre plateforme sécurisée. Vous pouvez payer par carte bancaire, virement bancaire ou PayPal. Le paiement n'est débloqué qu'une fois le service terminé et validé."
    },
    {
      id: 6,
      category: "Paiement",
      question: "Quels sont les frais de service ?",
      answer: "FixyHome prélève une commission de 10% sur le montant total de chaque service. Cette commission permet de maintenir la plateforme, d'assurer le support client et la sécurité des transactions."
    },
    {
      id: 7,
      category: "Sécurité",
      question: "Mes informations sont-elles sécurisées ?",
      answer: "Oui, nous utilisons des technologies de pointe pour protéger vos données personnelles et financières. Toutes les transactions sont cryptées et nous ne partageons jamais vos informations sans votre consentement."
    },
    {
      id: 8,
      category: "Sécurité",
      question: "Que faire en cas de litige avec un artisan ?",
      answer: "En cas de litige, notre équipe de médiation intervient rapidement pour trouver une solution amiable. Nous garantissons une résolution équitable pour toutes les parties."
    }
  ];

  const categories = ["Tous", "Général", "Artisans", "Paiement", "Sécurité"];
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredItems = selectedCategory === "Tous" 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const toggleItem = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header moderne */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Questions Fréquentes ❓
                </h1>
                <p className="text-blue-100 text-lg">
                  Trouvez des réponses à toutes vos questions sur FixyHome
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-4xl">💡</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des questions/réponses */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                  expandedItem === item.id ? 'rotate-180' : ''
                }`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {expandedItem === item.id && (
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section contact si pas de réponse */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-3">Pas trouvé votre réponse ?</h3>
            <p className="text-blue-700 mb-8 max-w-2xl mx-auto">
              Notre équipe support est disponible pour répondre à toutes vos questions. N'hésitez pas à nous contacter !
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contacter le support
              </Link>
              <Link 
                href="/directory" 
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium border border-blue-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Voir les artisans
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
