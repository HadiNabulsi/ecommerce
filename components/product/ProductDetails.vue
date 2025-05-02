<template>
  <div class="product-details">
    <div class="container">
      <!-- عرض حالة التحميل -->
      <div v-if="isLoading" class="loading-container py-5">
        <div class="loading-spinner"></div>
        <p class="mt-3">Loading product data...</p>
      </div>

      <!-- عرض رسالة الخطأ -->
      <div v-else-if="error" class="alert alert-danger my-5" role="alert">
        <h4 class="alert-heading">Error Occurred!</h4>
        <p>{{ error }}</p>
        <hr>
        <p class="mb-0">
          <button class="btn btn-outline-danger" @click="loadProductData">Try Again</button>
        </p>
      </div>

      <!-- عرض بيانات المنتج -->
      <div v-else-if="product" class="row">
        <!-- صور المنتج -->
        <div class="col-lg-6 mb-4">
          <div class="product-images">
            <div class="main-image mb-3">
              <img :src="product.image" :alt="product.title" class="img-fluid" />
            </div>
          </div>
        </div>
        
        <!-- معلومات المنتج -->
        <div class="col-lg-6">
          <div class="product-info">
            <h1 class="product-title mb-3">{{ product.title }}</h1>
            
            <div class="product-rating d-flex align-items-center mb-3">
              <div class="stars">
                <i 
                  v-for="star in 5" 
                  :key="star" 
                  :class="['fas', star <= Math.round(product.rating?.rate || 0) ? 'fa-star' : 'fa-star-o']"
                ></i>
              </div>
              <span class="rating-value ms-2">{{ product.rating?.rate || 0 }}</span>
              <span class="reviews-count ms-2">({{ product.rating?.count || 0 }} reviews)</span>
            </div>
            
            <div class="product-price mb-4">
              <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice.toFixed(2) }}</span>
              <span class="current-price">${{ product.price.toFixed(2) }}</span>
              <span v-if="product.originalPrice" class="discount-badge">
                {{ calculateDiscount(product.price, product.originalPrice) }}% OFF
              </span>
            </div>
            
            <div class="product-description mb-4">
              <p>{{ product.description }}</p>
            </div>
            
            <div class="quantity-selector mb-4">
              <h6 class="quantity-title mb-2">Quantity:</h6>
              <div class="quantity-controls">
                <button class="btn btn-outline-secondary" @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
                <span class="quantity-display">{{ quantity }}</span>
                <button class="btn btn-outline-secondary" @click="increaseQuantity">+</button>
              </div>
            </div>
            
            <div class="product-actions d-flex mb-4">
              <button class="btn btn-dark flex-grow-1 me-2" @click="addToCart">
                <img src="/Icons/Cart.png" alt="Cart" width="20" height="20" class="me-2" />
                Add to Cart
              </button>
              <button class="btn btn-outline-dark" @click="toggleWishlist">
                <img 
                  :src="isInWishlist ? '/Icons/HeartFilled.png' : '/Icons/Heart.png'" 
                  alt="Wishlist" 
                  width="20" 
                  height="20" 
                />
              </button>
            </div>
            
            <div class="product-meta">
              <div class="meta-item mb-2">
                <span class="meta-label">Category:</span>
                <NuxtLink :to="`/category/${product.category}`" class="meta-value">
                  {{ getCategoryName(product.category) }}
                </NuxtLink>
              </div>
              <div class="meta-item mb-2">
                <span class="meta-label">Product Code:</span>
                <span class="meta-value">SKU-{{ product.id }}</span>
              </div>
              <div class="meta-item mb-2">
                <span class="meta-label">Availability:</span>
                <span class="meta-value" :class="{ 'text-success': product.inStock, 'text-danger': !product.inStock }">
                  {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- تفاصيل المنتج -->
      <div class="row mt-5">
        <div class="col-12">
          <h3 class="section-title mb-4">Product Details</h3>
          <div class="product-description-full p-4 border rounded">
            <p>{{ product.description }}</p>
          </div>
          
          <h3 class="section-title mb-4 mt-4">Specifications</h3>
          <div class="product-specifications p-4 border rounded">
            <table class="table table-striped">
              <tbody>
                <tr v-for="(value, key) in productSpecifications" :key="key">
                  <th scope="row">{{ key }}</th>
                  <td>{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- منتجات ذات صلة -->
      <div class="related-products mt-5">
        <h3 class="section-title mb-4">Related Products</h3>
        <div class="row">
          <div 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            class="col-6 col-md-4 col-lg-3 mb-4"
          >
            <ProductCard :product="relatedProduct" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import { useWishlistStore } from '~/stores/wishlist';
import ProductCard from '~/components/product/ProductCard.vue';

// متغيرات المنتج
const product = ref(null);
// استخدام معرف المنتج من الراوت
const route = useRoute();
const productId = ref(route.params.id || 1); // استخدام 1 كقيمة افتراضية إذا لم يتم توفير معرف المنتج
const isLoading = ref(true);
const error = ref(null);

// متغيرات الحالة
const quantity = ref(1);

// استدعاء مخزن السلة
const cartStore = useCartStore();

// مواصفات المنتج
const productSpecifications = computed(() => {
  if (!product.value) return {};
  
  // استخلاص المواصفات من بيانات المنتج
  const specs = {};
  
  // إضافة المواصفات المتوفرة فقط
  if (product.value.category) {
    specs['Category'] = getCategoryName(product.value.category);
  }
  
  if (product.value.id) {
    specs['ID'] = `SKU-${product.value.id}`;
  }
  
  if (product.value.price) {
    specs['Price'] = `$${product.value.price}`;
  }
  
  if (product.value.rating) {
    specs['Rating'] = `${product.value.rating.rate || 0}/5 (${product.value.rating.count || 0} reviews)`;
  }
  
  return specs;
});

// منتجات ذات صلة
const relatedProducts = ref([]);

// جلب المنتجات ذات الصلة من API
const fetchRelatedProducts = async () => {
  // التأكد من وجود فئة للمنتج الحالي
  if (!product.value || !product.value.category) return;
  
  try {
    // جلب المنتجات من نفس الفئة
    const response = await fetch(`https://fakestoreapi.com/products/category/${product.value.category}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch related products: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // استبعاد المنتج الحالي من النتائج
    const filteredProducts = data.filter(item => item.id !== product.value.id);
    
    // أخذ أول 4 منتجات فقط
    relatedProducts.value = filteredProducts.slice(0, 4);
  } catch (error) {
    console.error('Error fetching related products:', error);
    relatedProducts.value = [];
  }
};

// استدعاء دالة جلب المنتجات ذات الصلة عند تغير المنتج
watch(() => product.value, (newProduct) => {
  if (newProduct) {
    fetchRelatedProducts();
  }
}, { immediate: true });

// زيادة الكمية
const increaseQuantity = () => {
  quantity.value++;
};

// تقليل الكمية
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// إضافة إلى السلة
const addToCart = () => {
  cartStore.addToCart({
    id: product.value.id,
    title: product.value.title,
    price: product.value.price,
    image: product.value.image,
    quantity: quantity.value,
  });
  
  // إظهار رسالة نجاح
  alert(`Added ${quantity.value} ${product.value.title} to your cart`);
};

// استدعاء مخزن المفضلة
const wishlistStore = useWishlistStore();

// التحقق من وجود المنتج في المفضلة
const isInWishlist = computed(() => {
  if (!product.value) return false;
  return wishlistStore.isInWishlist(product.value.id);
});

// تبديل المفضلة
const toggleWishlist = () => {
  if (!product.value) return;
  
  if (isInWishlist.value) {
    // إزالة المنتج من المفضلة
    wishlistStore.removeFromWishlist(product.value.id);
  } else {
    // إضافة المنتج إلى المفضلة
    wishlistStore.addToWishlist({
      id: product.value.id,
      title: product.value.title,
      price: product.value.price,
      image: product.value.image,
      category: product.value.category
    });
  }
};

// حساب نسبة الخصم
const calculateDiscount = (currentPrice, originalPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// الحصول على اسم الفئة
const getCategoryName = (categorySlug) => {
  // ترجمة أسماء الفئات
  const categories = {
    'electronics': 'Electronics',
    'jewelery': 'Jewelry',
    "men's clothing": "Men's Clothing",
    "women's clothing": "Women's Clothing"
  };
  
  return categories[categorySlug] || categorySlug;
};


// تحميل بيانات المنتج
const loadProductData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // جلب بيانات المنتج من API
    const response = await fetch(`https://fakestoreapi.com/products/${productId.value}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // استخدام البيانات من API
    product.value = {
      ...data,
      inStock: true // حالة توفر المنتج
    };
    
    // جلب المنتجات ذات الصلة
    fetchRelatedProducts();
  } catch (error) {
    console.error('Error loading product data:', error);
    error.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// تهيئة المكون
onMounted(() => {
  // تحميل بيانات المنتج عند تهيئة المكون
  loadProductData();
});

</script>

<style scoped>
.product-details {
  padding: 40px 0;
}

.loading-container {
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #000;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.product-images {
  position: relative;
}

.main-image {
  background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image img {
  max-height: 350px;
  object-fit: contain;
}

.product-title {
  font-size: 1.8rem;
  font-weight: 600;
}

.product-rating {
  display: flex;
  align-items: center;
}

.stars {
  color: #FFD700;
}

.rating-value {
  font-weight: 600;
}

.reviews-count {
  color: #666;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-price {
  font-size: 1.8rem;
  font-weight: 700;
}

.original-price {
  font-size: 1.2rem;
  text-decoration: line-through;
  color: #999;
}

.discount-badge {
  background-color: #dc3545;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.product-description {
  color: #666;
  line-height: 1.6;
}

.quantity-controls {
  display: flex;
  align-items: center;
  width: fit-content;
}

.quantity-display {
  min-width: 50px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0 15px;
}

.product-actions {
  margin-top: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-label {
  font-weight: 600;
  margin-right: 10px;
  min-width: 100px;
}

.meta-value {
  color: #666;
}

.meta-value.text-success {
  color: #28a745 !important;
  font-weight: 600;
}

.meta-value.text-danger {
  color: #dc3545 !important;
  font-weight: 600;
}

.section-title {
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: #000;
}



@media (max-width: 767px) {
  .main-image {
    height: 300px;
  }
  

  
  .product-title {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 1.5rem;
  }
}
</style>
