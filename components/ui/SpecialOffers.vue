<template>
  <section class="special-offers py-6 pb-0">
    <div class="container">
      <!-- عنوان القسم -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="special-title">SPECIAL OFFERS</h2>
        </div>
      </div>
      
      <!-- شريط المنتجات مع أزرار التنقل -->
      <div class="position-relative special-products-slider mb-4">
        <!-- أزرار التنقل -->
        <button class="nav-arrow prev-arrow" @click="prevSlide" aria-label="Previous slide">
          <span class="arrow-content">←</span>
        </button>
        
        <button class="nav-arrow next-arrow" @click="nextSlide" aria-label="Next slide">
          <span class="arrow-content">→</span>
        </button>
        
        <!-- شريط المنتجات -->
        <div class="special-products-wrapper">
          <div class="special-products">
            <div class="products-slide" ref="productsContainer">
              <!-- المنتجات العادية -->
              <div 
                v-for="(product, index) in specialOffers" 
                :key="product.id" 
                class="product-card"
                :class="{'active': Math.floor(index / itemsPerView) === activeSlide}"
                :style="{ transform: `translateX(${-activeSlide * 100}%)` }"
              >
                <NuxtLink :to="`/product/${product.id}`" class="product-link">
                  <div class="product-item">
                    <!-- صورة المنتج -->
                    <div class="product-image">
                      <img :src="product.image" :alt="product.title" class="img-fluid" loading="lazy" />
                      <div class="discount-badge" v-if="product.discount">
                        -{{ product.discount }}%
                      </div>
                    </div>
                    
                    <!-- معلومات المنتج -->
                    <div class="product-info text-center">
                      <p class="product-desc">{{ product.title }}</p>
                      <div class="product-price">
                        <span class="original-price">AED {{ product.formattedOriginalPrice }}</span>
                        <span class="current-price">{{ product.formattedPrice }}</span>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- مؤشرات الشرائح -->
      <div class="row">
        <div class="col-12">
          <CarouselIndicators
            carouselId="specialOffersCarousel"
            :active-slide="activeSlide"
            :slides-count="totalSlides"
            @slide-change="handleSlideChange"
            :interval="5000"
            :wrap="true"
            :touch="true"
            :showCarousel="false"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
import CarouselIndicators from './CarouselIndicators.vue';

// متغيرات الحالة
const config = useRuntimeConfig();
const specialOffers = ref([]);
const activeSlide = ref(0);
const productsContainer = ref(null);
const itemsPerView = ref(4); // عدد المنتجات المعروضة في كل مرة

// حساب عدد الشرائح المتاحة
const totalSlides = computed(() => {
  return Math.ceil(specialOffers.value.length / itemsPerView.value);
});

// التنقل بين الشرائح
const handleSlideChange = (slideIndex) => {
  activeSlide.value = slideIndex;
};

const nextSlide = () => {
  if (activeSlide.value < totalSlides.value - 1) {
    activeSlide.value++;
  } else {
    activeSlide.value = 0; // العودة إلى البداية
  }
};

const prevSlide = () => {
  if (activeSlide.value > 0) {
    activeSlide.value--;
  } else {
    activeSlide.value = totalSlides.value - 1; // الانتقال إلى النهاية
  }
};

// تحديث عرض الشريحة عند تغيير حجم النافذة
const updateSlideWidth = () => {
  if (window.innerWidth >= 1400) {
    itemsPerView.value = 4; // شاشات كبيرة جداً
  } else if (window.innerWidth >= 1200) {
    itemsPerView.value = 4; // شاشات كبيرة
  } else if (window.innerWidth >= 992) {
    itemsPerView.value = 3; // شاشات متوسطة
  } else if (window.innerWidth >= 768) {
    itemsPerView.value = 2; // شاشات صغيرة
  } else if (window.innerWidth >= 576) {
    itemsPerView.value = 1; // هواتف أفقية
  } else {
    itemsPerView.value = 1; // هواتف عمودية
  }
  
  // التأكد من أن الشريحة الحالية ما زالت صالحة
  if (activeSlide.value >= totalSlides.value) {
    activeSlide.value = Math.max(0, totalSlides.value - 1);
  }
};

// إضافة تأثير انتقالي عند تغيير الشريحة
watch(() => activeSlide.value, () => {
  if (productsContainer.value) {
    productsContainer.value.classList.add('sliding');
    
    setTimeout(() => {
      if (productsContainer.value) {
        productsContainer.value.classList.remove('sliding');
      }
    }, 1000);
  }
});

