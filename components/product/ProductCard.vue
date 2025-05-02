<template>
  <div class="product-card">
    <!-- صورة المنتج مع الإجراءات -->
    <div class="product-image-container">
      <NuxtLink :to="`/product/${product.id}`" class="product-image-link" :title="product.title">
        <img 
          :src="product.image" 
          :alt="product.title" 
          class="img-fluid product-image" 
          loading="lazy"
        />
      </NuxtLink>
      <div class="product-badge" v-if="product.originalPrice">
        -{{ calculateDiscount(product.price, product.originalPrice) }}%
      </div>
      <div class="product-actions">
        <button 
          class="btn action-btn wishlist-btn" 
          :class="{ 'active': isInWishlist }" 
          @click="toggleWishlist" 
          :title="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'" 
          :aria-label="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
        >
          <span class="heart-icon">
            <span v-if="isInWishlist" class="filled">♥</span>
            <span v-else>♡</span>
          </span>
        </button>
        <button 
          class="btn action-btn cart-btn" 
          @click="addToCart" 
          title="Add to cart" 
          aria-label="Add to cart"
        >
          <img 
            src="/Icons/Cart.png" 
            alt="Cart" 
            width="16" 
            height="16" 
            class="cart-icon"
          />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
    
    <!-- معلومات المنتج -->
    <div class="product-info">
      <div class="product-category" v-if="product.category">{{ product.category }}</div>
      <NuxtLink :to="`/product/${product.id}`" class="product-title-link">
        <h3 class="product-title">{{ truncateTitle(product.title) }}</h3>
      </NuxtLink>
      
      <!-- السعر والتقييم -->
      <div class="product-meta">
        <div class="product-price">
          <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice.toFixed(2) }}</span>
          <span class="current-price">${{ product.price.toFixed(2) }}</span>
        </div>
        <div class="product-rating" v-if="product.rating">
          <div class="stars">
            <span 
              v-for="star in 5" 
              :key="star" 
              class="star"
            >
              <span v-if="star <= Math.round(product.rating.rate)" class="filled">★</span>
              <span v-else>☆</span>
            </span>
          </div>
          <span class="rating-count">({{ product.rating.count }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// استيراد المكتبات اللازمة
import { computed } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useWishlistStore } from '~/stores/wishlist';

// تعريف الـ props
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// استخدام متجر السلة والمفضلة
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

// التحقق مما إذا كان المنتج في المفضلة
const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id));

// دالة إضافة المنتج إلى السلة
const addToCart = () => {
  cartStore.addToCart({
    id: props.product.id,
    title: props.product.title,
    price: props.product.price,
    image: props.product.image,
    quantity: 1
  });
};

// دالة تبديل حالة المنتج في المفضلة
const toggleWishlist = () => {
  wishlistStore.toggleWishlist({
    id: props.product.id,
    title: props.product.title,
    price: props.product.price,
    image: props.product.image
  });
};

// دالة لحساب نسبة الخصم
const calculateDiscount = (currentPrice, originalPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// دالة لتقصير عنوان المنتج إذا كان طويلاً
const truncateTitle = (title) => {
  return title.length > 60 ? `${title.substring(0, 60)}...` : title;
};
</script>

<style scoped>
/* المكون الرئيسي */
.product-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

/* حاوية صورة المنتج */
.product-image-container {
  position: relative;
  overflow: hidden;
  padding-top: 100%; /* نسبة 1:1 للصورة */
  background-color: #f8f9fa;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-image-link {
  display: block;
  overflow: hidden;
  cursor: pointer;
}

.product-image-link:hover .product-image {
  transform: scale(1.05);
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

/* شارة الخصم */
.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff5252;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* إجراءات المنتج */
.product-actions {
  position: absolute;
  bottom: -60px;
  left: 0;
  width: 100%;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  gap: 10px;
  transition: bottom 0.3s ease;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
  z-index: 3;
}

.product-card:hover .product-actions {
  bottom: 0;
}

.action-btn {
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wishlist-btn {
  background-color: #f1f1f1;
  color: #666;
  transition: all 0.2s ease;
}

.wishlist-btn:hover {
  background-color: #ffebee;
  color: #e91e63;
}

.wishlist-btn.active {
  background-color: #ffebee;
  color: #e91e63;
}

.heart-icon {
  font-size: 20px;
  line-height: 1;
}

.heart-icon .filled {
  color: #e91e63;
}

.wishlist-btn.active .heart-icon {
  animation: heartBeat 0.5s ease-in-out;
}

.cart-btn {
  background-color: #212529;
  color: white;
  flex-grow: 1;
}

.cart-btn:hover {
  background-color: #000;
}

.cart-btn .cart-icon {
  margin-right: 6px;
}

/* معلومات المنتج */
.product-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-category {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #212529;
}

.product-title-link {
  color: inherit;
  text-decoration: none;
}

.product-title-link:hover .product-title {
  color: #007bff;
}

/* السعر والتقييم */
.product-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.product-price {
  display: flex;
  flex-direction: column;
}

.current-price {
  font-weight: 700;
  color: #212529;
  font-size: 1.1rem;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.85rem;
}

.product-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  display: inline-block;
  font-size: 14px;
  line-height: 1;
  color: #ccc;
}

.star .filled {
  color: #ffc107;
}

.rating-count {
  font-size: 0.75rem;
  color: #666;
  margin-top: 2px;
}
/* تأثير نبض القلب للمفضلة */
@keyframes heartBeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1); }
  75% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>
