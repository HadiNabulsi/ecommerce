import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getUserOrders: (state) => {
      return state.orders;
    },
    
    getOrderById: (state) => (id) => {
      return state.orders.find(order => order.id === id);
    },
    
    getCurrentOrder: (state) => {
      return state.currentOrder;
    }
  },
  
  actions: {
    async fetchUserOrders() {
      this.loading = true;
      this.error = null;
      
      try {
        // جلب الطلبات من API
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.orders = data;
        
        this.loading = false;
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.error = 'An error occurred while fetching orders. Please try again.';
        this.loading = false;
      }
    },
    
    async fetchOrderById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // التحقق مما إذا كان الطلب موجودًا بالفعل في الحالة
        const existingOrder = this.getOrderById(id);
        if (existingOrder) {
          this.currentOrder = existingOrder;
          this.loading = false;
          return existingOrder;
        }
        
        // جلب الطلب من API
        const response = await fetch(`/api/orders/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const order = await response.json();
        
        // إضافة الطلب إلى قائمة الطلبات إذا لم يكن موجودًا بالفعل
        if (!this.getOrderById(order.id)) {
          this.orders.push(order);
        }
        
        this.currentOrder = order;
        this.loading = false;
        return order;
      } catch (error) {
        console.error('Error fetching order:', error);
        this.error = 'An error occurred while fetching the order. Please try again.';
        this.loading = false;
        return null;
      }
    },
    
    async createOrder(orderData) {
      this.loading = true;
      this.error = null;
      
      try {
        // إرسال بيانات الطلب إلى API
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // الحصول على الطلب الجديد من الاستجابة
        const newOrder = await response.json();
        
        // إضافة الطلب الجديد إلى قائمة الطلبات
        this.orders.unshift(newOrder);
        this.currentOrder = newOrder;
        
        this.loading = false;
        return newOrder;
      } catch (error) {
        console.error('Error creating order:', error);
        this.error = 'An error occurred while creating the order. Please try again.';
        this.loading = false;
        return null;
      }
    },
    
    async cancelOrder(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // إرسال طلب إلغاء إلى API
        const response = await fetch(`/api/orders/${id}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found');
          } else if (response.status === 400) {
            throw new Error('This order cannot be cancelled');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // الحصول على الطلب المحدث من الاستجابة
        const updatedOrder = await response.json();
        
        // تحديث الطلب في الحالة المحلية
        const orderIndex = this.orders.findIndex(order => order.id === id);
        if (orderIndex !== -1) {
          this.orders[orderIndex] = updatedOrder;
        }
        
        // تحديث الطلب الحالي إذا كان هو نفس الطلب الملغى
        if (this.currentOrder && this.currentOrder.id === id) {
          this.currentOrder = updatedOrder;
        }
        
        this.loading = false;
        return updatedOrder;
      } catch (error) {
        console.error('Error cancelling order:', error);
        this.error = 'An error occurred while cancelling the order. Please try again.';
        this.loading = false;
        return null;
      }
    },
    
    clearCurrentOrder() {
      this.currentOrder = null;
    }
  },
  
  persist: {
    storage: localStorage,
    paths: ['orders', 'currentOrder']
  }
});
