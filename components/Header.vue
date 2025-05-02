<template>
  <!-- الشريط الأسود في الأعلى -->
  <div class="bg-black py-3 w-100"></div>
  
  <header>
    <!-- قائمة الموبايل المنسدلة -->
    <div v-if="mobileMenuOpen" class="mobile-menu-backdrop" @click="mobileMenuOpen = false"></div>
    
    <div class="container-fluid position-relative">
      <!-- ===== عرض الموبايل ===== -->
      <div class="mobile-view d-flex d-md-none w-100 justify-content-between align-items-center">
        <!-- أيقونة البحث في وضع الموبايل -->
        <div class="mobile-search-icon" @click="mobileSearchOpen = !mobileSearchOpen">
          <img src="/Icons/SearchMouve.png" alt="Search" width="20" height="20" />
        </div>
        
        <!-- الشعار في وضع الموبايل -->
        <NuxtLink to="/" class="mobile-logo">
          <img src="/Icons/LogoBlack.png" alt="Logo" height="80" width="80" />
        </NuxtLink>
        
        <button 
          class="mobile-menu-toggle border-0 bg-transparent" 
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle menu"
        >
          <!-- أيقونة الإغلاق -->
          <svg 
            v-if="mobileMenuOpen" 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="mobile-menu-icon"
          >
            <path d="M18 6L6 18"></path>
            <path d="M6 6L18 18"></path>
          </svg>
          
          <!-- أيقونة القائمة -->
          <svg 
            v-else 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="mobile-menu-icon"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- قائمة الموبايل المنسدلة -->
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <div class="mobile-menu-content">
          <div class="mobile-menu-header">
            <span>Navigation</span>
          </div>
          
          <div class="mobile-menu-items">
            <!-- روابط التنقل -->
            <NuxtLink to="/" class="mobile-menu-item" @click="mobileMenuOpen = false">Home</NuxtLink>
            <a href="#" class="mobile-menu-item" @click="mobileMenuOpen = false">About Us</a>
            <a href="#" class="mobile-menu-item" @click="mobileMenuOpen = false">Media Center</a>
            <a href="#" class="mobile-menu-item" @click="mobileMenuOpen = false">Contact Us</a>
            
            <!-- الفئات -->
            <div class="mobile-categories">
              <div class="mobile-category-header" @click="categoryMenuOpen = !categoryMenuOpen">
                <span>Categories</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  :class="{'rotate-180': categoryMenuOpen}"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              <div v-if="categoryMenuOpen" class="mobile-category-items">
                <NuxtLink to="/category/electronics" class="mobile-category-item" @click="mobileMenuOpen = false">ELECTRONICS</NuxtLink>
                <NuxtLink to="/category/jewelery" class="mobile-category-item" @click="mobileMenuOpen = false">JEWELRY</NuxtLink>
                <NuxtLink to="/category/men's clothing" class="mobile-category-item" @click="mobileMenuOpen = false">MEN CLOTHING</NuxtLink>
                <NuxtLink to="/category/women's clothing" class="mobile-category-item" @click="mobileMenuOpen = false">WOMEN CLOTHING</NuxtLink>
              </div>
            </div>
            
            <!-- أيقونات -->
            <div class="mobile-menu-icons">
              <NuxtLink to="/wishlist" class="mobile-menu-icon-item" @click="mobileMenuOpen = false">
                <img src="/Icons/Heart.png" alt="Wishlist" width="20" height="20" />
                <span>Wishlist</span>
                <span v-if="wishlistCount > 0" class="mobile-badge">{{ wishlistCount }}</span>
              </NuxtLink>
              
              <NuxtLink to="/cart" class="mobile-menu-icon-item" @click="mobileMenuOpen = false">
                <img src="/Icons/Cart.png" alt="Cart" width="20" height="20" />
                <span>Cart</span>
                <span v-if="cartCount > 0" class="mobile-badge">{{ cartCount }}</span>
              </NuxtLink>
              
              <a href="#" class="mobile-menu-icon-item">
                <img src="/Icons/Login.png" alt="Login" width="20" height="20" />
                <span>Login</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- حقل البحث في وضع الموبايل -->
      <div v-if="mobileSearchOpen" class="mobile-search">
        <div class="mobile-search-content">
          <input 
            type="text" 
            placeholder="Search" 
            class="mobile-search-input"
            v-model="searchQuery" 
            @keyup.enter="performSearch(); mobileSearchOpen = false;" 
          />
          <button 
            class="mobile-search-btn"
            @click="performSearch(); mobileSearchOpen = false;"
          >
            <img src="/Icons/SearchMouve.png" alt="Search" />
          </button>
        </div>
      </div>
      
      <!-- ===== عرض سطح المكتب ===== -->
      <div class="desktop-view d-none d-md-block">
        <!-- الشعار -->
        <NuxtLink to="/" class="logo position-absolute">
          <img src="/Icons/LogoBlack.png" alt="Logo" height="140" width="140" />
        </NuxtLink>
        
        <!-- شريط التنقل العلوي -->
        <div class="top-nav position-absolute d-flex">
          <NuxtLink to="/" class="nav-link text-decoration-none text-dark">Home</NuxtLink>
          <a href="#" class="nav-link text-decoration-none text-dark">About Us</a>
          <a href="#" class="nav-link text-decoration-none text-dark">Media Center</a>
          <a href="#" class="nav-link text-decoration-none text-dark">Contact Us</a>
        </div>
        
        <!-- زر تغيير اللغة AR -->
        <div class="lang-switch position-absolute fw-bold">AR</div>
        
        <!-- الفئات -->
        <div class="categories position-absolute d-flex">
          <NuxtLink to="/category/electronics" class="category-link text-decoration-none text-dark">ELECTRONICS</NuxtLink>
          <NuxtLink to="/category/jewelery" class="category-link text-decoration-none text-dark">JEWELRY</NuxtLink>
          <NuxtLink to="/category/men's clothing" class="category-link text-decoration-none text-dark">MEN CLOTHING</NuxtLink>
          <NuxtLink to="/category/women's clothing" class="category-link text-decoration-none text-dark">WOMEN CLOTHING</NuxtLink>
        </div>
        
        <!-- البحث -->
        <div class="search-box position-absolute">
          <div class="position-relative">
            <input 
              type="text" 
              placeholder="Search" 
              class="search-input border-0 w-100 h-100"
              v-model="searchQuery" 
              @keyup.enter="performSearch" 
            />
            <div 
              class="search-icon position-absolute d-flex align-items-center justify-content-center"
              @click="performSearch"
            >
              <img src="/Icons/SearchMouve.png" alt="Search" />
            </div>
          </div>
        </div>
        
        <!-- الأيقونات -->
        <div class="icons position-absolute d-flex">
          <a href="#" class="text-dark">
            <img src="/Icons/Login.png" alt="Login" width="22" height="22" />
          </a>
          <NuxtLink to="/wishlist" class="text-dark position-relative">
            <img src="/Icons/Heart.png" alt="Heart" width="22" height="22" />
            <span 
              v-if="wishlistCount > 0" 
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            >
              {{ wishlistCount }}
            </span>
          </NuxtLink>
          <NuxtLink to="/cart" class="text-dark position-relative">
            <img src="/Icons/Cart.png" alt="Cart" width="22" height="22" />
            <span 
              v-if="cartCount > 0" 
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
// استيراد المكتبات والمتاجر اللازمة
import { computed, onMounted, ref } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useWishlistStore } from '~/stores/wishlist';
import { storeToRefs } from 'pinia';

