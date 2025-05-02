<template>
  <div class="checkout-form">
    <h4 class="checkout-title mb-4">Shipping & Payment Information</h4>
    
    <form @submit.prevent="submitOrder">
      <!-- بيانات الشحن -->
      <div class="shipping-info mb-4">
        <h5 class="section-title">Shipping Information</h5>
        
        <div class="row g-3">
          <!-- الاسم الأول -->
          <div class="col-md-6">
            <label for="firstName" class="form-label">First Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="firstName" 
              v-model="shippingInfo.firstName"
              required
              autocomplete="given-name"
            />
          </div>
          
          <!-- الاسم الأخير -->
          <div class="col-md-6">
            <label for="lastName" class="form-label">Last Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="lastName" 
              v-model="shippingInfo.lastName"
              required
              autocomplete="family-name"
            />
          </div>
          
          <!-- البريد الإلكتروني -->
          <div class="col-12">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              v-model="shippingInfo.email"
              required
              autocomplete="email"
            />
          </div>
          
          <!-- رقم الهاتف -->
          <div class="col-12">
            <label for="phone" class="form-label">Phone Number</label>
            <input 
              type="tel" 
              class="form-control" 
              id="phone" 
              v-model="shippingInfo.phone"
              required
              autocomplete="tel"
            />
          </div>
          
          <!-- العنوان -->
          <div class="col-12">
            <label for="address" class="form-label">Address</label>
            <input 
              type="text" 
              class="form-control" 
              id="address" 
              v-model="shippingInfo.address"
              required
              autocomplete="street-address"
            />
          </div>
          
          <!-- المدينة -->
          <div class="col-md-6">
            <label for="city" class="form-label">City</label>
            <input 
              type="text" 
              class="form-control" 
              id="city" 
              v-model="shippingInfo.city"
              required
              autocomplete="address-level2"
            />
          </div>
          
          <!-- الدولة -->
          <div class="col-md-4">
            <label for="country" class="form-label">Country</label>
            <select 
              class="form-select" 
              id="country" 
              v-model="shippingInfo.country" 
              required
              autocomplete="country"
            >
              <option value="">Choose...</option>
              <option value="SY">Syria</option>
              <option value="AE">United Arab Emirates</option>
              <option value="SA">Saudi Arabia</option>
              <option value="KW">Kuwait</option>
              <option value="QA">Qatar</option>
              <option value="BH">Bahrain</option>
              <option value="OM">Oman</option>
            </select>
          </div>
          
          <!-- الرمز البريدي -->
          <div class="col-md-2">
            <label for="zip" class="form-label">Zip Code</label>
            <input 
              type="text" 
              class="form-control" 
              id="zip" 
              v-model="shippingInfo.zip"
              required
              autocomplete="postal-code"
            />
          </div>
        </div>
      </div>
      
      <!-- طريقة الدفع -->
      <div class="payment-info mb-4">
        <h5 class="section-title">Payment Method</h5>
        
        <div class="payment-methods">
          <!-- بطاقة الائتمان -->
          <div class="form-check mb-3">
            <input 
              class="form-check-input" 
              type="radio" 
              name="paymentMethod" 
              id="creditCard" 
              value="creditCard" 
              v-model="paymentMethod"
              checked
            />
            <label class="form-check-label" for="creditCard">
              Credit Card
            </label>
          </div>
          
          <!-- نموذج بطاقة الائتمان -->
          <div v-if="paymentMethod === 'creditCard'" class="credit-card-form mb-3 p-3 border rounded">
            <div class="row g-3">
              <div class="col-12">
                <label for="cardName" class="form-label">Name on Card</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="cardName" 
                  v-model="paymentInfo.cardName"
                  required
                  autocomplete="cc-name"
                />
              </div>
              
              <div class="col-12">
                <label for="cardNumber" class="form-label">Card Number</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="cardNumber" 
                  v-model="paymentInfo.cardNumber"
                  required
                  autocomplete="cc-number"
                  maxlength="19"
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </div>
              
              <div class="col-md-6">
                <label for="expiration" class="form-label">Expiration Date</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="expiration" 
                  v-model="paymentInfo.expiration"
                  placeholder="MM/YY"
                  required
                  autocomplete="cc-exp"
                  maxlength="5"
                />
              </div>
              
              <div class="col-md-6">
                <label for="cvv" class="form-label">CVV</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="cvv" 
                  v-model="paymentInfo.cvv"
                  required
                  autocomplete="cc-csc"
                  maxlength="4"
                  placeholder="XXX"
                />
              </div>
            </div>
          </div>
          
          <!-- باي بال -->
          <div class="form-check mb-3">
            <input 
              class="form-check-input" 
              type="radio" 
              name="paymentMethod" 
              id="paypal" 
              value="paypal" 
              v-model="paymentMethod"
            />
            <label class="form-check-label" for="paypal">
              PayPal
            </label>
          </div>
          
          <!-- الدفع عند الاستلام -->
          <div class="form-check mb-3">
            <input 
              class="form-check-input" 
              type="radio" 
              name="paymentMethod" 
              id="cashOnDelivery" 
              value="cashOnDelivery" 
              v-model="paymentMethod"
            />
            <label class="form-check-label" for="cashOnDelivery">
              Cash on Delivery
            </label>
          </div>
        </div>
      </div>
      
      <!-- ملخص الطلب -->
      <div class="order-summary mb-4">
        <h5 class="section-title">Order Summary</h5>
        
        <div class="card">
          <div class="card-body">
            <!-- قائمة المنتجات -->
            <div v-if="cartItems.length > 0">
              <div v-for="item in cartItems" :key="item.id" class="order-item d-flex justify-content-between mb-2">
                <span class="text-truncate me-3" v-text="`${item.title} × ${item.quantity}`"></span>
                <span class="flex-shrink-0" v-text="formatPrice(item.price * item.quantity)"></span>
              </div>
            </div>
            <div v-else class="text-center py-3 text-muted">
              <p>Your cart is empty</p>
            </div>
            
            <hr class="my-3" />
            
            <!-- تفاصيل المجموع -->
            <div class="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span class="fw-medium" v-text="formatPrice(subtotal)"></span>
            </div>
            
            <div class="d-flex justify-content-between mb-2">
              <span>Shipping:</span>
              <span :class="{'text-success fw-medium': shipping === 0, 'fw-medium': shipping > 0}"
                v-text="shipping > 0 ? formatPrice(shipping) : 'Free'"
              ></span>
            </div>
            
            <div class="d-flex justify-content-between mb-2" v-if="discount > 0">
              <span>Discount:</span>
              <span class="text-success fw-medium" v-text="'-' + formatPrice(discount)"></span>
            </div>
            
            <!-- المجموع النهائي -->
            <div class="d-flex justify-content-between total-row">
              <span class="fw-bold">Total:</span>
              <span class="fw-bold fs-5" v-text="formatPrice(total)"></span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- الشروط والأحكام -->
      <div class="terms mb-4">
        <div class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="terms" 
            v-model="termsAccepted"
            required
          />
          <label class="form-check-label" for="terms">
            I agree to <a href="#" target="_blank">Terms and Conditions</a> and <a href="#" target="_blank">Privacy Policy</a>
          </label>
        </div>
      </div>
      
      <!-- زر إرسال الطلب -->
      <div class="d-grid">
        <button 
          type="submit" 
          class="btn btn-dark btn-lg py-3"
          :disabled="!termsAccepted || isSubmitting || cartItems.length === 0"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <span v-text="isSubmitting ? 'Submitting...' : 'Complete Order'"></span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const router = useRouter();
