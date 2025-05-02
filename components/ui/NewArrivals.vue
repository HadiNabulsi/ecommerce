<template>
  <section class="new-arrivals py-5">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="category-title">NEW ARRIVALS</h2>
        </div>
      </div>
      
      <!-- عرض المنتجات بالشرائح -->
      <div class="position-relative new-products-slider mb-4">
        <!-- أزرار التنقل -->
        <button class="nav-arrow prev-arrow" @click="prevSlide">
          <span class="arrow-content">←</span>
        </button>
        
        <button class="nav-arrow next-arrow" @click="nextSlide">
          <span class="arrow-content">→</span>
        </button>
        
        <!-- شرائح المنتجات -->
        <div class="new-products-wrapper" ref="productsContainer">
          <div class="products-slide" :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
            <div v-for="(productGroup, index) in newArrivals" :key="index" class="product-group">
              <div v-for="product in productGroup" :key="product.id" class="product-card">
                <div class="product-image-container">
                  <img :src="product.image" :alt="product.title" class="img-fluid product-image" />
                  <div class="product-actions">
                    <button class="btn btn-sm btn-light me-2" title="Add to wishlist">
                      <img src="/Icons/Heart.png" alt="Wishlist" width="16" height="16" />
                    </button>
                    <button class="btn btn-sm btn-dark" @click="addToCart(product)" title="Add to cart">
                      <img src="/Icons/Cart.png" alt="Cart" width="16" height="16" />
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div class="product-info p-3">
                  <NuxtLink :to="`/product/${product.id}`" class="product-title-link">
                    <h3 class="product-title">{{ product.title }}</h3>
                  </NuxtLink>
                  <div class="product-price">${{ product.price.toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- استخدام مكون CarouselIndicators للتنقل بين الشرائح -->
      <div class="row">
        <div class="col-12">
          <CarouselIndicators
            carouselId="newArrivalsCarousel"
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
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
import { useCartStore } from '~/stores/cart';
import CarouselIndicators from '~/components/ui/CarouselIndicators.vue';

const config = useRuntimeConfig();
const newArrivals = ref([]);
const cartStore = useCartStore();
const activeSlide = ref(0);
const totalSlides = ref(0);
const productsContainer = ref(null);

onMounted(async () => {
  try {
    // جلب جميع المنتجات
    const response = await fetch(`${config.public.apiBase}/products`);
    const allProducts = await response.json();
    
    // فرز المنتجات حسب الفئات
    // توسيع نطاق البحث عن المنتجات التقنية
    const electronics = allProducts.filter(product => 
      product.category === 'electronics' || 
      product.title.toLowerCase().includes('phone') || 
      product.title.toLowerCase().includes('laptop') ||
      product.title.toLowerCase().includes('camera') ||
      product.title.toLowerCase().includes('computer') ||
      product.title.toLowerCase().includes('tv') ||
      product.title.toLowerCase().includes('headphone') ||
      product.title.toLowerCase().includes('watch') ||
      product.title.toLowerCase().includes('smart') ||
      product.description?.toLowerCase().includes('electronic')
    );
    
    const otherProducts = allProducts.filter(product => 
      !(product.category === 'electronics' || 
      product.title.toLowerCase().includes('phone') || 
      product.title.toLowerCase().includes('laptop') ||
      product.title.toLowerCase().includes('camera') ||
      product.title.toLowerCase().includes('computer') ||
      product.title.toLowerCase().includes('tv') ||
      product.title.toLowerCase().includes('headphone') ||
      product.title.toLowerCase().includes('watch') ||
      product.title.toLowerCase().includes('smart') ||
      product.description?.toLowerCase().includes('electronic'))
    );
    
    // التأكد من وجود منتجات إلكترونية
    if (electronics.length === 0) {
      console.warn('لا توجد منتجات إلكترونية متاحة');
    }
    
    // تحديد عدد المنتجات في كل شريحة
    const productsPerSlide = 4;
    
    // إنشاء الشريحة الأولى للإلكترونيات
    const productGroups = [];
    let remainingProducts = [];
    
    // إنشاء مجموعة منتجات للشريحة الأولى مع التأكد من أن المنتج الأول تقني
    if (electronics.length > 0) {
      // فرز المنتجات التقنية بحيث تظهر المنتجات الأكثر تقنية أولاً
      electronics.sort((a, b) => {
        // ترتيب المنتجات التقنية بناءً على الفئة والعنوان
        const aScore = getElectronicsScore(a);
        const bScore = getElectronicsScore(b);
        return bScore - aScore; // ترتيب تنازلي
      });
      
      // وضع منتجات التكنولوجيا في الشريحة الأولى
      const electronicsGroup = electronics.slice(0, productsPerSlide);
      productGroups.push(electronicsGroup);
      
      // إضافة باقي المنتجات في شرائح أخرى
      remainingProducts = [...electronics.slice(productsPerSlide), ...otherProducts];
    } else {
      // إذا لم تكن هناك منتجات إلكترونية، استخدم المنتجات الأخرى
      remainingProducts = [...otherProducts];
      
      // إنشاء الشريحة الأولى من المنتجات الأخرى
      if (otherProducts.length > 0) {
        const firstGroup = otherProducts.slice(0, productsPerSlide);
        productGroups.push(firstGroup);
        remainingProducts = otherProducts.slice(productsPerSlide);
      }
    }
    
    for (let i = 0; i < remainingProducts.length; i += productsPerSlide) {
      if (i + productsPerSlide <= remainingProducts.length) {
        productGroups.push(remainingProducts.slice(i, i + productsPerSlide));
      }
    }
    
    // تعيين المنتجات والشرائح
    newArrivals.value = productGroups;
    totalSlides.value = productGroups.length;
    
    // بدء التبديل التلقائي للشرائح
    startAutoSlide();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});

const addToCart = (product) => {
  cartStore.addToCart({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    quantity: 1
  });
};

const prevSlide = () => {
  activeSlide.value = (activeSlide.value - 1 + totalSlides.value) % totalSlides.value;
};

const nextSlide = () => {
  // إضافة فئة للتأثير الانتقالي
  if (productsContainer.value) {
    productsContainer.value.classList.add('sliding');
  }
  
  // الانتقال إلى الشريحة التالية
  activeSlide.value = (activeSlide.value + 1) % totalSlides.value;
  
  // إزالة الفئة بعد انتهاء التأثير
  setTimeout(() => {
    if (productsContainer.value) {
      productsContainer.value.classList.remove('sliding');
    }
  }, 800);
};

const handleSlideChange = (slideIndex) => {
  activeSlide.value = slideIndex;
};

// دالة لتحديد درجة "تقنية" المنتج لاستخدامها في الترتيب
const getElectronicsScore = (product) => {
  let score = 0;
  
  // إعطاء نقاط بناءً على الفئة
  if (product.category === 'electronics') {
    score += 100;
  }
  
  // إعطاء نقاط بناءً على العنوان
  const title = product.title.toLowerCase();
  if (title.includes('phone')) score += 90;
  if (title.includes('laptop')) score += 85;
  if (title.includes('computer')) score += 80;
  if (title.includes('camera')) score += 75;
  if (title.includes('tv')) score += 70;
  if (title.includes('smart')) score += 65;
  if (title.includes('watch')) score += 60;
  if (title.includes('headphone')) score += 55;
  
  // إعطاء نقاط إضافية بناءً على الوصف
  if (product.description?.toLowerCase().includes('electronic')) {
    score += 30;
  }
  
  return score;
};

const startAutoSlide = () => {
  // تشغيل التبديل التلقائي للشرائح كل 5 ثوانٍ
  const autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
  
  // إيقاف التبديل التلقائي عند تمرير المؤشر فوق الشرائح
  const sliderElement = document.querySelector('.new-products-slider');
  if (sliderElement) {
    sliderElement.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
    
    sliderElement.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }
  
  return autoSlideInterval;
};
</script>

<style scoped>
.new-arrivals {
  background-color: #fff;
}

.product-group {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  min-width: 100%;
  flex: 0 0 100%;
}

.products-slide {
  display: flex;
  transition: transform 0.8s ease;
  width: 100%;
  overflow: visible;
}

.product-card {
  flex: 0 0 auto;
  width: calc(25% - 20px);
  margin: 0 10px;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  height: 350px;
  display: flex;
  flex-direction: column;
  padding: 15px 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  height: 200px;
  object-fit: contain;
  background-color: #f9f9f9;
  padding: 20px;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-actions {
  position: absolute;
  bottom: -50px;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  transition: bottom 0.3s ease;
}

.product-card:hover .product-actions {
  bottom: 0;
}

.product-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #333;
}

.product-title-link {
  text-decoration: none;
}

.product-title-link:hover .product-title {
  color: #000;
}

.product-price {
  font-weight: bold;
  color: #000;
  font-size: 1.1rem;
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.category-title {
  font-size: 3rem;
  font-weight: 600;
  text-align: left;
  margin-top: 3rem;
  margin-bottom: 0.2rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: -50px; 
}

.new-products-slider {
  position: relative;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.prev-arrow {
  left: -20px;
}

.next-arrow {
  right: -20px;
}

.arrow-content {
  font-size: 24px;
  font-weight: bold;
}

.new-products-wrapper {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.new-products-wrapper.sliding {
  transition: transform 0.8s ease;
}
</style>
