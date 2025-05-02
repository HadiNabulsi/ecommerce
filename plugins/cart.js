import { useCartStore } from '~/stores/cart';

export default defineNuxtPlugin(({ $pinia }) => {
  // Solo ejecutar en el lado del cliente
  if (process.client) {
    // Cargar el carrito inmediatamente
    const cartStore = useCartStore();
    cartStore.loadCart();
    
    // También escuchar eventos de almacenamiento para sincronizar entre pestañas
    window.addEventListener('storage', (event) => {
      if (event.key === 'cart') {
        cartStore.loadCart();
      }
    });
  }
});
