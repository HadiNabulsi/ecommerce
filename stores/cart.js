import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  
  getters: {
    cartCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    cartTotal: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    formattedCartTotal: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    }
  },
  
  actions: {
    // Cargar los items del carrito desde localStorage
    loadCart() {
      if (process.client) { // Verificar que estamos en el cliente
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          this.items = JSON.parse(savedCart);
        }
      }
    },
    
    // Guardar los items del carrito en localStorage
    saveCart() {
      if (process.client) { // Verificar que estamos en el cliente
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
    },
    
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        this.items.push({ ...product, quantity: product.quantity || 1 });
      }
      
      // Guardar el carrito actualizado
      this.saveCart();
      
      // Show notification or feedback
      this.showAddedToCartNotification(product.title);
    },
    
    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id === productId);
      if (index !== -1) {
        this.items.splice(index, 1);
        // Guardar el carrito actualizado
        this.saveCart();
      }
    },
    
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
        
        // Remove item if quantity is 0
        if (quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          // Guardar el carrito actualizado
          this.saveCart();
        }
      }
    },
    
    clearCart() {
      this.items = [];
      // Guardar el carrito actualizado (vacío)
      this.saveCart();
    },
    
    showAddedToCartNotification(productTitle) {
      // This would be better implemented with a proper notification system
      // For now, we'll just log to console
      console.log(`Added to cart: ${productTitle}`);
    }
  },
});
