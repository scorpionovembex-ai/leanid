import { NextResponse } from 'next/server';

// Data sementara buat nampung produk (bisa disesuaikan pakai database nanti)
let products: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description } = body;

    // Validasi data produk
    if (!name || !price) {
      return NextResponse.json({ status: "error", message: "Nama dan harga produk wajib diisi!" }, { status: 400 });
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      description: description || ""
    };

    products.push(newProduct);

    return NextResponse.json({
      status: "success",
      message: "Produk berhasil ditambahkan!",
      data: newProduct
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Gagal memproses penambahan produk" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "success", data: products });
}
