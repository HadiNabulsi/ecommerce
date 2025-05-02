<template>
  <div class="cart-page py-5">
    <div class="container">
      <!-- مسار التنقل -->
      <Breadcrumbs :breadcrumbs="[{ name: 'Shopping Cart', path: '/cart' }]" />
      
      <!-- عنوان الصفحة -->
      <h1 class="cart-title mb-4">Shopping Cart</h1>
      
      <!-- حالة التحميل -->
      <div v-if="isLoading" class="row">
        <div class="col-12 text-center py-5">
          <div class="loading-cart">
            <div class="spinner-border text-dark mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
      
      <!-- حالة السلة الفارغة -->
      <div v-else-if="cartItems.length === 0" class="row">
        <div class="col-12 text-center py-5">
          <div class="empty-cart">
            <img src="/Icons/Cart.png" alt="Empty Cart" class="empty-cart-icon mb-3" />
            <h2 class="mb-3">Your Cart is Empty</h2>
            <p class="mb-4">It looks like you haven't added any products to your cart yet.</p>
            <NuxtLink to="/" class="btn btn-dark btn-lg px-4 py-2">
              <i class="bi bi-arrow-left me-2"></i>Continue Shopping
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- محتوى السلة -->
      <div v-else class="row">
        <!-- قائمة المنتجات في السلة -->
        <div class="col-lg-8 mb-4 mb-lg-0">
          <div class="cart-items bg-white rounded p-0">
            <div class="cart-items-container">
              <CartItem 
                v-for="item in cartItems" 
                :key="item.id" 
                :item="item" 
              />
            </div>
          </div>
          
          <!-- أزرار إجراءات السلة -->
          <div class="cart-actions d-flex justify-content-between mt-4">
            <NuxtLink to="/" class="btn btn-outline-dark">
              <i class="bi bi-arrow-left me-2"></i>Continue Shopping
            </NuxtLink>
            <button 
              class="btn btn-outline-danger" 
              @click="clearCart"
              :disabled="cartItems.length === 0"
            >
              <i class="bi bi-trash me-2"></i>Clear Cart
            </button>
          </div>
        </div>
        
        <!-- ملخص السلة والدفع -->
        <div class="col-lg-4">
          <CartSummary />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';
import Breadcrumbs from '~/components/common/Breadcrumbs.vue';
import CartItem from '~/components/cart/CartItem.vue';
import CartSummary from '~/components/cart/CartSummary.vue';

// تعيين بيانات الصفحة
useHead({
  title: 'Shopping Cart',
  meta: [
    { name: 'description', content: 'View and manage your shopping cart items.' }
  ]
});

// متغيرات الحالة
const isLoading = ref(true);
const cartStore = useCartStore();
const { items: cartItems } = storeToRefs(cartStore);

// إفراغ السلة
const clearCart = () => {
  if (confirm('Are you sure you want to clear your shopping cart?')) {
    cartStore.clearCart();
  }
};

// تحميل السلة عند تحميل الصفحة
onMounted(() => {
  if (process.client) {
    // تحميل السلة من localStorage
    cartStore.loadCart();
    
    // إنهاء حالة التحميل بعد قليل
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
});
</script>