// متغيرات الحالة
const searchQuery = ref('');
const mobileMenuOpen = ref(false);
const categoryMenuOpen = ref(false);
const mobileSearchOpen = ref(false);

// استخدام متجر السلة
const cartStore = useCartStore();
const { cartCount } = storeToRefs(cartStore);

// استخدام متجر المفضلة
const wishlistStore = useWishlistStore();
const wishlistCount = computed(() => wishlistStore.wishlistItems.length);

// تعريف دالة البحث
const performSearch = () => {
  // التحقق من أن استعلام البحث ليس فارغًا
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    // إعادة توجيه المستخدم إلى صفحة البحث مع إضافة الاستعلام إلى الرابط
    window.location.href = `/search?q=${encodeURIComponent(searchQuery.value.trim())}`;
  } else {
    console.log('Empty search is not allowed');
  }
};

// تحميل بيانات المفضلة والسلة عند بدء تشغيل المكون
onMounted(() => {
  // التحقق من أننا في بيئة المتصفح
  if (process.client) {
    // تحميل بيانات المفضلة من localStorage
    wishlistStore.loadWishlist();
    
    // تحميل بيانات السلة إذا كانت متاحة
    if (typeof cartStore.loadCart === 'function') {
      cartStore.loadCart();
    }
  }
});
</script>

