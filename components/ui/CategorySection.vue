<template>
  <section class="category-section py-5">
    <div class="container">
      <div class="section-header d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title">{{ categoryTitle }}</h2>
        <NuxtLink :to="`/category/${categorySlug}`" class="btn btn-link view-all-link">
          عرض الكل
          <i class="fas fa-arrow-right ms-2"></i>
        </NuxtLink>
      </div>
      
      <div class="row">
        <!-- صورة الفئة الرئيسية (على الجانب) -->
        <div class="col-lg-3 mb-4 mb-lg-0">
          <div class="category-banner">
            <NuxtLink :to="`/category/${categorySlug}`" class="category-banner-link">
              <img :src="categoryImage" :alt="categoryTitle" class="img-fluid category-image" />
              <div class="category-overlay">
                <div class="category-content">
                  <h3 class="category-banner-title">{{ categoryTitle }}</h3>
                  <span class="category-banner-subtitle">{{ categorySubtitle }}</span>
                  <span class="shop-now-btn">تسوق الآن</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <!-- منتجات الفئة -->
        <div class="col-lg-9">
          <div class="row">
            <div 
              v-for="product in displayedProducts" 
              :key="product.id" 
              class="col-6 col-md-4 mb-4"
            >
              <ProductCard :product="product" />
            </div>
          </div>
          
          <!-- أزرار التنقل بين المنتجات -->
          <div v-if="products.length > itemsPerView" class="navigation-buttons d-flex justify-content-center mt-3">
            <button 
              class="btn btn-outline-dark navigation-btn me-2" 
              @click="prevPage" 
              :disabled="currentPage === 1"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
            <button 
              class="btn btn-outline-dark navigation-btn" 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ProductCard from '~/components/product/ProductCard.vue';

const props = defineProps({
  categorySlug: {
    type: String,
    required: true
  },
  categoryTitle: {
    type: String,
    required: true
  },
  categorySubtitle: {
    type: String,
    default: 'تشكيلة جديدة'
  },
  categoryImage: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    default: () => []
  },
  itemsPerView: {
    type: Number,
    default: 6
  }
});

// متغيرات الحالة
const currentPage = ref(1);
const loading = ref(true);

// إجمالي الصفحات
const totalPages = computed(() => {
  return Math.ceil(props.products.length / props.itemsPerView);
});

// المنتجات المعروضة في الصفحة الحالية
const displayedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * props.itemsPerView;
  const endIndex = startIndex + props.itemsPerView;
  return props.products.slice(startIndex, endIndex);
});

// الانتقال إلى الصفحة السابقة
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// الانتقال إلى الصفحة التالية
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// إعادة تعيين الصفحة عند تغيير الفئة
watch(() => props.categorySlug, () => {
  currentPage.value = 1;
});

// تهيئة المكون
onMounted(() => {
  loading.value = false;
});
</script>

<style scoped>
.category-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  position: relative;
  margin-bottom: 0;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: #000;
}

.view-all-link {
  color: #000;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-all-link:hover {
  color: #666;
}

.category-banner {
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-banner-link {
  display: block;
  height: 100%;
  position: relative;
  text-decoration: none;
}

.category-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.category-banner:hover .category-image {
  transform: scale(1.05);
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  color: white;
  transition: background 0.3s ease;
}

.category-banner:hover .category-overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8));
}

.category-content {
  text-align: center;
}

.category-banner-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.category-banner-subtitle {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 15px;
  opacity: 0.8;
}

.shop-now-btn {
  display: inline-block;
  background-color: white;
  color: black;
  padding: 8px 20px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  transform: translateY(10px);
  opacity: 0;
}

.category-banner:hover .shop-now-btn {
  transform: translateY(0);
  opacity: 1;
}

.navigation-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

@media (max-width: 991px) {
  .category-banner {
    height: 300px;
  }
}

@media (max-width: 767px) {
  .category-banner {
    height: 250px;
  }
  
  .category-banner-title {
    font-size: 1.2rem;
  }
}
</style>
