import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 relative overflow-hidden">
      {/* Background décoratif */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section principale */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src="/fixyhome-logo.svg" 
                alt="FixyHome" 
                className="h-10 w-auto mr-3"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">FixyHome</h3>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Votre artisan, juste à côté</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La plateforme N°1 pour trouver votre artisan de confiance. 
              Nous connectons les clients avec des professionnels vérifiés et qualifiés pour tous vos projets.
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069 3.204 0 3.584.012 4.849.069 3.26.149 4.77 1.699 4.919 4.92.058 1.265.07 1.645.07 4.849 0 3.203-.012 3.583-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.645.07-4.849.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.588.073-2.444.338-3.298.723a6.608 6.608 0 00-2.72 2.72c-.385.854-.65 1.71-.723 3.298-.058 1.28-.072 1.688-.072 4.947 0 3.259.014 3.668.072 4.948.073 1.587.338 2.443.723 3.298a6.608 6.608 0 002.72 2.72c.854.385 1.71.65 3.298.723 1.28.058 1.688.072 4.947.072 3.259 0 3.668-.014 4.948-.072 1.587-.073 2.443-.338 3.298-.723a6.608 6.608 0 002.72-2.72c.385-.854.65-1.71.723-3.298.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.073-1.588-.338-2.444-.723-3.298a6.608 6.608 0 00-2.72-2.72c-.854-.385-1.71-.65-3.298-.723-1.28-.058-1.689-.072-4.947-.072zm0-2.163c-3.259 0-3.667.014-4.947.072-1.588.073-2.444.338-3.298.723a6.608 6.608 0 00-2.72 2.72c-.385.854-.65 1.71-.723 3.298-.058 1.28-.072 1.688-.072 4.947 0 3.259.014 3.668.072 4.948.073 1.587.338 2.443.723 3.298a6.608 6.608 0 002.72 2.72c.854.385 1.71.65 3.298.723 1.28.058 1.688.072 4.947.072 3.259 0 3.668-.014 4.948-.072 1.587-.073 2.443-.338 3.298-.723a6.608 6.608 0 002.72-2.72c.385-.854.65-1.71.723-3.298.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.073-1.588-.338-2.444-.723-3.298a6.608 6.608 0 00-2.72-2.72c-.854-.385-1.71-.65-3.298-.723-1.28-.058-1.689-.072-4.947-.072z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-bold mb-6 text-lg text-white">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🔧</span> Plomberie
              </Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">⚡</span> Électricité
              </Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🧹</span> Ménage
              </Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🌿</span> Jardinage
              </Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🎨</span> Peinture
              </Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🔨</span> Menuiserie
              </Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">❄️</span> Climatisation
              </Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🏠</span> Couverture
              </Link></li>
            </ul>
          </div>
          
          {/* Entreprise */}
          <div>
            <h4 className="font-bold mb-6 text-lg text-white">Entreprise</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🏢</span> À propos
              </Link></li>
              <li><Link href="/directory" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">👥</span> Annuaire
              </Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">📞</span> Contact
              </Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">❓</span> FAQ
              </Link></li>
              <li><Link href="/review" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">⭐</span> Avis clients
              </Link></li>
              <li><Link href="/register" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">👤</span> S'inscrire
              </Link></li>
              <li><Link href="/login" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🔐</span> Connexion
              </Link></li>
            </ul>
          </div>
          
          {/* Contact et légal */}
          <div>
            <h4 className="font-bold mb-6 text-lg text-white">Contact & Légal</h4>
            <div className="space-y-4">
              <div className="text-gray-300">
                <p className="flex items-center mb-2">
                  <span className="mr-3">📞</span>
                  <a href="tel:+33123456789" className="hover:text-white transition-colors">
                    +33 1 23 45 67 89
                  </a>
                </p>
                <p className="flex items-center mb-2">
                  <span className="mr-3">✉️</span>
                  <a href="mailto:contact@fixyhome.com" className="hover:text-white transition-colors">
                    contact@fixyhome.com
                  </a>
                </p>
                <p className="flex items-center mb-2">
                  <span className="mr-3">📍</span>
                  <span>123 Rue de la République, 75001 Paris</span>
                </p>
                <p className="flex items-center mb-2">
                  <span className="mr-3">🕐</span>
                  <span>Lun-Ven: 8h-20h, Sam: 9h-18h</span>
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <ul className="space-y-2 text-sm">
                  <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Politique de confidentialité
                  </Link></li>
                  <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Conditions générales
                  </Link></li>
                  <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                    Gestion des cookies
                  </Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h4 className="text-xl font-bold mb-2">Restez informé</h4>
              <p className="text-blue-100">Recevez nos dernières actualités et offres exclusives</p>
            </div>
            <div className="flex mt-4 md:mt-0">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-3 rounded-l-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-blue-600 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; 2026 FixyHome. Tous droits réservés.</p>
              <p className="mt-1">Made with ❤️ in France</p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>N° SIREN: 123 456 789</span>
              <span>|</span>
              <span>TVA: FR12345678901</span>
              <span>|</span>
              <span>Qualiopi certifié</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
