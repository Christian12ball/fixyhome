"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ArtisanGeneratorProps {
  token?: string;
}

export default function ArtisanGenerator({ token }: ArtisanGeneratorProps) {
  const { register } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  // Données des artisans à générer pour chaque service
  const artisansByService = [
    // Plomberie
    {
      firstName: "Thomas",
      lastName: "Bernard",
      email: "thomas.plombier@fixyhome.com",
      phone: "+221770000030",
      password: "admin123",
      userType: "ARTISAN",
      category: "Plomberie",
      description: "Plombier spécialisé en installations neuves et rénovations complètes. Certifié RGE.",
      experience: 8,
      hourlyRate: 48,
      address: "123 Rue du Commerce",
      city: "Dakar",
      postalCode: "10001"
    },
    {
      firstName: "Marc",
      lastName: "Laurent",
      email: "marc.plombier@fixyhome.com",
      phone: "+221770000031",
      password: "admin123",
      userType: "ARTISAN",
      category: "Plomberie",
      description: "Expert en dépannage plomberie d'urgence. Disponible 24h/24 et jours fériés.",
      experience: 15,
      hourlyRate: 55,
      address: "45 Avenue des Plombiers",
      city: "Dakar",
      postalCode: "10002"
    },
    {
      firstName: "David",
      lastName: "Petit",
      email: "david.plombier@fixyhome.com",
      phone: "+221770000032",
      password: "admin123",
      userType: "ARTISAN",
      category: "Plomberie",
      description: "Plombier généraliste avec 6 ans d'expérience. Travail soigné et rapide.",
      experience: 6,
      hourlyRate: 42,
      address: "78 Rue de la Fontaine",
      city: "Dakar",
      postalCode: "10003"
    },
    // Électricité
    {
      firstName: "Nathalie",
      lastName: "Martin",
      email: "nathalie.electricienne@fixyhome.com",
      phone: "+221770000040",
      password: "admin123",
      userType: "ARTISAN",
      category: "Électricité",
      description: "Électricienne spécialisée en installations domotiques et systèmes intelligents.",
      experience: 12,
      hourlyRate: 58,
      address: "156 Avenue Ampère",
      city: "Dakar",
      postalCode: "20001"
    },
    {
      firstName: "Vincent",
      lastName: "Rousseau",
      email: "vincent.electricien@fixyhome.com",
      phone: "+221770000041",
      password: "admin123",
      userType: "ARTISAN",
      category: "Électricité",
      description: "Électricien industriel et résidentiel. Habilité pour les installations haute tension.",
      experience: 10,
      hourlyRate: 52,
      address: "89 Boulevard Volta",
      city: "Dakar",
      postalCode: "20002"
    },
    {
      firstName: "Stéphane",
      lastName: "Leroy",
      email: "stephane.electricien@fixyhome.com",
      phone: "+221770000042",
      password: "admin123",
      userType: "ARTISAN",
      category: "Électricité",
      description: "Électricien polyvalent spécialisé en rénovation et mise aux normes.",
      experience: 7,
      hourlyRate: 45,
      address: "234 Rue Edison",
      city: "Dakar",
      postalCode: "20003"
    },
    // Ménage
    {
      firstName: "Fatou",
      lastName: "Diop",
      email: "fatou.menage@fixyhome.com",
      phone: "+221770000050",
      password: "admin123",
      userType: "ARTISAN",
      category: "Ménage",
      description: "Service de ménage professionnel. Équipe de 4 personnes pour grands volumes.",
      experience: 8,
      hourlyRate: 28,
      address: "67 Rue de la Propreté",
      city: "Dakar",
      postalCode: "30001"
    },
    {
      firstName: "Awa",
      lastName: "Ndiaye",
      email: "awa.menage@fixyhome.com",
      phone: "+221770000051",
      password: "admin123",
      userType: "ARTISAN",
      category: "Ménage",
      description: "Spécialiste en nettoyage fin de chantier et vitrerie. Matériel professionnel fourni.",
      experience: 5,
      hourlyRate: 32,
      address: "123 Avenue du Nettoyage",
      city: "Dakar",
      postalCode: "30002"
    },
    {
      firstName: "Marie",
      lastName: "Fall",
      email: "marie.menage@fixyhome.com",
      phone: "+221770000052",
      password: "admin123",
      userType: "ARTISAN",
      category: "Ménage",
      description: "Service de ménage et repassage. Travail méticuleux et fiable.",
      experience: 6,
      hourlyRate: 30,
      address: "456 Rue de la Brise",
      city: "Dakar",
      postalCode: "30003"
    },
    // Jardinage
    {
      firstName: "Ibrahim",
      lastName: "Sarr",
      email: "ibrahima.jardinage@fixyhome.com",
      phone: "+221770000060",
      password: "admin123",
      userType: "ARTISAN",
      category: "Jardinage",
      description: "Paysagiste spécialisé en jardins méditerranéens et irrigation automatique.",
      experience: 14,
      hourlyRate: 38,
      address: "789 Route des Jardins",
      city: "Dakar",
      postalCode: "40001"
    },
    {
      firstName: "Oumar",
      lastName: "Ba",
      email: "oumar.jardinage@fixyhome.com",
      phone: "+221770000061",
      password: "admin123",
      userType: "ARTISAN",
      category: "Jardinage",
      description: "Jardinier expert en entretien de terrasses et balcons. Petits et grands espaces.",
      experience: 9,
      hourlyRate: 35,
      address: "234 Avenue Verte",
      city: "Dakar",
      postalCode: "40002"
    },
    {
      firstName: "Moussa",
      lastName: "Cisse",
      email: "moussa.jardinage@fixyhome.com",
      phone: "+221770000062",
      password: "admin123",
      userType: "ARTISAN",
      category: "Jardinage",
      description: "Spécialiste en tonte, taille et désherbage. Matériel moderne disponible.",
      experience: 7,
      hourlyRate: 32,
      address: "567 Chemin des Fleurs",
      city: "Dakar",
      postalCode: "40003"
    },
    // Peinture
    {
      firstName: "Julien",
      lastName: "Gauthier",
      email: "julien.peinture@fixyhome.com",
      phone: "+221770000070",
      password: "admin123",
      userType: "ARTISAN",
      category: "Peinture",
      description: "Peintre décorateur spécialisé en finitions haut de gamme et effets spéciaux.",
      experience: 12,
      hourlyRate: 45,
      address: "890 Rue des Peintres",
      city: "Dakar",
      postalCode: "50001"
    },
    {
      firstName: "Nicolas",
      lastName: "Durand",
      email: "nicolas.peinture@fixyhome.com",
      phone: "+221770000071",
      password: "admin123",
      userType: "ARTISAN",
      category: "Peinture",
      description: "Peintre polyvalent intérieur/extérieur. Préparation des surfaces comprise.",
      experience: 9,
      hourlyRate: 42,
      address: "345 Avenue des Couleurs",
      city: "Dakar",
      postalCode: "50002"
    },
    {
      firstName: "Alexandre",
      lastName: "Morel",
      email: "alexandre.peinture@fixyhome.com",
      phone: "+221770000072",
      password: "admin123",
      userType: "ARTISAN",
      category: "Peinture",
      description: "Peintre rapide et soigné. Spécialiste en rénovation rapide de locaux.",
      experience: 6,
      hourlyRate: 38,
      address: "678 Rue du Pinceau",
      city: "Dakar",
      postalCode: "50003"
    },
    // Menuiserie
    {
      firstName: "Sébastien",
      lastName: "Blanc",
      email: "sebastien.menuiserie@fixyhome.com",
      phone: "+221770000080",
      password: "admin123",
      userType: "ARTISAN",
      category: "Menuiserie",
      description: "Menuisier spécialisé en cuisines sur mesure et aménagement dressing.",
      experience: 16,
      hourlyRate: 52,
      address: "123 Rue du Bois",
      city: "Dakar",
      postalCode: "60001"
    },
    {
      firstName: "Guillaume",
      lastName: "Rouge",
      email: "guillaume.menuiserie@fixyhome.com",
      phone: "+221770000081",
      password: "admin123",
      userType: "ARTISAN",
      category: "Menuiserie",
      description: "Ébéniste traditionnel et moderne. Restauration de meubles anciens.",
      experience: 11,
      hourlyRate: 48,
      address: "456 Avenue de l'Ébénisterie",
      city: "Dakar",
      postalCode: "60002"
    },
    {
      firstName: "Antoine",
      lastName: "Noir",
      email: "antoine.menuiserie@fixyhome.com",
      phone: "+221770000082",
      password: "admin123",
      userType: "ARTISAN",
      category: "Menuiserie",
      description: "Menuisier polyvalent. Agencement, placards, portes, fenêtres.",
      experience: 8,
      hourlyRate: 45,
      address: "789 Boulevard du Menuisier",
      city: "Dakar",
      postalCode: "60003"
    },
    // Climatisation
    {
      firstName: "Laurent",
      lastName: "Garcia",
      email: "laurent.climatisation@fixyhome.com",
      phone: "+221770000090",
      password: "admin123",
      userType: "ARTISAN",
      category: "Climatisation",
      description: "Technicien expert en climatisation réversible et pompes à chaleur.",
      experience: 11,
      hourlyRate: 55,
      address: "234 Rue du Frais",
      city: "Dakar",
      postalCode: "70001"
    },
    {
      firstName: "Pierre",
      lastName: "Silva",
      email: "pierre.climatisation@fixyhome.com",
      phone: "+221770000091",
      password: "admin123",
      userType: "ARTISAN",
      category: "Climatisation",
      description: "Spécialiste en installation et maintenance de systèmes HVAC industriels.",
      experience: 9,
      hourlyRate: 50,
      address: "567 Avenue du Climat",
      city: "Dakar",
      postalCode: "70002"
    },
    {
      firstName: "Olivier",
      lastName: "Costa",
      email: "olivier.climatisation@fixyhome.com",
      phone: "+221770000092",
      password: "admin123",
      userType: "ARTISAN",
      category: "Climatisation",
      description: "Technicien en climatisation et chauffage. Contrats d'entretien annuels.",
      experience: 7,
      hourlyRate: 48,
      address: "890 Boulevard du Vent",
      city: "Dakar",
      postalCode: "70003"
    },
    // Couverture
    {
      firstName: "Philippe",
      lastName: "Martinez",
      email: "philippe.couverture@fixyhome.com",
      phone: "+221770000100",
      password: "admin123",
      userType: "ARTISAN",
      category: "Couverture",
      description: "Couvreur spécialisé en toiture plate et étanchéité. Garantie décennale.",
      experience: 13,
      hourlyRate: 58,
      address: "345 Rue du Toit",
      city: "Dakar",
      postalCode: "80001"
    },
    {
      firstName: "Christophe",
      lastName: "Lopez",
      email: "christophe.couverture@fixyhome.com",
      phone: "+221770000101",
      password: "admin123",
      userType: "ARTISAN",
      category: "Couverture",
      description: "Couvreur traditionnel spécialisé en tuiles et ardoises. Rénovation complète.",
      experience: 17,
      hourlyRate: 62,
      address: "678 Avenue de la Couverture",
      city: "Dakar",
      postalCode: "80002"
    },
    {
      firstName: "David",
      lastName: "Fernandez",
      email: "david.couverture@fixyhome.com",
      phone: "+221770000102",
      password: "admin123",
      userType: "ARTISAN",
      category: "Couverture",
      description: "Couvreur polyvalent. Toiture métallique et charpente bois.",
      experience: 8,
      hourlyRate: 55,
      address: "901 Boulevard du Couvreur",
      city: "Dakar",
      postalCode: "80003"
    },
    // Déménagement
    {
      firstName: "Eric",
      lastName: "Dubois",
      email: "eric.demenagement@fixyhome.com",
      phone: "+221770000110",
      password: "admin123",
      userType: "ARTISAN",
      category: "Déménagement",
      description: "Service de déménagement international. Emballage et déballage compris.",
      experience: 12,
      hourlyRate: 65,
      address: "456 Rue du Déménagement",
      city: "Dakar",
      postalCode: "90001"
    },
    {
      firstName: "Patrice",
      lastName: "Lambert",
      email: "patrice.demenagement@fixyhome.com",
      phone: "+221770000111",
      password: "admin123",
      userType: "ARTISAN",
      category: "Déménagement",
      description: "Déménageur spécialisé en objets fragiles et œuvres d'art.",
      experience: 8,
      hourlyRate: 55,
      address: "789 Avenue du Transport",
      city: "Dakar",
      postalCode: "90002"
    },
    {
      firstName: "François",
      lastName: "Muller",
      email: "francois.demenagement@fixyhome.com",
      phone: "+221770000112",
      password: "admin123",
      userType: "ARTISAN",
      category: "Déménagement",
      description: "Déménagement local et régional. Camions de 3 à 20m³ disponibles.",
      experience: 6,
      hourlyRate: 45,
      address: "123 Route du Mouvement",
      city: "Dakar",
      postalCode: "90003"
    },
    // Sécurité
    {
      firstName: "Jean-Pierre",
      lastName: "Schmidt",
      email: "jean-pierre.securite@fixyhome.com",
      phone: "+221770000120",
      password: "admin123",
      userType: "ARTISAN",
      category: "Sécurité",
      description: "Expert en systèmes de sécurité connectés et domotique. Certifié APSAD.",
      experience: 14,
      hourlyRate: 60,
      address: "567 Rue de la Sécurité",
      city: "Dakar",
      postalCode: "10001"
    },
    {
      firstName: "Michel",
      lastName: "Wagner",
      email: "michel.securite@fixyhome.com",
      phone: "+221770000121",
      password: "admin123",
      userType: "ARTISAN",
      category: "Sécurité",
      description: "Spécialiste en vidéosurveillance et contrôle d'accès. Maintenance 24h/24.",
      experience: 10,
      hourlyRate: 55,
      address: "890 Avenue de la Protection",
      city: "Dakar",
      postalCode: "10002"
    },
    {
      firstName: "Jean-Luc",
      lastName: "Fischer",
      email: "jean-luc.securite@fixyhome.com",
      phone: "+221770000122",
      password: "admin123",
      userType: "ARTISAN",
      category: "Sécurité",
      description: "Technicien en alarmes et systèmes anti-intrusion. Installation rapide.",
      experience: 7,
      hourlyRate: 50,
      address: "234 Boulevard de la Vigilance",
      city: "Dakar",
      postalCode: "10003"
    }
  ];

  const generateArtisans = async () => {
    setIsGenerating(true);
    setMessage("");
    setIsSuccess(false);
    setGeneratedCount(0);

    try {
      let successCount = 0;
      let errorCount = 0;

      // Générer les artisans un par un avec un petit délai
      for (const artisan of artisansByService) {
        try {
          await register(artisan);
          successCount++;
          setGeneratedCount(successCount);
          
          // Petit délai pour ne pas surcharger le backend
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Erreur lors de la création de l'artisan ${artisan.email}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        setIsSuccess(true);
        setMessage(`✅ ${successCount} artisans créés avec succès dans la base de données PostgreSQL !${errorCount > 0 ? ` (${errorCount} erreurs)` : ''}`);
      } else {
        setIsSuccess(false);
        setMessage(`❌ Erreur lors de la création des artisans. ${errorCount} erreurs.`);
      }
    } catch (error) {
      console.error('Erreur générale:', error);
      setIsSuccess(false);
      setMessage("❌ Erreur lors de la génération des artisans");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Générateur d'Artisans
        </h2>
        <p className="text-gray-600">
          Créez automatiquement 30 artisans (3 par service) dans la base de données PostgreSQL
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Services couverts :</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
          <div>• Plomberie (3 artisans)</div>
          <div>• Électricité (3 artisans)</div>
          <div>• Ménage (3 artisans)</div>
          <div>• Jardinage (3 artisans)</div>
          <div>• Peinture (3 artisans)</div>
          <div>• Menuiserie (3 artisans)</div>
          <div>• Climatisation (3 artisans)</div>
          <div>• Couverture (3 artisans)</div>
          <div>• Déménagement (3 artisans)</div>
          <div>• Sécurité (3 artisans)</div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-2">Caractéristiques des artisans :</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• 6-17 ans d'expérience</li>
          <li>• Rating de 4.2 à 4.9</li>
          <li>• Taux horaire de 25€ à 65€</li>
          <li>• Tous vérifiés et actifs</li>
          <li>• Localisés à Dakar et environs</li>
        </ul>
      </div>

      {isGenerating && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mr-3"></div>
            <div>
              <p className="text-yellow-800 font-medium">
                Génération en cours...
              </p>
              <p className="text-yellow-600 text-sm">
                {generatedCount} artisans créés sur {artisansByService.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium">{message}</p>
        </div>
      )}

      <button
        onClick={generateArtisans}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? `Génération en cours... (${generatedCount}/${artisansByService.length})` : '🔧 Générer 30 Artisans'}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Les artisans seront enregistrés dans PostgreSQL via le backend Spring-boot
        </p>
      </div>
    </div>
  );
}
