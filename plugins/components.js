// تسجيل المكونات العامة
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // إضافة وظائف مساعدة بسيطة
  nuxtApp.provide('ui', {
    // اختصار النص
    truncateText: (text, length = 50) => {
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    }
  });
});
