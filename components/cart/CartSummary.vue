<template>
  <div class="cart-summary card">
    <div class="card-body">
      <!-- عنوان الملخص -->
      <h5 class="card-title mb-4">Order Summary</h5>
      
      <!-- عدد المنتجات -->
      <div class="summary-item d-flex justify-content-between mb-2">
        <span>Number of Products:</span>
        <span class="fw-medium">{{ totalItems }}</span>
      </div>
      
      <!-- المجموع الفرعي -->
      <div class="summary-item d-flex justify-content-between mb-2">
        <span>Subtotal:</span>
        <span class="fw-medium">{{ formatPrice(subtotal) }}</span>
      </div>
      
      <!-- تكلفة الشحن -->
      <div class="summary-item d-flex justify-content-between mb-2">
        <span>Shipping:</span>
        <span :class="{'text-success fw-medium': shipping === 0, 'fw-medium': shipping > 0}">
          {{ shipping > 0 ? formatPrice(shipping) : 'Free' }}
        </span>
      </div>
      
      <!-- الخصم -->
      <div class="summary-item d-flex justify-content-between mb-2" v-if="discount > 0">
        <span>Discount:</span>
        <span class="text-success fw-medium">-{{ formatPrice(discount) }}</span>
      </div>
      
      <hr class="my-3" />
      
      <!-- الإجمالي -->
      <div class="summary-total d-flex justify-content-between mb-3">
        <span class="fs-5">Total:</span>
        <span class="total-price fs-5">{{ formatPrice(total) }}</span>
      </div>
      
      <!-- قسم كوبون الخصم -->
      <div class="coupon-section mb-4">
        <label for="couponCode" class="form-label small mb-2">Do you have a discount code?</label>
        <div class="input-group">
          <input 
            type="text" 
            id="couponCode"
            class="form-control" 
            placeholder="Discount Code" 
            v-model="couponCode"
            aria-label="Discount Code"
          />
          <button 
            class="btn btn-outline-dark" 
            type="button" 
            @click="applyCoupon"
            :disabled="!couponCode.trim()"
          >
            Apply
          </button>
        </div>
        <small 
          v-if="couponMessage" 
          :class="['coupon-message d-block mt-2', couponSuccess ? 'text-success' : 'text-danger']"
        >
          {{ couponMessage }}
        </small>
      </div>
      
      <!-- أزرار المتابعة -->
      <div class="d-grid gap-2">
        <NuxtLink 
          to="/checkout" 
          class="btn btn-dark py-2"
          :class="{ 'disabled': !cartStore.items.length }"
        >
          Proceed to Checkout
        </NuxtLink>
        
        <NuxtLink to="/" class="btn btn-outline-dark py-2">
          Continue Shopping
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const router = useRouter();
const cartStore = useCartStore();

// متغيرات الكوبون
const couponCode = ref('');
const couponMessage = ref('');
const couponSuccess = ref(false);
const discount = ref(0);
const shipping = ref(0);

// حساب إجمالي العناصر
const totalItems = computed(() => {
  return cartStore.items.reduce((total, item) => total + item.quantity, 0);
});

// حساب المجموع الفرعي
const subtotal = computed(() => {
  return cartStore.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// حساب الإجمالي النهائي
const total = computed(() => {
  return subtotal.value + shipping.value - discount.value;
});

// تطبيق كوبون الخصم
const applyCoupon = () => {
  if (couponCode.value.trim() === '') {
    couponMessage.value = 'Please enter a discount code';
    couponSuccess.value = false;
    return;
  }
  
  // في البيئة الحقيقية، سيتم التحقق من الكوبون عبر طلب API
  if (couponCode.value.toUpperCase() === 'DISCOUNT20') {
    discount.value = subtotal.value * 0.2; // خصم 20%
    couponMessage.value = 'Discount applied successfully!';
    couponSuccess.value = true;
  } else {
    couponMessage.value = 'Invalid discount code';
    couponSuccess.value = false;
    discount.value = 0;
  }
};

// تنسيق السعر
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

// تحديث الشحن بناءً على المجموع الفرعي
watch(subtotal, (newValue) => {
  shipping.value = newValue > 100 ? 0 : 10; // شحن مجاني للطلبات أكثر من $100
});

// حفظ السلة قبل الانتقال إلى صفحة الدفع
onMounted(() => {
  const checkoutLink = document.querySelector('a[href="/checkout"]');
  if (checkoutLink) {
    checkoutLink.addEventListener('click', () => {
      cartStore.saveCart();
    });
  }
});
</script>
