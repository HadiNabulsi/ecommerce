<template>
  <div class="search-page py-5">
    <div class="container">
      <Breadcrumbs :breadcrumbs="[{ name: 'Search Results', path: '/search' }]" />
      
      <div class="row">
        <div class="col-lg-3 mb-4">
          <FilterSidebar 
            :initialFilters="filters" 
            @filter-change="applyFilters" 
          />
        </div>
        
        <div class="col-lg-9">
          <div class="search-header d-flex justify-content-between align-items-center mb-4">
            <h1 class="search-title mb-0">Search Results: "{{ searchQuery }}"</h1>
            <div class="search-count">{{ filteredProducts.length }} products</div>
          </div>
          
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading products...</p>
          </div>
          
          <div v-else-if="filteredProducts.length === 0" class="no-results text-center py-5">
            <div class="no-results-icon mb-3">
              <i class="fas fa-search fa-3x text-muted"></i>
            </div>
            <h5>No Results Found</h5>
            <p class="text-muted">We couldn't find any products matching "{{ searchQuery }}".</p>
            <p class="text-muted">Try searching with different keywords or browse categories.</p>
            <div class="mt-4">
              <NuxtLink to="/" class="btn btn-dark me-2">Return to Home</NuxtLink>
              <button class="btn btn-outline-dark" @click="clearFilters">Clear Filters</button>
            </div>
          </div>
          
          <div v-else>
            <div class="sort-options d-flex justify-content-end mb-3">
              <select class="form-select w-auto" v-model="sortOption">
                <option value="relevance">Most Relevant</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            
            <div class="row">
              <div v-for="product in paginatedProducts" :key="product.id" class="col-md-4 mb-4">
                <ProductCard :product="product" />
              </div>
            </div>
            
            <div v-if="filteredProducts.length > itemsPerPage" class="pagination-container d-flex justify-content-center mt-4">
              <nav aria-label="Page navigation">
                <ul class="pagination">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
                  </li>
                  <li 
                    v-for="page in totalPages" 
                    :key="page" 
                    class="page-item"
                    :class="{ active: page === currentPage }"
                  >
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// استيراد المكتبات اللازمة
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumbs from '~/components/common/Breadcrumbs.vue';
import FilterSidebar from '~/components/common/FilterSidebar.vue';
import ProductCard from '~/components/product/ProductCard.vue';

const route = useRoute();
const router = useRouter();

// متغيرات الحالة
const searchQuery = ref('');
const allProducts = ref([]); // جميع المنتجات
const searchResults = ref([]); // نتائج البحث فقط
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(9);
const sortOption = ref('relevance');

// فلاتر البحث
const filters = ref({
  minPrice: 0,
  maxPrice: 1000,
  rating: 0,
  categories: []
});

// تحميل المنتجات
const loadProducts = async () => {
  isLoading.value = true;
  
  try {
    // في البيئة الحقيقية، سيتم جلب المنتجات من API
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    allProducts.value = data;
    
    // تحديث الحد الأقصى للسعر
    const maxPrice = Math.max(...allProducts.value.map(p => p.price));
    filters.value.maxPrice = Math.ceil(maxPrice);
    
    // تنفيذ البحث بناءً على الاستعلام الحالي
    performSearch();
  } catch (error) {
    console.error('Error fetching products:', error);
    allProducts.value = [];
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

// تنفيذ البحث
const performSearch = () => {
  // إذا لم تكن هناك كلمة بحث، أرجع مصفوفة فارغة
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    searchResults.value = [];
    return;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  
  // تقسيم كلمة البحث إلى كلمات منفصلة للبحث عن كل كلمة على حدة
  const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
  
  // البحث في جميع المنتجات
  searchResults.value = allProducts.value.filter(product => {
    // تحويل بيانات المنتج إلى نص واحد للبحث فيه
    const productTitle = product.title.toLowerCase();
    const productDescription = product.description.toLowerCase();
    const productCategory = product.category.toLowerCase();
    
    // التحقق من أن جميع كلمات البحث موجودة في المنتج
    return searchTerms.every(term => {
      return (
        productTitle.includes(term) || 
        productDescription.includes(term) || 
        productCategory.includes(term)
      );
    });
  });
  
  console.log(`Found ${searchResults.value.length} products for search query: "${query}"`);
};

// تطبيق الفلاتر
const applyFilters = (newFilters) => {
  filters.value = { ...newFilters };
  currentPage.value = 1; // إعادة تعيين الصفحة الحالية
};

// إزالة الفلاتر
const clearFilters = () => {
  filters.value = {
    minPrice: 0,
    maxPrice: Math.max(...allProducts.value.map(p => p.price)),
    rating: 0,
    categories: []
  };
  currentPage.value = 1;
};

// المنتجات المفلترة (بعد تطبيق الفلاتر على نتائج البحث)
const filteredProducts = computed(() => {
  return searchResults.value.filter(product => {
    // تصفية حسب السعر
    if (product.price < filters.value.minPrice || product.price > filters.value.maxPrice) {
      return false;
    }
    
    // تصفية حسب التقييم
    if (filters.value.rating > 0 && product.rating.rate < filters.value.rating) {
      return false;
    }
    
    // تصفية حسب الفئة
    if (filters.value.categories.length > 0 && !filters.value.categories.includes(product.category)) {
      return false;
    }
    
    return true;
  });
});

// المنتجات المرتبة
const sortedProducts = computed(() => {
  let sorted = [...filteredProducts.value];
  
  switch (sortOption.value) {
    case 'priceAsc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      // في البيئة الحقيقية، سيكون هناك حقل تاريخ للمنتج
      sorted.sort((a, b) => b.id - a.id);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    default:
      // الأكثر صلة (الافتراضي)
      break;
  }
  
  return sorted;
});

// المنتجات المعروضة في الصفحة الحالية
const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  
  return sortedProducts.value.slice(startIndex, endIndex);
});

// إجمالي الصفحات
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

// تغيير الصفحة
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) {
    return;
  }
  currentPage.value = page;
};

// تعيين عنوان الصفحة
useHead({
  title: 'Search Results',
  meta: [
    { name: 'description', content: 'Search for products in our online store' }
  ]
});

// تهيئة المكون
onMounted(() => {
  // تحميل المنتجات
  loadProducts();
  
  // تعيين قيمة البحث من معلمة الرابط
  if (route.query.q) {
    searchQuery.value = route.query.q;
  } else {
    // إذا لم تكن هناك كلمة بحث، عد إلى الصفحة الرئيسية
    router.push('/');
  }
});

// مراقبة تغييرات الـ route
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery;
    // إعادة تنفيذ البحث عند تغيير الاستعلام
    performSearch();
  } else {
    // إذا تم إزالة كلمة البحث، عد إلى الصفحة الرئيسية
    router.push('/');
  }
  currentPage.value = 1;
}, { immediate: true });

// مراقبة تغييرات كلمة البحث
watch(searchQuery, () => {
  performSearch();
  currentPage.value = 1;
});

// مراقبة تغييرات خيار الترتيب
watch(sortOption, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.search-page {
  min-height: 70vh;
}

.search-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.search-count {
  color: #666;
  font-size: 0.9rem;
}

.no-results {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 40px 20px;
}

.no-results-icon {
  color: #ccc;
}

.sort-options {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 30px;
}
</style>
