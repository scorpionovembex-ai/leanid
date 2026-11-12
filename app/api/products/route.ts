import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId } = body;

    // Masukin API Key, Secret, dan Callback URL asli lu di sini
    const KRISKRIS_KEY = "kk_live_U80OwfAnRbaTqZPHyVfF5K5OkEy8aFTlv2SnJk8rrX0";
    const KRISKRIS_SECRET = "f0b8571ee405b4d162b42818c51c9c276d57f4a8243437563bbea9c84a8d3db2";
    const CALLBACK_URL = "2a54186693a2ba0f0c0f25eea06058ec9485323247dd75ea879db10809dd1eb3";

    // Request ke API endpoint KrisKris yang asli
    const response = await fetch("https://api.kriskris.com/v1/charge", { // Sesuaikan URL endpoint asli KrisKris kalau beda
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KRISKRIS_KEY}`,
        "X-Secret": KRISKRIS_SECRET
      },
      body: JSON.stringify({
        amount: amount,
        order_id: orderId,
        callback_url: CALLBACK_URL
      })
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Gagal menyambungkan ke payment gateway KrisKris" }, { status: 500 });
  }
}
