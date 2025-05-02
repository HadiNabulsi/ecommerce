<template>
  <div class="filter-sidebar">
    <h4 class="filter-title">Filter Products</h4>
    
    <!-- تصفية حسب السعر -->
    <div class="filter-section">
      <h5 class="filter-section-title">Price</h5>
      <div class="price-range">
        <div class="price-inputs">
          <div class="price-input">
            <label>From</label>
            <input 
              type="number" 
              class="form-control" 
              v-model="minPrice" 
              @change="applyFilters"
              min="0"
            />
          </div>
          <div class="price-input">
            <label>To</label>
            <input 
              type="number" 
              class="form-control" 
              v-model="maxPrice" 
              @change="applyFilters"
              min="0"
            />
          </div>
        </div>
        <div class="price-slider mt-3">
          <input 
            type="range" 
            class="form-range" 
            min="0" 
            :max="maxPriceLimit" 
            v-model="minPrice" 
            @input="applyFilters"
          />
          <input 
            type="range" 
            class="form-range" 
            min="0" 
            :max="maxPriceLimit" 
            v-model="maxPrice" 
            @input="applyFilters"
          />
        </div>
      </div>
    </div>
    
    <!-- تصفية حسب التقييم -->
    <div class="filter-section">
      <h5 class="filter-section-title">Rating</h5>
      <div class="rating-filter">
        <div 
          v-for="rating in 5" 
          :key="rating" 
          class="rating-option"
          :class="{ 'active': selectedRating === rating }"
          @click="setRating(rating)"
        >
          <div class="stars">
            <i 
              v-for="star in 5" 
              :key="star" 
              :class="['fas', star <= rating ? 'fa-star' : 'fa-star-o']"
            ></i>
          </div>
          <span v-if="rating < 5">{{ rating }}+ Stars</span>
          <span v-else>{{ rating }} Stars</span>
        </div>
      </div>
    </div>
    
    <!-- تصفية حسب الفئة -->
    <div class="filter-section">
      <h5 class="filter-section-title">Category</h5>
      <div class="category-filter">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="form-check"
        >
          <input 
            class="form-check-input" 
            type="checkbox" 
            :id="'category-' + category.id" 
            :value="category.id" 
            v-model="selectedCategories"
            @change="applyFilters"
          />
          <label class="form-check-label" :for="'category-' + category.id">
            {{ category.englishName }}
          </label>
        </div>
      </div>
    </div>
    
    <!-- زر إعادة تعيين الفلاتر -->
    <button class="btn btn-outline-dark w-100 mt-3" @click="resetFilters">
      Reset Filters
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// تعريف المتغيرات
const minPrice = ref(0);
const maxPrice = ref(1000);
const maxPriceLimit = ref(1000);
const selectedRating = ref(0);
const selectedCategories = ref([]);

// تعريف الفئات (يمكن استبدالها بطلب API)
const categories = ref([
  { id: 'electronics', name: 'إلكترونيات', englishName: 'Electronics' },
  { id: 'jewelery', name: 'مجوهرات', englishName: 'Jewelry' },
  { id: "men's clothing", name: 'ملابس رجالية', englishName: "Men's Clothing" },
  { id: "women's clothing", name: 'ملابس نسائية', englishName: "Women's Clothing" }
]);

// تعريف الـ props
const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      categories: []
    })
  }
});

// تعريف الـ emits
const emit = defineEmits(['filter-change']);

// تطبيق الفلاتر الأولية
const initializeFilters = () => {
  minPrice.value = props.initialFilters.minPrice;
  maxPrice.value = props.initialFilters.maxPrice;
  selectedRating.value = props.initialFilters.rating;
  selectedCategories.value = [...props.initialFilters.categories];
};

// تطبيق الفلاتر
const applyFilters = () => {
  // التأكد من أن الحد الأدنى للسعر أقل من الحد الأقصى
  if (Number(minPrice.value) > Number(maxPrice.value)) {
    minPrice.value = maxPrice.value;
  }
  
  emit('filter-change', {
    minPrice: Number(minPrice.value),
    maxPrice: Number(maxPrice.value),
    rating: selectedRating.value,
    categories: selectedCategories.value
  });
};

// تعيين التقييم
const setRating = (rating) => {
  selectedRating.value = selectedRating.value === rating ? 0 : rating;
  applyFilters();
};

// إعادة تعيين الفلاتر
const resetFilters = () => {
  minPrice.value = 0;
  maxPrice.value = maxPriceLimit.value;
  selectedRating.value = 0;
  selectedCategories.value = [];
  applyFilters();
};

// تهيئة المكون
onMounted(() => {
  initializeFilters();
});

// مراقبة تغييرات الـ props
watch(() => props.initialFilters, () => {
  initializeFilters();
}, { deep: true });
</script>

<style scoped>
.filter-sidebar {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.filter-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 15px;
}

.price-inputs {
  display: flex;
  gap: 10px;
}

.price-input {
  flex: 1;
}

.price-input label {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 5px;
}

.rating-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-option:hover {
  background-color: #f0f0f0;
}

.rating-option.active {
  font-weight: 500;
}

.stars {
  color: #ffc107;
}

.category-filter {
  max-height: 150px;
  overflow-y: auto;
}

.form-check {
  margin-bottom: 8px;
}

.form-check-label {
  cursor: pointer;
}
</style>
