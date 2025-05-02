// متجر المفضلة باستخدام Pinia
import { defineStore } from 'pinia';

// التحقق من وجود localStorage (لأنه غير متاح في بيئة الخادم)
const isClient = typeof window !== 'undefined';
const storage = isClient ? localStorage : {
  getItem: () => null,
  setItem: () => null
};

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: []
  }),
  
  getters: {
    wishlistItems: (state) => state.items,
    isInWishlist: (state) => (productId) => state.items.some(item => item.id === productId)
  },
  
  actions: {
    // إضافة منتج إلى المفضلة
    addToWishlist(product) {
      if (!this.isInWishlist(product.id)) {
        this.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image
        });
        this.saveWishlist();
      }
    },
    
    // إزالة منتج من المفضلة
    removeFromWishlist(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveWishlist();
    },
    
    // تبديل حالة المنتج في المفضلة (إضافة أو إزالة)
    toggleWishlist(product) {
      if (this.isInWishlist(product.id)) {
        this.removeFromWishlist(product.id);
      } else {
        this.addToWishlist(product);
      }
    },
    
    // حفظ المفضلة في localStorage
    saveWishlist() {
      if (isClient) {
        storage.setItem('wishlist', JSON.stringify(this.items));
      }
    },
    
    // تحميل المفضلة من localStorage
    loadWishlist() {
      if (isClient) {
        const savedWishlist = storage.getItem('wishlist');
        if (savedWishlist) {
          this.items = JSON.parse(savedWishlist);
        }
      }
    }
  },
  
  // تمكين الاستمرارية باستخدام localStorage
  persist: isClient ? {
    storage,
    paths: ['items']
  } : false
});
