<template>
  <div class="wishlist-page py-5">
    <div class="container">
      <!-- مسار التنقل -->
      <Breadcrumbs :breadcrumbs="[{ name: 'Wishlist', path: '/wishlist' }]" />
      
      <!-- عنوان الصفحة -->
      <h1 class="wishlist-title mb-4">Wishlist</h1>
      
      <!-- حالة التحميل -->
      <div v-if="isLoading" class="row">
        <div class="col-12 text-center py-5">
          <div class="loading-wishlist">
            <div class="spinner-border text-dark mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p>Loading wishlist...</p>
          </div>
        </div>
      </div>
      
      <!-- حالة المفضلة الفارغة -->
      <div v-else-if="wishlistItems.length === 0" class="row">
        <div class="col-12 text-center py-5">
          <div class="empty-wishlist">
            <div class="heart-icon-large mb-3">♡</div>
            <h2 class="mb-3">Your Wishlist is Empty</h2>
            <p class="mb-4">You haven't added any products to your wishlist yet.</p>
            <NuxtLink to="/" class="btn btn-dark btn-lg px-4 py-2">
              Continue Shopping
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- محتوى المفضلة -->
      <div v-else class="row">
        <!-- قائمة المنتجات في المفضلة -->
        <div class="col-12">
          <div class="wishlist-items bg-white rounded p-0">
            <div class="wishlist-header d-none d-md-flex p-3 border-bottom">
              <div class="row w-100 align-items-center">
                <div class="col-md-2 text-center">Image</div>
                <div class="col-md-4">Product</div>
                <div class="col-md-2 text-center">Price</div>
                <div class="col-md-2 text-center">Availability</div>
                <div class="col-md-2 text-center">Actions</div>
              </div>
            </div>
            <div class="wishlist-items-container">
              <div 
                v-for="item in wishlistItems" 
                :key="item.id"
                class="wishlist-item p-3 border-bottom"
              >
                <div class="row align-items-center">
                  <div class="col-md-2 text-center mb-3 mb-md-0">
                    <NuxtLink :to="`/product/${item.id}`">
                      <img 
                        :src="item.image" 
                        :alt="item.title" 
                        class="img-fluid wishlist-item-image" 
                        style="max-height: 100px; object-fit: contain;"
                        loading="lazy"
                      />
                    </NuxtLink>
                  </div>
                  <div class="col-md-4 mb-3 mb-md-0">
                    <NuxtLink :to="`/product/${item.id}`" class="product-title-link">
                      <h5 class="product-title">{{ item.title }}</h5>
                    </NuxtLink>
                  </div>
                  <div class="col-md-2 text-center mb-3 mb-md-0">
                    <span class="product-price">${{ item.price.toFixed(2) }}</span>
                  </div>
                  <div class="col-md-2 text-center mb-3 mb-md-0">
                    <span class="badge bg-success">In Stock</span>
                  </div>
                  <div class="col-md-2 text-center">
                    <div class="d-flex flex-column flex-md-row justify-content-center gap-2">
                      <button 
                        class="btn btn-dark btn-sm"
                        @click="addToCart(item)"
                        title="Add to Cart"
                      >
                        <span class="d-none d-md-inline">Add to Cart</span>
                        <span class="d-inline d-md-none">🛒</span>
                      </button>
                      <button 
                        class="btn btn-outline-danger btn-sm"
                        @click="removeFromWishlist(item.id)"
                        title="Remove from Wishlist"
                      >
                        <span class="d-none d-md-inline">Remove</span>
                        <span class="d-inline d-md-none">✕</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- أزرار إجراءات المفضلة -->
          <div class="wishlist-actions d-flex justify-content-between mt-4">
            <NuxtLink to="/" class="btn btn-outline-dark">
              <i class="bi bi-arrow-left me-2"></i>Continue Shopping
            </NuxtLink>
            <button 
              class="btn btn-outline-danger" 
              @click="clearWishlist"
              :disabled="wishlistItems.length === 0"
            >
              <i class="bi bi-trash me-2"></i>Clear Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// استيراد المكتبات اللازمة
import { ref, computed, onMounted } from 'vue';
import { useWishlistStore } from '~/stores/wishlist';
import { useCartStore } from '~/stores/cart';

// استخدام متجر المفضلة
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

// حالة التحميل
const isLoading = ref(true);

// الحصول على عناصر المفضلة
const wishlistItems = computed(() => wishlistStore.wishlistItems);

// إضافة منتج إلى السلة
const addToCart = (item) => {
  cartStore.addToCart({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    quantity: 1
  });
};

// إزالة منتج من المفضلة
const removeFromWishlist = (productId) => {
  wishlistStore.removeFromWishlist(productId);
};

// إفراغ المفضلة
const clearWishlist = () => {
  if (confirm('Are you sure you want to clear your wishlist?')) {
    // استخدام دالة removeFromWishlist لإزالة كل منتج بشكل صحيح
    const itemsToRemove = [...wishlistItems.value];
    itemsToRemove.forEach(item => {
      wishlistStore.removeFromWishlist(item.id);
    });
  }
};

// تحميل المفضلة عند تحميل الصفحة
onMounted(() => {
  if (process.client) {
    // تحميل المفضلة من localStorage
    wishlistStore.loadWishlist();
    
    // إيقاف حالة التحميل بعد نصف ثانية
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
});
</script>

<style scoped>
.wishlist-title {
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
}

.wishlist-items {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.wishlist-header {
  background-color: #f8f9fa;
  font-weight: 600;
}

.wishlist-item {
  transition: background-color 0.2s ease;
}

.wishlist-item:hover {
  background-color: #f8f9fa;
}

.product-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-title-link {
  color: inherit;
  text-decoration: none;
}

.product-title-link:hover {
  color: #007bff;
}

.product-price {
  font-weight: 600;
  color: #212529;
}

.heart-icon-large {
  font-size: 4rem;
  color: #e91e63;
  line-height: 1;
}

@media (max-width: 767.98px) {
  .wishlist-item {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}
</style>
