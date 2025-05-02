<template>
  <section class="jewelry-section">
    <div class="container-fluid px-0">
      <div class="row g-0">
        <div class="col-12">
          <!-- الشريط الأحمر في الأعلى -->
          <div class="red-top-border"></div>
          
          <div class="position-relative overflow-hidden banner-container">
            <!-- خلفية المجوهرات -->
            <div class="jewelry-bg w-100">
              <!-- زر عرض المزيد -->
              <div class="jewelry-button position-absolute">
                <NuxtLink to="/category/jewelery" class="btn-link position-relative d-inline-block">
                  <img src="/public/Icons/BottunWhite.png" alt="See More" class="see-more-btn-img img-fluid" />
                  <span class="btn-overlay-text position-absolute top-50 translate-middle-y text-black">
                    SEE MORE
                  </span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* القسم الرئيسي */
.jewelry-section {
  position: relative;
  background-color: #000;
  z-index: 1;
  width: 100%;
}

/* الشريط الأحمر */
.red-top-border {
  height: 3px;
  width: 100%;
  background: linear-gradient(to right, transparent, #d10000);
  position: relative;
  z-index: 10;
}

/* حاوية البانر */
.banner-container {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: hidden;
}

/* خلفية المجوهرات */
.jewelry-bg {
  background-image: url('/Images/Jewelry.jpg');
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #000;
  height: clamp(300px, 50vw, 600px);
  position: relative;
  z-index: 1;
  width: 100%;
}

/* حاوية المجوهرات */
.jewelry-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}

/* صورة المجوهرات */
.jewelry {
  max-width: 500px;
  width: 80%;
  height: auto;
}

/* رابط الزر */
.btn-link {
  text-decoration: none;
  display: inline-block;
}

/* صورة الزر */
.see-more-btn-img {
  width: auto;
  height: auto;
  max-width: clamp(100px, 15vw, 180px);
  transition: opacity 0.3s ease;
}

.see-more-btn-img:hover {
  opacity: 0.9;
}

/* نص الزر */
.btn-overlay-text {
  left: 15%;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
  pointer-events: none;
  white-space: nowrap;
}

/* موضع الزر */
.jewelry-button {
  position: absolute;
  display: inline-block;
  background-color: transparent;
  padding: 0;
  border: none;
  bottom: clamp(20px, 5vw, 50px);
  left: clamp(20px, 5vw, 50px);
  z-index: 3;
  margin-left: 8px;
}

/* استعلامات الوسائط للشاشات المختلفة */
/* الشاشات الكبيرة (أقل من 1200px) */
@media (max-width: 1199.98px) {
  .jewelry-bg {
    height: 550px;
    background-size: 75% auto;
  }
}

/* الشاشات المتوسطة (أقل من 992px) */
@media (max-width: 991.98px) {
  .jewelry-bg {
    height: 500px;
    background-size: 70% auto;
  }
  
  .jewelry {
    max-width: 400px;
  }
}

/* الأجهزة اللوحية (أقل من 768px) */
@media (max-width: 767.98px) {
  .jewelry-bg {
    height: 400px;
    background-size: 65% auto;
  }
  
  .jewelry {
    max-width: 350px;
  }
  
  .see-more-btn-img {
    max-width: 120px;
  }
  
  .btn-overlay-text {
    font-size: 0.7rem;
  }
  
  .jewelry-button {
    bottom: 30px;
    left: 30px;
  }
}

/* الهواتف الذكية (أقل من 576px) */
@media (max-width: 575.98px) {
  .jewelry-bg {
    height: 300px;
    background-size: 150% auto;
  }
  
  .jewelry {
    max-width: 200px;
  }
  
  .see-more-btn-img {
    max-width: 100px;
  }
  
  .btn-overlay-text {
    font-size: 0.6rem;
  }
  
  .jewelry-button {
    bottom: 20px;
    left: 20px;
  }
}

/* الهواتف الصغيرة (أقل من 375px) */
@media (max-width: 374.98px) {
  .jewelry-bg {
    height: 250px;
    background-size: 50% auto;
  }
  
  .see-more-btn-img {
    max-width: 80px;
  }
  
  .btn-overlay-text {
    font-size: 0.5rem;
  }
  
  .jewelry-button {
    bottom: 15px;
    left: 15px;
  }
}
</style>