const cartStore = useCartStore();

// معلومات الشحن
const shippingInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  zip: ''
});

// معلومات الدفع
const paymentMethod = ref('creditCard');
const paymentInfo = ref({
  cardName: '',
  cardNumber: '',
  expiration: '',
  cvv: ''
});

// متغيرات أخرى
const termsAccepted = ref(false);
const isSubmitting = ref(false);
const discount = ref(0);
const shipping = ref(0);

// الحصول على عناصر السلة
const cartItems = computed(() => cartStore.items);

// حساب المجموع الفرعي
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// حساب الإجمالي النهائي
const total = computed(() => {
  return subtotal.value + shipping.value - discount.value;
});

// تنسيق السعر
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

// تحديث الشحن بناءً على المجموع الفرعي
watch(subtotal, (newValue) => {
  shipping.value = newValue > 100 ? 0 : 10; // شحن مجاني للطلبات أكثر من 100$
});

// إرسال الطلب
const submitOrder = async () => {
  if (!termsAccepted.value || cartItems.value.length === 0) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // في البيئة الحقيقية، سيتم إرسال الطلب عبر طلب API
    await new Promise(resolve => setTimeout(resolve, 2000)); // محاكاة طلب API
    
    // إفراغ السلة
    cartStore.clearCart();
    
    // الانتقال إلى صفحة تأكيد الطلب
    router.push('/order-confirmation');
  } catch (error) {
    console.error('Error submitting order:', error);
    // يمكن إضافة معالجة الأخطاء هنا
  } finally {
    isSubmitting.value = false;
  }
};
</script>