<style scoped>
/* ===== أنماط عامة ===== */
header {
  position: relative;
  height: auto;
  max-width: 1439px;
  margin: 0 auto;
  font-family: 'Dubai', sans-serif;
}

a:hover img {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

/* ===== أنماط الموبايل ===== */
.mobile-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 998;
}

.mobile-view {
  padding: 15px 0;
  position: relative;
  z-index: 999;
  flex-direction: row-reverse;
}

.mobile-menu-toggle {
  cursor: pointer;
  padding: 5px;
  order: 1;
}

.mobile-menu-icon {
  color: #000;
  transition: all 0.3s ease;
}

.mobile-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  order: 2;
  padding: 5px 0;
}

.mobile-logo img {
  max-width: 80px;
  height: auto;
}

.mobile-search-icon {
  cursor: pointer;
  padding: 5px;
  order: 3;
}

.mobile-menu {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 999;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
}

.mobile-menu-content {
  padding: 15px;
}

.mobile-menu-header {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 18px;
}

.mobile-menu-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-menu-item {
  padding: 10px 0;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease;
}

.mobile-menu-item:hover {
  color: #555;
}

.mobile-categories {
  margin: 10px 0;
}

.mobile-category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  font-weight: 500;
}

.mobile-category-header svg {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.mobile-category-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 5px 0 5px 15px;
}

.mobile-category-item {
  color: #555;
  text-decoration: none;
  padding: 5px 0;
  transition: all 0.3s ease;
}

.mobile-category-item:hover {
  color: #000;
}

.mobile-menu-icons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.mobile-menu-icon-item {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #333;
  text-decoration: none;
  position: relative;
}

.mobile-badge {
  background-color: #dc3545;
  color: white;
  font-size: 10px;
  border-radius: 50%;
  padding: 2px 6px;
  position: absolute;
  right: 0;
}

.mobile-search {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 999;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mobile-search-content {
  display: flex;
  align-items: center;
  background-color: #EEEEE4;
  border-radius: 4px;
  overflow: hidden;
}

.mobile-search-input {
  flex: 1;
  border: none;
  background-color: transparent;
  padding: 10px 15px;
  outline: none;
  font-size: 14px;
}

.mobile-search-btn {
  background-color: transparent;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}

.mobile-search-btn img {
  width: 16px;
  height: 16px;
}

/* ===== أنماط سطح المكتب ===== */
.desktop-view {
  height: 142px;
  position: relative;
}

/* أنماط الشعار */
.logo {
  left: 20px;
  top: 15px;
}

/* أنماط شريط التنقل العلوي */
.top-nav {
  right: 60px;
  top: 25px;
  gap: 20px;
}

.nav-link {
  position: relative;
  transition: all 0.3s ease;
  display: inline-block;
  padding: 2px 0;
  font-size: 16px;
  font-weight: 300;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: #000;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #555 !important;
}

.nav-link:hover::after {
  width: 100%;
}

/* أنماط زر تغيير اللغة */
.lang-switch {
  right: 8px;
  top: 27px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-switch:hover {
  color: #777;
}

/* أنماط الفئات */
.categories {
  left: 43%;
  transform: translateX(-50%);
  top: 92px;
  gap: 20px;
}

.category-link {
  position: relative;
  transition: all 0.3s ease;
  display: inline-block;
  font-size: 19px;
  font-weight: 500;
  text-transform: uppercase;
}

.category-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -3px;
  left: 50%;
  background-color: #000;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.category-link:hover {
  color: #555 !important;
  text-shadow: 0 0 0.5px #000, 0 0 0.5px #000;
}

.category-link:hover::after {
  width: 100%;
}

/* أنماط البحث */
.search-box {
  right: 150px;
  top: 85px;
  width: 270px;
}

.search-box .position-relative {
  background-color: #EEEEE4;
  height: 35px;
  border-radius: 0;
}

.search-input {
  background-color: transparent;
  padding-left: 10px;
  padding-right: 40px;
  font-size: 14px;
  outline: none;
}

.search-icon {
  right: 0;
  top: 0;
  height: 35px;
  width: 35px;
  cursor: pointer;
}

.search-icon img {
  width: 16px;
  height: 16px;
}

/* أنماط الأيقونات */
.icons {
  right: 8px;
  top: 88px;
  width: 120px;
  justify-content: space-between;
}

.badge {
  font-size: 0.6rem;
  transform: translate(-50%, -50%);
}

/* ===== تعديلات الاستجابة ===== */
@media (max-width: 767.98px) {
  header {
    height: auto;
  }
}
</style>
