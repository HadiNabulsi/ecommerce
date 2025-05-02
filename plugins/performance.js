// تكوين تحسين الأداء
export default defineNuxtPlugin((nuxtApp) => {
  // تحسين تحميل الصور
  const optimizeImages = () => {
    if (process.client) {
      // استخدام Intersection Observer لتحميل الصور بشكل كسول
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
      } else {
        // التحميل العادي للمتصفحات التي لا تدعم Intersection Observer
        lazyImages.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        });
      }
    }
  };
  
  // تحسين الأداء العام
  const optimizePerformance = () => {
    if (process.client) {
      // تأجيل تحميل الأكواد غير الهامة
      setTimeout(() => {
        // تحميل الأكواد غير الضرورية بعد تحميل الصفحة
        const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
        nonCriticalScripts.forEach(script => {
          const newScript = document.createElement('script');
          Array.from(script.attributes).forEach(attr => {
            if (attr.name !== 'data-defer') {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          newScript.innerHTML = script.innerHTML;
          script.parentNode.replaceChild(newScript, script);
        });
      }, 1000);
    }
  };
  
  // تنفيذ تحسينات الأداء بعد تحميل الصفحة
  if (process.client) {
    nuxtApp.hook('app:mounted', () => {
      optimizeImages();
      optimizePerformance();
    });
  }
  
  // توفير وظائف تحسين الأداء للاستخدام في المكونات
  return {
    provide: {
      performance: {
        optimizeImages,
        optimizePerformance
      }
    }
  };
});
