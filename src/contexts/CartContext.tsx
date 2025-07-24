import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product } from '../types';
import { toast } from 'react-toastify';

interface CartContextProps {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  // Load cart from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Calculate totals whenever items change
  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    return { totalItems, totalPrice };
  };

  // Add product to cart
  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.items.findIndex(item => item.product._id === product._id);
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        updatedItems = [...prevCart.items];
        
        // Check if there's enough stock
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        if (newQuantity > product.inStock) {
          toast.warning(`Maaf, hanya ${product.inStock} Barang yang tersedia di stok.`);
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: product.inStock
          };
        } else {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: newQuantity
          };
          toast.success(`${product.name} Jumlah barang telah diperbarui di keranjang belanja!`);
        }
      } else {
        // Add new item if product doesn't exist
        if (quantity > product.inStock) {
          quantity = product.inStock;
          toast.warning(`Maaf, hanya ${product.inStock} Barang yang tersedia di stok.`);
        }
        
        updatedItems = [...prevCart.items, { product, quantity }];
        toast.success(`${product.name} ditambahkan ke keranjang belanja!`);
      }

      const { totalItems, totalPrice } = calculateTotals(updatedItems);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.product._id !== productId);
      const { totalItems, totalPrice } = calculateTotals(updatedItems);
      
      toast.info('Barang telah dihapus dari keranjang belanja');
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  };

  // Update product quantity
  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => {
        if (item.product._id === productId) {
          // Check if there's enough stock
          if (quantity > item.product.inStock) {
            toast.warning(`Maaf, hanya ${item.product.inStock} Barang yang tersedia di stok.`);
            return { ...item, quantity: item.product.inStock };
          }
          return { ...item, quantity };
        }
        return item;
      });
      
      const { totalItems, totalPrice } = calculateTotals(updatedItems);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
    toast.info('Keranjang belanja telah dikosongkan');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
