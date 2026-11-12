'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, ShieldCheck, CheckCircle2, 
  Trash2, Plus, LogOut, ArrowRight
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('shop');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [customerPhone, setCustomerPhone] = useState('');
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [trackTrxId, setTrackTrxId] = useState('');
  const [trackedOrderResult, setTrackedOrderResult] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    title: '', category: 'Aplikasi', price: '', desc: '', stock: ''
  });

  useEffect(() => {
    const savedP = localStorage.getItem('lean_products');
    if (savedP) setProducts(JSON.parse(savedP));
    const savedO = localStorage.getItem('lean_orders');
    if (savedO) setOrders(JSON.parse(savedO));
  }, []);

  useEffect(() => {
    localStorage.setItem('lean_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lean_orders', JSON.stringify(orders));
  }, [orders]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.status === 'Success' ? order.price : 0), 0);
  const totalSuccessOrders = orders.filter(o => o.status === 'Success').length;

  const categories = ['All', 'Aplikasi', 'Game', 'Lisensi', 'Lainnya'];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === '1234') {
      setIsAdminLoggedIn(true);
      setPinError(false);
      setAdminPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;
    const item = {
      id: Date.now().toString(),
      ...newProduct,
      price: parseInt(newProduct.price) || 0
    };
    setProducts([...products, item]);
    setNewProduct({ title: '', category: 'Aplikasi', price: '', desc: '', stock: '' });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleStartCheckout = (product: any) => {
    setSelectedProduct(product);
    setCheckoutStep(1);
    setCustomerPhone('');
  };

  const handleCreateOrder = () => {
    if (!customerPhone) return;
    const trxId = 'LN-' + Math.floor(100000 + Math.random() * 900000);
    const newOrd = {
      id: trxId,
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      price: selectedProduct.price,
      phone: customerPhone,
      status: 'Pending',
      createdAt: new Date().toLocaleTimeString(),
      licenseCode: selectedProduct.stock || 'LISENSI-LEAN-' + Math.random().toString(36).substring(7).toUpperCase()
    };
    setOrders([newOrd, ...orders]);
    setActiveOrder(newOrd);
    setCheckoutStep(2);
  };

  const handleSimulatePayment = () => {
    if (!activeOrder) return;
    const updated = orders.map(o => o.id === activeOrder.id ? { ...o, status: 'Success' } : o);
    setOrders(updated);
    setActiveOrder({ ...activeOrder, status: 'Success' });
    setCheckoutStep(3);
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.id.toLowerCase() === trackTrxId.trim().toLowerCase());
    setTrackedOrderResult(found || 'NOT_FOUND');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              L
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight text-slate-900">LEAN.ID</h1>
              <span className="text-[10px] text-blue-600 font-semibold tracking-wide">DIGITAL STORE</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('admin')} 
            className="text-xs font-medium text-slate-500 hover:text-blue-600 bg-slate-100 px-2.5 py-1.5 rounded-full transition"
          >
            {isAdminLoggedIn ? 'Panel Admin' : 'Login Admin'}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4">
        {activeTab === 'shop' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-500/10 relative overflow-hidden">
              <div className="relative z-10">
                <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Instan & Otomatis
                </span>
                <h2 className="text-xl font-bold mt-1">Layanan Produk Digital</h2>
                <p className="text-xs text-blue-100 mt-1">Proses kilat 24 jam non-stop dengan garansi terpercaya.</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari produk digital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 text-white border-blue-600 font-medium' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Belum ada produk</p>
                  <p className="text-xs text-slate-400 mt-1">Produk dapat ditambahkan melalui Panel Admin.</p>
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div key={p.id} className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-center justify-between shadow-sm hover:border-blue-200 transition">
                    <div>
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {p.category}
                      </span>
                      <h3 className="font-semibold text-slate-900 text-sm mt-1">{p.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.desc || 'Tidak ada deskripsi'}</p>
                      <p className="font-bold text-blue-600 text-sm mt-1">Rp {p.price.toLocaleString('id-ID')}</p>
                    </div>
                    <button
                      onClick={() => handleStartCheckout(p)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shrink-0"
                    >
                      Beli
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-slate-900 text-base mb-1">Cek Status Pesanan</h2>
              <p className="text-xs text-slate-500 mb-3">Masukkan ID Transaksi kamu (Contoh: LN-123456)</p>
              
              <form onSubmit={handleTrackOrder} className="space-y-2">
                <input
                  type="text"
                  placeholder="ID Transaksi (LN-XXXXXX)"
                  value={trackTrxId}
                  onChange={(e) => setTrackTrxId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-medium text-xs py-2.5 rounded-xl hover:bg-blue-700 transition"
                >
                  Lacak Pesanan
                </button>
              </form>
            </div>

            {trackedOrderResult === 'NOT_FOUND' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center text-red-600 text-xs">
                Transaksi tidak ditemukan. Periksa kembali ID Transaksi kamu.
              </div>
            )}

            {typeof trackedOrderResult === 'object' && trackedOrderResult !== null && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {trackedOrderResult.id}</span>
                    <h3 className="font-bold text-sm text-slate-900">{trackedOrderResult.productTitle}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    trackedOrderResult.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {trackedOrderResult.status}
                  </span>
                </div>

                {trackedOrderResult.status === 'Success' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
                    <p className="text-xs font-semibold text-emerald-800">Kode Lisensi / Produk Kamu:</p>
                    <p className="font-mono text-sm font-bold text-emerald-900 select-all bg-white p-2 rounded border border-emerald-200">
                      {trackedOrderResult.licenseCode}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-600">Pesanan belum dibayar / masih diproses.</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-4">
            {!isAdminLoggedIn ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-sm mx-auto text-center">
                <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <h2 className="font-bold text-slate-900 text-base">Restricted Admin Panel</h2>
                <p className="text-xs text-slate-500 mt-1 mb-4">Masukkan PIN Admin untuk mengelola toko.</p>

                <form onSubmit={handleAdminLogin} className="space-y-3">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="PIN Admin (Default: 1234)"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    className="w-full text-center tracking-widest bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-base font-bold focus:outline-none focus:border-blue-500"
                  />
                  {pinError && <p className="text-xs text-red-500">PIN salah! Coba lagi.</p>}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-medium text-xs py-2.5 rounded-xl hover:bg-blue-700 transition"
                  >
                    Masuk Panel Admin
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600">Mode Admin Aktif</span>
                  <button 
                    onClick={() => setIsAdminLoggedIn(false)}
                    className="text-xs text-red-600 flex items-center gap-1 font-medium hover:underline"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Keluar
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white border border-slate-200 p-3 rounded-xl">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Omzet</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-xl">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Pesanan Sukses</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{totalSuccessOrders} Trx</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Tambah Produk Baru</h3>
                  <form onSubmit={handleAddProduct} className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Nama Produk"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      >
                        {categories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Harga (Rp)"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <textarea
                      placeholder="Deskripsi Singkat"
                      value={newProduct.desc}
                      onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 resize-none h-16"
                    />
                    <input
                      type="text"
                      placeholder="Stok / Kode Lisensi Default"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Tambah Ke Katalog
                    </button>
                  </form>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5">
                  <h3 className="font-bold text-sm text-slate-900">Kelola Produk ({products.length})</h3>
                  {products.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-semibold text-xs text-slate-900">{p.title}</p>
                        <p className="text-[10px] text-slate-500">Rp {p.price.toLocaleString('id-ID')} - {p.category}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Checkout Produk</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            {checkoutStep === 1 && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-semibold text-blue-600">{selectedProduct.category}</p>
                  <h4 className="font-bold text-sm text-slate-900">{selectedProduct.title}</h4>
                  <p className="font-bold text-blue-600 text-sm mt-1">Rp {selectedProduct.price.toLocaleString('id-ID')}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nomor WhatsApp (Aktif)</label>
                  <input
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={!customerPhone}
                  className="w-full bg-blue-600 disabled:bg-slate-300 text-white font-semibold text-xs py-2.5 rounded-xl transition"
                >
                  Lanjut Ke Pembayaran
                </button>
              </div>
            )}

            {checkoutStep === 2 && activeOrder && (
              <div className="space-y-4 text-center">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-semibold">ID TRANSAKSI</p>
                  <p className="font-mono font-bold text-base text-blue-900">{activeOrder.id}</p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                  <p className="text-xs text-slate-500">Scan QRIS untuk Simulasi Pembayaran:</p>
                  <div className="w-36 h-36 bg-slate-100 mx-auto rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 font-mono text-xs">
                    [ SIMULASI QRIS ]
                  </div>
                  <p className="font-bold text-slate-900 text-sm">Total: Rp {activeOrder.price.toLocaleString('id-ID')}</p>
                </div>

                <button
                  onClick={handleSimulatePayment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Simulasi Bayar Berhasil
                </button>
              </div>
            )}

            {checkoutStep === 3 && activeOrder && (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Pembayaran Berhasil!</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Produk otomatis dikirimkan di bawah ini.</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-left space-y-1">
                  <p className="text-xs font-semibold text-emerald-800">Kode Lisensi / Akses Produk:</p>
                  <p className="font-mono font-bold text-sm text-emerald-950 bg-white p-2.5 rounded border border-emerald-200 select-all">
                    {activeOrder.licenseCode}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-slate-900 text-white font-semibold text-xs py-2.5 rounded-xl transition"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
        <div className="max-w-md mx-auto flex justify-around py-2">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
              activeTab === 'shop' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Katalog</span>
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
              activeTab === 'track' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Lacak</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
              activeTab === 'admin' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Admin</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
