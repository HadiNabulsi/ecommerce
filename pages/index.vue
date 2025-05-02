<template>
  <div>
    <HeroBanner />
    <JewelrySection />
    <SpecialOffers />
    <FashionAdBanner />
    <NewArrivals />
    <MembershipBanner />
  </div>
</template>

<script setup>
import HeroBanner from '~/components/ui/HeroBanner.vue';
import JewelrySection from '~/components/ui/JewelrySection.vue';
import SpecialOffers from '~/components/ui/SpecialOffers.vue';
import FashionAdBanner from '~/components/ui/FashionAdBanner.vue';
import NewArrivals from '~/components/ui/NewArrivals.vue';
import MembershipBanner from '~/components/ui/MembershipBanner.vue';

// Set page metadata
useHead({
  title: 'Developer Test - Home',
  meta: [
    { name: 'description', content: 'Welcome to Developer Test e-commerce store. Shop the latest products with great deals.' }
  ]
});
</script>
