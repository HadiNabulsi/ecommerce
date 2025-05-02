<template>
  <div class="category-page py-5">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><NuxtLink to="/">Home</NuxtLink></li>
              <li class="breadcrumb-item active" aria-current="page">{{ formatCategoryName(category) }}</li>
            </ol>
          </nav>
          <h1 class="category-title mb-4">{{ formatCategoryName(category) }}</h1>
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
      
      <div v-else-if="products.length === 0" class="row">
        <div class="col-12 text-center py-5">
          <div class="alert alert-info" role="alert">
            No products found in this category.
          </div>
        </div>
      </div>
      
      <div v-else class="row">
        <div v-for="product in products" :key="product.id" class="col-md-3 col-sm-6 mb-4">
          <ProductCard :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from 'nuxt/app';
import ProductCard from '~/components/product/ProductCard.vue';

const route = useRoute();
const config = useRuntimeConfig();
const category = ref('');
const products = ref([]);
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

// Fetch products by category
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    category.value = route.params.id;
    const response = await fetch(`${config.public.apiBase}/products/category/${category.value}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    products.value = await response.json();
    
    // Set page metadata
    useHead({
      title: `${formatCategoryName(category.value)} - Developer Test`,
      meta: [
        { name: 'description', content: `Shop our collection of ${formatCategoryName(category.value)} products.` }
      ]
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = 'Failed to load products. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// Watch for route changes to fetch products when category changes
watch(() => route.params.id, () => {
  if (route.params.id !== category.value) {
    fetchProducts();
  }
});

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.category-title {
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 30px;
}

.breadcrumb {
  margin-bottom: 20px;
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
