<template>
  <div class="product-detail-page py-5">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><NuxtLink to="/">Home</NuxtLink></li>
              <li class="breadcrumb-item" v-if="product.category">
                <NuxtLink :to="`/category/${product.category}`">
                  {{ formatCategoryName(product.category) }}
                </NuxtLink>
              </li>
              <li class="breadcrumb-item active" aria-current="page">{{ product.title }}</li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div v-if="loading" class="row">
        <div class="col-12 text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      
      <div v-else-if="error" class="row">
        <div class="col-12 text-center py-5">
          <div class="alert alert-danger" role="alert">
            {{ error }}
          </div>
        </div>
      </div>
      
      <div v-else class="row">
        <div class="col-md-6 mb-4">
          <div class="product-image-container">
            <img :src="product.image" :alt="product.title" class="img-fluid product-detail-image" />
          </div>
        </div>
        <div class="col-md-6">
          <h1 class="product-detail-title mb-3">{{ product.title }}</h1>
          
          <div class="product-detail-rating mb-3">
            <span class="stars">
              <span v-for="i in 5" :key="i" class="star">
                <span v-if="i <= Math.round(product.rating?.rate || 0)">★</span>
                <span v-else>☆</span>
              </span>
            </span>
            <span class="rating-count ms-2">({{ product.rating?.count || 0 }} reviews)</span>
          </div>
          
          <div class="product-detail-price mb-4">
            <span class="current-price">${{ product.price?.toFixed(2) }}</span>
          </div>
          
          <div class="product-detail-description mb-4">
            <p>{{ product.description }}</p>
          </div>
          
          <div class="product-detail-actions">
            <div class="quantity-selector mb-3">
              <label for="quantity" class="form-label">Quantity</label>
              <div class="input-group">
                <button class="btn btn-outline-dark" type="button" @click="decreaseQuantity">-</button>
                <input type="number" class="form-control text-center" id="quantity" v-model="quantity" min="1" max="10" />
                <button class="btn btn-outline-dark" type="button" @click="increaseQuantity">+</button>
              </div>
            </div>
            
            <div class="d-grid gap-2">
              <button class="btn btn-dark btn-lg" @click="addToCart">
                <img src="/Icons/Cart.png" alt="Cart" width="20" height="20" class="me-2" />
                Add to Cart
              </button>
              <button class="btn btn-outline-dark">
                <img src="/Icons/Heart.png" alt="Wishlist" width="20" height="20" class="me-2" />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related Products Section -->
      <div v-if="!loading && !error && relatedProducts.length > 0" class="related-products mt-5">
        <div class="row">
          <div class="col-12">
            <h2 class="section-title mb-4">Related Products</h2>
          </div>
        </div>
        <div class="row">
          <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" class="col-md-3 col-sm-6 mb-4">
            <ProductCard :product="relatedProduct" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRuntimeConfig } from 'nuxt/app';
import { useCartStore } from '~/stores/cart';
import ProductCard from '~/components/product/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const cartStore = useCartStore();

const product = ref({});
const relatedProducts = ref([]);
const quantity = ref(1);
const loading = ref(true);
const error = ref(null);

// Format category name for display
const formatCategoryName = (name) => {
  if (!name) return '';
  return name
    .split("'")
    .join('')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Fetch product details
const fetchProduct = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const productId = route.params.id;
    const response = await fetch(`${config.public.apiBase}/products/${productId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    product.value = await response.json();
    
    // Set page metadata
    useHead({
      title: `${product.value.title} - Developer Test`,
      meta: [
        { name: 'description', content: product.value.description }
      ]
    });
    
    // Fetch related products from the same category
    fetchRelatedProducts(product.value.category);
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = 'Failed to load product details. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// Fetch related products
const fetchRelatedProducts = async (category) => {
  try {
    const response = await fetch(`${config.public.apiBase}/products/category/${category}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch related products: ${response.statusText}`);
    }
    
    const products = await response.json();
    
    // Filter out the current product and limit to 4 related products
    relatedProducts.value = products
      .filter(p => p.id !== product.value.id)
      .slice(0, 4);
  } catch (err) {
    console.error('Error fetching related products:', err);
    // Don't set error state as this is not critical
  }
};

// Quantity controls
const increaseQuantity = () => {
  if (quantity.value < 10) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Add to cart
const addToCart = () => {
  cartStore.addToCart({
    id: product.value.id,
    title: product.value.title,
    price: product.value.price,
    image: product.value.image,
    quantity: quantity.value
  });
  
  // Show success message
  alert(`Added ${quantity.value} ${product.value.title} to your cart!`);
};

onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.product-image-container {
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
}

.product-detail-image {
  max-height: 400px;
  object-fit: contain;
}

.product-detail-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.product-detail-rating {
  color: #FFD700;
  font-size: 1.2rem;
}

.rating-count {
  color: #777;
  font-size: 0.9rem;
}

.product-detail-price {
  font-size: 1.8rem;
  font-weight: bold;
}

.product-detail-description {
  color: #555;
  line-height: 1.6;
}

.quantity-selector .form-control {
  max-width: 80px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 10px;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: #000;
}

.breadcrumb-item a {
  color: #777;
  text-decoration: none;
}

.breadcrumb-item.active {
  color: #000;
  font-weight: 500;
}
</style>
