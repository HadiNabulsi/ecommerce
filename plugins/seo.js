// plugins/seo.js
export default defineNuxtPlugin((nuxtApp) => {
  // تكوين العلامات الوصفية الافتراضية
  const defaultMeta = {
    title: 'Comprehensive E-Commerce Store',
    description: 'A complete e-commerce store offering a wide range of products at competitive prices and high quality',
    keywords: 'e-commerce, shopping, products, fashion, electronics, jewelry',
    author: 'E-Commerce Team',
    ogImage: '/Images/og-image.jpg',
    twitterImage: '/Images/twitter-image.jpg',
  };

  // توفير وظيفة لتحديث العلامات الوصفية
  const updateMeta = (meta = {}) => {
    const title = meta.title || defaultMeta.title;
    const description = meta.description || defaultMeta.description;
    const image = meta.image || defaultMeta.ogImage;
    
    // استخدام useHead من Nuxt 3
    useState('title').value = title;
    
    // تعيين العلامات الوصفية
    const head = {
      title: title,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: meta.keywords || defaultMeta.keywords },
        { name: 'author', content: defaultMeta.author },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      link: []
    };
    
    if (meta.canonical) {
      head.link.push({ rel: 'canonical', href: meta.canonical });
    }
    
    return head;
  };

  // إضافة وظيفة تحديث العلامات الوصفية إلى السياق العام
  return {
    provide: {
      seo: {
        updateMeta
      }
    }
  };
});
