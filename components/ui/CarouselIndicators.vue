<template>
  <div>
    <!-- Carousel Component -->
    <section class="carousel-section" v-if="showCarousel">
      <div :id="carouselId" class="carousel slide" data-bs-ride="carousel">
        <!-- Carousel Items -->
        <div class="carousel-inner">
          <slot></slot>
        </div>
        
        <!-- Carousel Controls -->
        <button v-if="showControls" class="carousel-control-prev" type="button" :data-bs-target="`#${carouselId}`" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button v-if="showControls" class="carousel-control-next" type="button" :data-bs-target="`#${carouselId}`" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </section>
    
    <!-- Carousel Indicators -->
    <section class="carousel-indicators-section" v-if="showIndicators">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-md-8 col-10">
            <div class="carousel-indicators-container d-flex justify-content-center align-items-center py-3">
              <div class="carousel-dots d-flex justify-content-center align-items-center">
                <button 
                  v-for="(_, index) in slidesCount" 
                  :key="index"
                  type="button" 
                  class="carousel-indicator" 
                  :class="{ active: activeSlide === index }" 
                  @click="goToSlide(index)" 
                  :aria-label="`Slide ${index + 1}`"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  // الخصائص الأساسية
  carouselId: {
    type: String,
    default: 'customCarousel'
  },
  activeSlide: {
    type: Number,
    default: 0
  },
  slidesCount: {
    type: Number,
    default: 5
  },
  
  // خيارات العرض
  showCarousel: {
    type: Boolean,
    default: true
  },
  showIndicators: {
    type: Boolean,
    default: true
  },
  showControls: {
    type: Boolean,
    default: true
  },
  
  // خيارات الـ Carousel
  interval: {
    type: Number,
    default: 5000
  },
  wrap: {
    type: Boolean,
    default: true
  },
  touch: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['slide-change']);
const carouselInstance = ref(null);

// الانتقال إلى شريحة محددة
const goToSlide = (slideIndex) => {
  emit('slide-change', slideIndex);
  
  // الانتقال إلى الشريحة المطلوبة باستخدام Bootstrap Carousel
  if (typeof window !== 'undefined' && carouselInstance.value) {
    carouselInstance.value.to(slideIndex);
  }
};

// مراقبة تغييرات الشريحة النشطة من الخارج
watch(() => props.activeSlide, (newValue) => {
  if (carouselInstance.value && typeof window !== 'undefined') {
    carouselInstance.value.to(newValue);
  }
});

// تهيئة الـ carousel عند تحميل المكون
onMounted(() => {
  if (typeof window !== 'undefined' && props.showCarousel) {
    const carouselElement = document.getElementById(props.carouselId);
    
    if (carouselElement) {
      // إنشاء مثيل من Bootstrap Carousel
      carouselInstance.value = new bootstrap.Carousel(carouselElement, {
        interval: props.interval,
        wrap: props.wrap,
        touch: props.touch
      });
      
      // الاستماع لأحداث تغيير الشريحة
      carouselElement.addEventListener('slide.bs.carousel', (event) => {
        emit('slide-change', event.to);
      });
      
      // الانتقال إلى الشريحة النشطة الأولية
      if (props.activeSlide > 0) {
        carouselInstance.value.to(props.activeSlide);
      }
    }
  }
});
</script>

<style scoped>
/* Carousel Styles */
.carousel-section {
  position: relative;
}

/* Carousel Indicators Styles */
.carousel-indicators-section {
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 0;
  margin-top: -5px;
}

.carousel-dots {
  position: relative;
}

.carousel-indicator {
  width: 15px;
  height: 2px;
  border-radius: 0;
  background-color: #d0d0d0;
  border: none;
  padding: 0;
  margin: 0 2px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.carousel-indicator.active {
  background-color: #000;
  width: 25px;
  height: 2px;
}

/* Custom Carousel Controls */
.carousel-control-prev,
.carousel-control-next {
  width: 5%;
  opacity: 0.8;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  padding: 10px;
}

@media (max-width: 768px) {
  .carousel-indicator {
    width: 8px;
    height: 2px;
  }
  
  .carousel-indicator.active {
    width: 15px;
    height: 2px;
  }
  
  .carousel-control-prev,
  .carousel-control-next {
    width: 10%;
  }
}
</style>
