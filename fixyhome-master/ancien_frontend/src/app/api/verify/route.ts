"use client";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { interventionId, amount } = await request.json();

    // Récupérer le token utilisateur depuis les cookies
    const userToken = request.cookies.get('token')?.value;

    if (!userToken) {
      return NextResponse.json(
        { error: "Token utilisateur non trouvé" },
        { status: 401 }
      );
    }

    // Appeler le backend pour valider l'utilisateur et obtenir le token Faroty
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faroty/get-payment-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interventionId,
        amount
      })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.error || "Erreur lors de l'obtention du token Faroty" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    // Renvoyer le token Faroty au frontend
    return NextResponse.json({
      success: true,
      farotyToken: data.farotyToken,
      sessionUrl: data.sessionUrl,
      walletId: data.walletId
    });

  } catch (error) {
    console.error('Erreur dans /api/verify:', error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
