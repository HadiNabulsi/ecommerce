<template>
  <!-- حاوية البانر الرئيسية -->
  <div class="hero-banner-container">
    <!-- مكون مؤشرات السلايدر -->
    <CarouselIndicators 
      carouselId="heroBannerCarousel" 
      :active-slide="activeSlide" 
      :slides-count="bannerSlides.length"
      @slide-change="handleSlideChange" 
      :interval="5000" 
      :wrap="true" 
      :touch="true"
    >
      <!-- تكرار الشرائح بناءً على مصفوفة البيانات -->
      <div 
        v-for="(slide, index) in bannerSlides" 
        :key="index" 
        :class="['carousel-item', index === 0 ? 'active' : '']"
      >
        <!-- خلفية البانر -->
        <div :class="['banner-bg', `banner-bg-${index + 1}`, 'w-100', 'd-flex', 'align-items-center']">
          <div class="container-fluid">
            <div class="row">
              <!-- محتوى البانر -->
              <div class="col-lg-5 col-md-6 col-sm-8 col-10 ps-lg-5 ps-md-4 ps-3">
                <div class="banner-content">
                  <h1 class="fw-bold mb-2">{{ slide.title }}</h1>
                  <p class="text-uppercase mb-4" v-html="slide.description"></p>
                  <!-- زر التسوق -->
                  <div class="shop-btn-container position-relative d-inline-block">
                    <NuxtLink :to="slide.link" class="btn-link position-relative d-inline-block">
                      <img src="/public/Icons/Bottun.png" alt="Shop Now" class="shop-now-btn img-fluid" />
                      <span class="btn-overlay-text position-absolute">SHOP NOW</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CarouselIndicators>
  </div>
</template>

<script setup>
// ===== استيراد المكتبات اللازمة =====
import { ref } from 'vue';
import CarouselIndicators from './CarouselIndicators.vue';

// ===== متغيرات الحالة =====
const activeSlide = ref(0); // تتبع الشريحة النشطة

// ===== بيانات الشرائح =====
const bannerSlides = [
  {
    title: 'SALE',
    description: '&nbsp;ACCESS A LIMITED SELECTION<br>WITH UP TO 70% OFF',
    link: '/category/electronics',
    image: '/Images/Header.jpg'
  },
  {
    title: 'NEW ARRIVALS',
    description: '&nbsp;DISCOVER THE LATEST<br>ELECTRONICS COLLECTION',
    link: '/category/electronics',
    image: '/Images/Header.jpg'
  },
  {
    title: 'JEWELRY',
    description: '&nbsp;EXCLUSIVE COLLECTION<br>FOR SPECIAL OCCASIONS',
    link: '/category/jewelery',
    image: '/Images/Header.jpg'
  },
  {
    title: 'FASHION',
    description: '&nbsp;TRENDY STYLES<br>FOR MEN & WOMEN',
    link: '/category/men\'s clothing',
    image: '/Images/Header.jpg'
  },
  {
    title: 'SPECIAL OFFERS',
    description: '&nbsp;&nbsp;LIMITED TIME DEALS<br>&nbsp;&nbsp;ON POPULAR ITEMS',
    link: '/category/electronics',
    image: '/Images/Header.jpg'
  }
];

// ===== الدوال =====
const handleSlideChange = (slideIndex) => {
  activeSlide.value = slideIndex; // تحديث الشريحة النشطة
};
</script>

<style scoped>
/* ===== أنماط الحاوية الرئيسية ===== */
.hero-banner-container {
  width: 100%;
  overflow: hidden;
}

/* ===== أنماط خلفية البانر ===== */
.banner-bg {
  background-size: contain;
  background-position: center;
  height: 650px;
  width: 100%;
  background-repeat: no-repeat;
  background-color: #EEEEE4;
}

/* تعريف خلفيات الشرائح المختلفة */
.banner-bg-1, .banner-bg-2, .banner-bg-3, .banner-bg-4, .banner-bg-5 {
  background-image: url('/Images/Header.jpg');
  background-size: 100% auto;
}

/* ===== أنماط محتوى البانر ===== */
.banner-content {
  padding: 2rem 0;
}

.banner-content h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  letter-spacing: 2px;
  margin-bottom: 1rem;
  margin-top: -10px;
}

.banner-content p {
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 2px;
  margin-top: clamp(20px, 4vh, 40px);
}

/* ===== أنماط زر التسوق ===== */
.shop-btn-container {
  margin-top: clamp(15px, 3vh, 30px);
}

.shop-now-btn {
  width: 100%;
  max-width: 300px;
  height: auto;
  transition: opacity 0.3s ease;
}

.shop-now-btn:hover {
  opacity: 0.9;
}

.btn-overlay-text {
  left: 12%;
  top: 48%;
  transform: translateY(-50%);
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 500;
  letter-spacing: 1px;
  pointer-events: none;
  white-space: nowrap;
  color: #EEEEE4;
}

/* ===== استعلامات الوسائط ===== */
/* الشاشات الكبيرة (أقل من 1200px) */
@media (max-width: 1199.98px) {
  .banner-bg {
    height: 600px;
  }
  
  .banner-bg-1, .banner-bg-2, .banner-bg-3, .banner-bg-4, .banner-bg-5 {
    background-size: 70% auto;
  }
}

/* الشاشات المتوسطة (أقل من 992px) */
@media (max-width: 991.98px) {
  .banner-bg {
    height: 550px;
  }
  
  .banner-content {
    padding: 1.5rem 0;
  }
  
  .banner-bg-1, .banner-bg-2, .banner-bg-3, .banner-bg-4, .banner-bg-5 {
    background-size: 65% auto;
  }
}

/* الأجهزة اللوحية (أقل من 768px) */
@media (max-width: 767.98px) {
  .banner-bg {
    height: 450px;
  }
  
  .banner-content {
    padding: 1rem 0;
  }
  
  .shop-now-btn {
    max-width: 250px;
  }
  
  .btn-overlay-text {
    left: 10%;
  }
  
  .banner-bg-1, .banner-bg-2, .banner-bg-3, .banner-bg-4, .banner-bg-5 {
    background-size: 60% auto;
  }
}

/* الهواتف الذكية (أقل من 576px) */
@media (max-width: 575.98px) {
  .banner-bg {
    height: 350px;
    background-position: 30px;
  }

  .banner-bg-1, .banner-bg-2, .banner-bg-3, .banner-bg-4, .banner-bg-5 {
    background-size: 100% auto;
  }
  
  .banner-content h1 {
    margin-top: 40px;
    margin-left: -10px;
    font-size: clamp(1.66rem, 3.33vw, 2.33rem);
  }
  
  .banner-content p {
    margin-top: 10px;
    margin-left: -10px;
    font-size: clamp(0.66rem, 1.33vw, 0.933rem);
  }
  
  .shop-now-btn {
    max-width: 120px;
    width: 100%;
    margin-top: -50px;
    margin-left: -10px;
  }
  
  .btn-overlay-text {
    left: 8%;
    margin-left: -10px;
    top: -50%;
    font-size: 12px;
  }
}

/* الهواتف الصغيرة (أقل من 375px) */
@media (max-width: 375px) {
  .banner-bg {
    height: 300px;
  }
  
  .shop-now-btn {
    max-width: 180px;
  }
  
  .banner-bg-1, .banner-bg-2, .banner-bg-3, .banner-bg-4, .banner-bg-5 {
    background-size: 45% auto;
  }
}
</style>