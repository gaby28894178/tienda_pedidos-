import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

export interface CustomerData {
  email: string;
  phone: string;
  address: string;
  name: string;
}

export interface Order {
  id: string;
  customerData: CustomerData;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

interface OrderState {
  orders: Order[];
  currentOrder: Partial<Order> | null;
  createOrder: (customerData: CustomerData, items: CartItem[], totalAmount: number) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  setCurrentOrder: (order: Partial<Order> | null) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      
      createOrder: (customerData, items, totalAmount) => {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newOrder: Order = {
          id: orderId,
          customerData,
          items,
          totalAmount,
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        
        set({
          orders: [...get().orders, newOrder],
          currentOrder: newOrder,
        });
        
        return newOrder;
      },
      
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          ),
        });
      },
      
      getOrderById: (orderId) => {
        return get().orders.find(order => order.id === orderId);
      },
      
      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },
      
      clearOrders: () => set({ orders: [], currentOrder: null }),
    }),
    {
      name: 'order-storage',
    }
  )
);