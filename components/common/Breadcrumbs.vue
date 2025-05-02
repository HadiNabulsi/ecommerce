<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <NuxtLink to="/">Home</NuxtLink>
      </li>
      <li v-for="(crumb, index) in breadcrumbs" :key="index" 
          :class="['breadcrumb-item', { 'active': index === breadcrumbs.length - 1 }]"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : null">
        <NuxtLink v-if="index < breadcrumbs.length - 1" :to="crumb.path">
          {{ crumb.name }}
        </NuxtLink>
        <span v-else>{{ crumb.name }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  breadcrumbs: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 1.5rem;
}

.breadcrumb-item a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-item a:hover {
  color: #000;
}

.breadcrumb-item.active {
  color: #000;
  font-weight: 500;
}
</style>
