<template>
  <section class="fashion-ad-banner">
    <div class="container-fluid p-0">
      <div class="fashion-banner position-relative">
        <img src="/Images/Untitled-1.jpg" alt="Fashion Collection" class="img-fluid w-100" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.fashion-banner {
  width: 100%;
}

.fashion-banner img {
  transition: transform 0.5s ease;
  width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 100%;
}

.fashion-banner:hover img {
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .fashion-banner img {
    max-height: 100%;
  }
}

@media (max-width: 576px) {
  .fashion-banner img {
    max-height: 100%;
  }
}
</style>
