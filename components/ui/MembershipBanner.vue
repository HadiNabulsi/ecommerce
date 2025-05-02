<template>
  <section class="membership-banner">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-md-8 text-center text-md-start">
          <h2 class="mb-md-0">BECOME A MEMBER & GET 15% OFF</h2>
        </div>
        <div class="col-md-4 text-center mt-3 mt-md-0">
          <div class="membership-button">
            <NuxtLink to="/signup" class="btn-link position-relative d-inline-block">
              <img src="/Icons/Bottun.png" alt="Sign Up" class="sign-up-btn-img" />
              <span class="btn-overlay-text position-absolute top-50 translate-middle-y text-white">
                SIGN UP FOR FREE
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.membership-banner {
  background-color: #f0e241;
  padding: 90px 0;
  margin: -50px 0px 1px 0px;
}

h2 {
  font-weight: bold;
  margin-left: 250px;
  color: #000;
  font-size: 2.5rem;
  letter-spacing: 1px;
}

.btn-link {
  text-decoration: none;
  display: inline-block;
  transform: translateX(-60px); /* إزاحة الزر نحو اليسار */
}

.sign-up-btn-img {
  width: 300px;
  height: 70px;
  object-fit: fill;
  transition: opacity 0.3s ease;
}

.sign-up-btn-img:hover {
  opacity: 0.9;
}

.btn-overlay-text {
  left: 6%;
  bottom: 6%;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  pointer-events: none; /* يسمح بالضغط على الزر من خلال النص */
  white-space: nowrap;
}

.membership-button {
  text-align: center;
  margin-right: 0;
  transform: translateX(-80px); /* إزاحة العنصر الحاوي للزر نحو اليسار */
}

@media (max-width: 768px) {
  .membership-banner {
    padding: 20px 0;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  .sign-up-btn-img {
    width: 150px;
    height: 45px;
    object-fit: contain; /* عرض الصورة كاملة بدون اقتصاص */
  }
  
  .btn-overlay-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  h2 {
    font-size: 1.2rem;
  }
}
</style>