// تهيئة المكون
onMounted(async () => {
  try {
    // جلب المنتجات من API
    const response = await fetch(`${config.public.apiBase}/products?limit=20`);
    const products = await response.json();
    
    // إضافة سعر الخصم والسعر الأصلي لكل منتج
    specialOffers.value = products.map(product => {
      const discount = Math.floor(Math.random() * 30) + 10; // خصم عشوائي بين 10% و 40%
      const originalPrice = parseFloat((product.price / (1 - discount / 100)).toFixed(2));
      
      return {
        ...product,
        discount,
        originalPrice,
        formattedOriginalPrice: `${originalPrice.toFixed(2)}`,
        formattedPrice: `${product.price.toFixed(2)}`
      };
    });
    
    // حساب عرض الشريحة وإضافة مستمع لتغيير حجم النافذة
    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    
    // تنظيف المستمعين عند إزالة المكون
    return () => {
      window.removeEventListener('resize', updateSlideWidth);
    };
  } catch (error) {
    console.error('Error fetching special offers:', error);
  }
});
</script>

<style scoped>
/* القسم الرئيسي */
.special-offers {
  background-color: #fff;
  padding: clamp(30px, 5vw, 50px) 0;
}

.special-title {
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 600;
  text-align: left;
  margin-top: 3rem;
  margin-bottom: 0.2rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: -50px; 
}

/* حاوية المنتجات */
.special-products-slider {
  margin-bottom: clamp(20px, 5vw, 40px);
  overflow: hidden;
  position: relative;
}

.special-products-wrapper {
  overflow: hidden;
  width: 100%;
  position: relative;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
}

.special-products {
  width: 100%;
  overflow: hidden;
}

.products-slide {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  will-change: transform;
  transform-style: preserve-3d;
  position: relative;
}

.sliding {
  animation-timing-function: cubic-bezier(0.1, 0.7, 1.0, 0.1);
  transform: translateZ(0);
}

/* بطاقات المنتجات */
.product-card {
  flex: 0 0 auto;
  width: calc(25% - 20px);
  margin: 0 10px;
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  border-right: 1px solid #eee;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  height: clamp(280px, 40vw, 350px);
  display: flex;
  flex-direction: column;
  padding: clamp(5px, 2vw, 15px) clamp(5px, 1vw, 10px);
}

.product-card.active {
  z-index: 1;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  transition: transform 0.3s ease;
}

.product-item {
  padding: clamp(5px, 1vw, 10px);
  border-radius: 5px;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* صورة المنتج */
.product-image {
  margin-bottom: clamp(5px, 1vw, 10px);
  padding: clamp(5px, 1vw, 10px);
  display: flex;
  justify-content: center;
  align-items: center;
  height: clamp(120px, 25vw, 200px);
  overflow: hidden;
  background-color: #fff;
  position: relative;
  flex: 0 0 auto;
}

.product-image img {
  max-height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
  z-index: 1;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: clamp(0.7rem, 1vw, 0.8rem);
  font-weight: bold;
  z-index: 3;
}

/* معلومات المنتج */
.product-info {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-desc {
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  color: #333;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: clamp(5px, 1vw, 10px);
  font-size: clamp(0.8rem, 1vw, 0.9rem);
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: clamp(0.75rem, 0.9vw, 0.85rem);
}

.current-price {
  font-weight: bold;
  color: #000;
}

/* أزرار التنقل */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  font-size: 0;
}

.arrow-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 24px;
  color: #000;
  font-weight: normal;
}

.nav-arrow:hover {
  border-color: #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.prev-arrow {
  left: 0;
}

.next-arrow {
  right: 0;
}

/* استعلامات الوسائط */
@media (max-width: 1399.98px) {
  .product-card {
    width: calc(25% - 20px);
  }
}

@media (max-width: 1199.98px) {
  .product-card {
    width: calc(33.33% - 20px);
  }
}

@media (max-width: 991.98px) {
  .product-card {
    width: calc(50% - 20px);
  }
  
  .product-image {
    height: clamp(140px, 20vw, 180px);
  }
}

@media (max-width: 767.98px) {
  .product-card {
    height: clamp(250px, 35vw, 320px);
  }
  
  .product-image {
    height: clamp(120px, 18vw, 180px);
  }
  
  .nav-arrow {
    width: 35px;
    height: 35px;
  }
  
  .arrow-content {
    font-size: 20px;
  }
}

@media (max-width: 575.98px) {
  .product-card {
    width: calc(100% - 20px);
    height: clamp(220px, 30vw, 300px);
  }
  
  .product-image {
    height: clamp(100px, 15vw, 160px);
  }
  
  .nav-arrow {
    width: 30px;
    height: 30px;
  }
  
  .arrow-content {
    font-size: 18px;
  }
}

@media (max-width: 375.98px) {
  .special-title {
    font-size: 1.5rem;
    margin-left: -10px;
  }
  
  .product-card {
    height: 220px;
  }
  
  .product-image {
    height: 100px;
  }
  
  .product-desc {
    font-size: 0.75rem;
  }
  
  .product-price {
    font-size: 0.75rem;
  }
  
  .original-price {
    font-size: 0.7rem;
  }
}
</style>