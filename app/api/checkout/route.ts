import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId } = body;

    // KONFIGURASI KRISKRIS
    const KRISKRIS_KEY = "f0b8571ee405b4d162b42818c51c9c276d57f4a8243437563bbea9c84a8d3db2";      // Ganti key asli di sini nanti
    const KRISKRIS_SECRET = "kk_live_U80OwfAnRbaTqZPHyVfF5K5OkEy8aFTlv2SnJk8rrX0";   // Ganti secret asli di sini nanti
    const CALLBACK_URL = "2a54186693a2ba0f0c0f25eea06058ec9485323247dd75ea879db10809dd1eb3";       // Ganti callback URL di sini nanti

    // Data dummy respon berhasil (buat jalanin sistem dulu)
    const mockResponse = {
      status: "success",
      message: "QRIS KrisKris berhasil dibuat",
      qr_string: "0002010102122...MOCK_QRIS_STRING", 
      orderId: orderId,
      amount: amount
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Gagal memproses pembayaran" }, { status: 500 });
  }
}
