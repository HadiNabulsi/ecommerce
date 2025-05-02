<template>
  <div class="checkout-page py-5">
    <div class="container">
      <!-- مسار التنقل -->
      <Breadcrumbs :breadcrumbs="[
        { name: 'Shopping Cart', path: '/cart' },
        { name: 'Checkout', path: '/checkout' }
      ]" />
      
      <!-- عنوان الصفحة -->
      <h1 class="checkout-title mb-4">Checkout</h1>
      
      <!-- محتوى صفحة الدفع -->
      <div class="row">
        <!-- نموذج الدفع والشحن -->
        <div class="col-lg-8 mb-4 mb-lg-0">
          <CheckoutForm />
        </div>
        
        <!-- ملخص الطلب -->
        <div class="col-lg-4">
          <CartSummary />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import Breadcrumbs from '~/components/common/Breadcrumbs.vue';
import CheckoutForm from '~/components/checkout/CheckoutForm.vue';
import CartSummary from '~/components/cart/CartSummary.vue';

const router = useRouter();
const cartStore = useCartStore();
const isRedirecting = ref(false);

// تعيين عنوان الصفحة
useHead({
  title: 'Checkout',
  meta: [
    { name: 'description', content: 'Complete your purchase and pay for your order' }
  ]
});

// التحقق من وجود منتجات في السلة
onMounted(() => {
  if (process.client) {
    // تأكد من تحميل السلة أولاً
    cartStore.loadCart();
    
    // إذا كانت السلة فارغة، قم بالتوجيه إلى صفحة السلة
    if (cartStore.items.length === 0 && !isRedirecting.value) {
      isRedirecting.value = true;
      router.push('/cart');
    }
  }
});
</script>

<style scoped>
.checkout-page {
  min-height: 70vh;
}

.checkout-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color-dark);
  margin-bottom: 1.5rem;
}
</style>
