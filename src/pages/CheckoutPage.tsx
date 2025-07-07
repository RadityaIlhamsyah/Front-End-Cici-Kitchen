import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { PaymentMethod } from '../types';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [notes, setNotes] = useState('');

  // Calculate shipping cost based on payment method
  const getShippingCost = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.COD:
        return 5000; // COD: Rp5.000
      case PaymentMethod.BANK_MANDIRI:
      case PaymentMethod.QRIS_MANDIRI:
        return 0; // Transfer Bank: Gratis
      default:
        return 5000;
    }
  };

  const shippingCost = getShippingCost(paymentMethod);
  const totalPrice = cart.totalPrice + shippingCost;

  const getImageUrl = (imagePath: string) => {
    // Jika sudah URL lengkap (http/https), gunakan langsung
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Jika path lokal, tambahkan base URL
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.totalPrice,
        shippingPrice: shippingCost,
        totalPrice: totalPrice,
        notes,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      clearCart();
      toast.success('Pesanan berhasil dibuat!');
      navigate(`/orders/${response.data.data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="py-6 md:py-10">
      <div className="container-custom">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Checkout</h1>

        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Form Checkout */}
          <div className="order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Truck className="h-5 w-5 text-primary-500 mr-2" />
                  <h2 className="text-lg md:text-xl font-semibold">Informasi Pengiriman</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input type="text" id="fullName" name="fullName" required value={shippingAddress.fullName} onChange={handleInputChange} className="input-field" placeholder="Masukkan nama lengkap" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input type="tel" id="phone" name="phone" required value={shippingAddress.phone} onChange={handleInputChange} className="input-field" placeholder="Masukkan nomor telepon" />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                      Alamat
                    </label>
                    <input type="text" id="address" name="address" required value={shippingAddress.address} onChange={handleInputChange} className="input-field" placeholder="Masukkan alamat lengkap" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                        Kota
                      </label>
                      <input type="text" id="city" name="city" required value={shippingAddress.city} onChange={handleInputChange} className="input-field" placeholder="Masukkan kota" />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                        Kode Pos
                      </label>
                      <input type="text" id="postalCode" name="postalCode" required value={shippingAddress.postalCode} onChange={handleInputChange} className="input-field" placeholder="Masukkan kode pos" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Metode Pembayaran</h2>
                <PaymentMethodSelector selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />

                {/* Shipping Cost Info */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="text-sm text-blue-800">
                    <strong>Informasi Ongkos Kirim:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• COD (Bayar di Tempat): Rp5.000</li>
                      <li>• Transfer Bank: Gratis</li>
                      <li>• QRIS: Gratis</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="h-5 w-5 text-primary-500 mr-2" />
                  <h2 className="text-lg md:text-xl font-semibold">Catatan Pesanan</h2>
                </div>

                <textarea id="notes" name="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field" placeholder="Tambahkan catatan khusus untuk pesanan Anda (opsional)" />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  'Buat Pesanan'
                )}
              </button>
            </form>
          </div>

          {/* Ringkasan Pesanan */}
          <div className="order-1 lg:order-2">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Ringkasan Pesanan</h2>

              {/* Mobile: Compact Item List */}
              <div className="md:hidden mb-4">
                <div className="text-sm text-neutral-600 mb-2">{cart.items.length} item dalam pesanan</div>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 flex-shrink-0 bg-neutral-100 rounded overflow-hidden">
                        <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-cover" onError={handleImageError} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium truncate">{item.product.name}</div>
                        <div className="text-neutral-500">{item.quantity}x</div>
                      </div>
                      <div className="font-semibold text-primary-500">Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: Full Item List */}
              <div className="hidden md:block divide-y divide-neutral-200 mb-6">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="py-4 flex items-center">
                    <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 rounded-md overflow-hidden">
                      <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-cover" onError={handleImageError} />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-neutral-500">
                        {item.quantity} x Rp{item.product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="font-semibold">Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">Rp{cart.totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-neutral-600">Ongkos Kirim</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>{shippingCost === 0 ? 'Gratis' : `Rp${shippingCost.toLocaleString('id-ID')}`}</span>
                </div>
                {shippingCost === 0 && <div className="text-xs text-green-600 italic">Gratis ongkir untuk pembayaran transfer!</div>}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-base md:text-lg">
                    <span>Total</span>
                    <span className="text-primary-500">Rp{totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
