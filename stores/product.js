import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    featuredProducts: [],
    newArrivals: [],
    specialOffers: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id);
    },
    
    getProductsByCategory: (state) => (category) => {
      return state.products.filter(product => product.category === category);
    },
    
    getFeaturedProducts: (state) => {
      return state.featuredProducts;
    },
    
    getNewArrivals: (state) => {
      return state.newArrivals;
    },
    
    getSpecialOffers: (state) => {
      return state.specialOffers;
    },
    
    getAllCategories: (state) => {
      return state.categories;
    }
  },
  
  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        // في البيئة الحقيقية، سيتم استخدام رابط API الفعلي
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        
        // تحويل البيانات إلى الشكل المطلوب
        this.products = data.map(product => ({
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          rating: product.rating
        }));
        
        // تعيين المنتجات المميزة والجديدة والعروض الخاصة
        this.setFeaturedProducts();
        this.setNewArrivals();
        this.setSpecialOffers();
        
        this.loading = false;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'An error occurred while fetching products. Please try again.';
        this.loading = false;
      }
    },
    
    async fetchCategories() {
      try {
        // في البيئة الحقيقية، سيتم استخدام رابط API الفعلي
        const response = await fetch('https://fakestoreapi.com/products/categories');
        this.categories = await response.json();
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = 'An error occurred while fetching categories. Please try again.';
      }
    },
    
    async fetchProductById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // التحقق مما إذا كان المنتج موجودًا بالفعل في الحالة
        const existingProduct = this.getProductById(id);
        if (existingProduct) {
          this.loading = false;
          return existingProduct;
        }
        
        // في البيئة الحقيقية، سيتم استخدام رابط API الفعلي
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const product = await response.json();
        
        // تحويل البيانات إلى الشكل المطلوب
        const formattedProduct = {
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          rating: product.rating
        };
        
        // إضافة المنتج إلى القائمة إذا لم يكن موجودًا بالفعل
        if (!this.products.some(p => p.id === formattedProduct.id)) {
          this.products.push(formattedProduct);
        }
        
        this.loading = false;
        return formattedProduct;
      } catch (error) {
        console.error('Error fetching product:', error);
        this.error = 'An error occurred while fetching the product. Please try again.';
        this.loading = false;
        return null;
      }
    },
    
    async searchProducts(query) {
      this.loading = true;
      this.error = null;
      
      try {
        // في البيئة الحقيقية، سيتم استخدام رابط API للبحث
        // هنا نقوم بتصفية المنتجات المحلية بناءً على الاستعلام
        const results = this.products.filter(product => 
          product.title.toLowerCase().includes(query.toLowerCase()) || 
          product.description.toLowerCase().includes(query.toLowerCase())
        );
        
        this.loading = false;
        return results;
      } catch (error) {
        console.error('Error searching for products:', error);
        this.error = 'An error occurred while searching for products. Please try again.';
        this.loading = false;
        return [];
      }
    },
    
    setFeaturedProducts() {
      // في البيئة الحقيقية، قد يتم جلب المنتجات المميزة من API
      // هنا نختار بعض المنتجات عشوائيًا لعرضها كمنتجات مميزة
      this.featuredProducts = this.products
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    },
    
    setNewArrivals() {
      // في البيئة الحقيقية، قد يتم جلب المنتجات الجديدة من API
      // هنا نختار بعض المنتجات عشوائيًا لعرضها كمنتجات جديدة
      this.newArrivals = this.products
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
    },
    
    setSpecialOffers() {
      // في البيئة الحقيقية، قد يتم جلب العروض الخاصة من API
      // هنا نختار بعض المنتجات عشوائيًا وتطبيق خصم عليها
      this.specialOffers = this.products
        .sort(() => 0.5 - Math.random())
        .slice(0, 6)
        .map(product => ({
          ...product,
          originalPrice: product.price,
          price: (product.price * 0.8).toFixed(2) // خصم 20%
        }));
    }
  }
});
