import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Utensils, Truck } from 'lucide-react';
import axios from 'axios';
import { Product } from '../types';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/products?featured=true&limit=4`);
        setFeaturedProducts(response.data.data);
      } catch (error) {
        console.error('Error mengambil produk unggulan:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [apiUrl]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-gradient-to-r from-primary-50 to-neutral-100">
        <div className="container-custom flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              Jajanan Pasar Indonesia Terbaik
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-4">
              Makanan Tradisional Diantar ke <span className="text-primary-500">Rumah Anda</span>
            </h1>
            <p className="text-lg text-neutral-700 mb-8">
              Nikmati jajanan dan makanan tradisional Indonesia yang dibuat dengan cinta menggunakan resep asli dan bahan berkualitas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary text-center py-3 px-6">
                Belanja Sekarang
              </Link>
              <Link to="/contact" className="btn-outline text-center py-3 px-6">
                Hubungi Kami
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg" 
                alt="Makanan Tradisional Indonesia" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Mengapa Memilih Cici Kitchen?</h2>
            <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
              Kami mengutamakan kualitas, tradisi, dan pelayanan terbaik untuk memberikan pengalaman jajanan pasar Indonesia yang terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Resep Autentik</h3>
              <p className="text-neutral-600">
                Resep tradisional turun-temurun, menjaga keaslian rasa Indonesia.
              </p>
            </div>

            <div className="p-6 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Kualitas Premium</h3>
              <p className="text-neutral-600">
                Hanya menggunakan bahan-bahan terbaik untuk hasil yang memuaskan.
              </p>
            </div>

            <div className="p-6 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pengiriman Cepat</h3>
              <p className="text-neutral-600">
                Layanan pengiriman cepat dan aman langsung ke pintu Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-neutral-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Produk Unggulan</h2>
            <Link 
              to="/products" 
              className="flex items-center text-primary-500 hover:text-primary-600 font-medium"
            >
              Lihat Semua <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <ShoppingBag className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Belum ada produk unggulan</h3>
              <p className="text-neutral-600 mb-6">Silakan cek kembali nanti untuk produk unggulan kami!</p>
              <Link to="/products" className="btn-primary">
                Lihat Semua Produk
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Apa Kata Pelanggan Kami</h2>
            <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
              Jangan hanya percaya kata kami - lihat apa yang pelanggan kami katakan tentang produk dan layanan kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-neutral-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center text-primary-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 mb-4">
                "Risoles-nya enak sekali! Kulitnya renyah dan isiannya lezat. Mengingatkan saya pada masakan nenek."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-300 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" 
                    alt="Ani Wijaya" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h5 className="font-medium">Ani Wijaya</h5>
                  <p className="text-sm text-neutral-500">Jakarta</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center text-primary-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 mb-4">
                "Saya pesan untuk acara keluarga dan semuanya suka. Lontongnya enak dan mengingatkan kami pada masakan rumah."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-300 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" 
                    alt="Budi Santoso" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h5 className="font-medium">Budi Santoso</h5>
                  <p className="text-sm text-neutral-500">Surabaya</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center text-primary-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 mb-4">
                "Pengiriman cepat dan pengemasan bagus. Kue cubitnya masih segar dan enak. Anak-anak suka dan saya sudah pesan lagi!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-300 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg" 
                    alt="Dewi Putri" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h5 className="font-medium">Dewi Putri</h5>
                  <p className="text-sm text-neutral-500">Bandung</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="container-custom">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Siap Memesan?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Jelajahi berbagai pilihan jajanan pasar tradisional Indonesia dan nikmati kelezatan autentik diantar ke rumah Anda.
            </p>
            <Link to="/products" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-md font-medium hover:bg-neutral-100 transition-colors">
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;