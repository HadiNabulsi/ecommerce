<template>
  <div>
    <nuxt-layout>
      <NuxtPage />
    </nuxt-layout>
    <Analytics />
  </div>
</template>

<script>
import { Analytics } from '@vercel/analytics/nuxt'
</script>