"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DeviceInfo {
  deviceId: string;
  deviceType: string;
  deviceModel: string;
  osName: string;
}

export default function FarotyAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interventionId = searchParams.get("interventionId");
  const amount = searchParams.get("amount") || "20";

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [walletId, setWalletId] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "wallet" | "payment">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deviceInfo: DeviceInfo = {
    deviceId: "device-" + Math.random().toString(36).substr(2, 9),
    deviceType: "MOBILE",
    deviceModel: "iPhone de Mac",
    osName: "tester"
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/faroty/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: email,
          deviceInfo
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTempToken(data.tempToken);
        setStep("otp");
      } else {
        setError(data.error || "Erreur lors de l'envoi du code OTP");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/faroty/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otpCode,
          tempToken,
          deviceInfo
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Créer le wallet
        await createWallet();
      } else {
        setError(data.error || "Code OTP invalide");
      }
    } catch (err) {
      setError("Erreur de vérification OTP");
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      const legalIdentifier = Math.random().toString(36).substr(2, 9);
      const refId = Math.random().toString(36).substr(2, 9);

      const response = await fetch("http://localhost:8080/api/faroty/create-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          legalIdentifier,
          refId
        })
      });

      const data = await response.json();

      if (response.ok && data.data) {
        setWalletId(data.data.walletId);
        setStep("payment");
        // Créer la session de paiement
        await createPaymentSession(data.data.walletId);
      } else {
        setError("Erreur lors de la création du wallet");
      }
    } catch (err) {
      setError("Erreur de création du wallet");
    }
  };

  const createPaymentSession = async (walletId: string) => {
    try {
      const cancelUrl = `${window.location.origin}/dashboard/client/interventions`;
      const successUrl = `${window.location.origin}/payment/success?interventionId=${interventionId}`;

      const response = await fetch("http://localhost:8080/api/faroty/create-payment-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletId,
          amount: parseFloat(amount),
          cancelUrl,
          successUrl,
          interventionId: interventionId ? parseInt(interventionId) : null
        })
      });

      const data = await response.json();

      if (response.ok && data.data && data.data.sessionUrl) {
        // Rediriger vers la page de paiement Faroty
        window.location.href = data.data.sessionUrl;
      } else {
        setError("Erreur lors de la création de la session de paiement");
      }
    } catch (err) {
      setError("Erreur de création de la session de paiement");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo Faroty */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">F</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === "email" && "Connexion Faroty"}
              {step === "otp" && "Vérification OTP"}
              {step === "wallet" && "Création du wallet"}
              {step === "payment" && "Paiement en cours"}
            </h1>
            <p className="text-gray-600 text-sm">
              {step === "email" && "Entrez votre email pour recevoir le code OTP"}
              {step === "otp" && "Entrez le code reçu par email"}
              {step === "wallet" && "Création de votre wallet Faroty..."}
              {step === "payment" && "Redirection vers la page de paiement..."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Étape Email */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Envoi en cours..." : "Recevoir le code OTP"}
              </button>
            </form>
          )}

          {/* Étape OTP */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code OTP
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="123456"
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Code envoyé à {email}
                </p>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-orange-500 hover:text-orange-600 text-sm"
                >
                  Modifier l'email
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Vérification..." : "Vérifier le code"}
              </button>
            </form>
          )}

          {/* Étape Wallet */}
          {step === "wallet" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Création de votre wallet Faroty...</p>
            </div>
          )}

          {/* Étape Payment */}
          {step === "payment" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Redirection vers la page de paiement...</p>
              <p className="text-sm text-gray-500 mt-2">Montant: {amount} XAF</p>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p className="mb-2">• Le code OTP expirera après 10 minutes</p>
              <p className="mb-2">• Gardez votre code sécurisé</p>
              <p>• Faroty protège vos transactions</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
