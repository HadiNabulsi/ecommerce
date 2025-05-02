<template>
  <div class="cart-item card mb-3 slide-up">
    <div class="row g-0">
      <!-- صورة المنتج -->
      <div class="col-md-3 d-flex align-items-center justify-content-center">
        <NuxtLink :to="`/product/${item.id}`" class="d-flex align-items-center justify-content-center p-2">
          <img :src="item.image" :alt="item.title" class="img-fluid cart-item-image" />
        </NuxtLink>
      </div>
      
      <!-- تفاصيل المنتج -->
      <div class="col-md-9">
        <div class="card-body position-relative">
          <!-- زر إزالة المنتج -->
          <button 
            class="btn-close position-absolute top-0 end-0" 
            @click="removeFromCart"
            aria-label="Remove item"
          ></button>
          
          <!-- عنوان المنتج -->
          <h5 class="card-title text-truncate">{{ item.title }}</h5>
          
          <!-- السعر والكمية -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="price-container">
              <span class="current-price">{{ formatPrice(item.price) }}</span>
            </div>
            
            <!-- أزرار التحكم بالكمية -->
            <div class="quantity-controls">
              <button 
                class="btn btn-sm btn-outline-secondary" 
                @click="decreaseQuantity" 
                :disabled="item.quantity <= 1"
                aria-label="Decrease quantity"
              >
                <span aria-hidden="true">-</span>
              </button>
              <span class="quantity-display">{{ item.quantity }}</span>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                @click="increaseQuantity"
                aria-label="Increase quantity"
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>
          </div>
          
          <!-- المجموع وزر الإزالة -->
          <div class="d-flex justify-content-between align-items-center">
            <p class="card-text mb-0">
              <small class="text-muted">Total: {{ formatPrice(item.price * item.quantity) }}</small>
            </p>
            <button class="btn btn-sm btn-link text-danger p-0" @click="removeFromCart">Remove</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

// زيادة الكمية
const increaseQuantity = () => {
  cartStore.updateQuantity(props.item.id, props.item.quantity + 1);
};

// تقليل الكمية
const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    cartStore.updateQuantity(props.item.id, props.item.quantity - 1);
  }
};

// إزالة المنتج من السلة
const removeFromCart = () => {
  cartStore.removeFromCart(props.item.id);
};

// تنسيق السعر
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};
</script>
