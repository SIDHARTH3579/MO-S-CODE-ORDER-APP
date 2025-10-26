
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus } from '@/types';
import { useToast } from './use-toast';

const ORDERS_STORAGE_KEY = 'orderflow_orders';

// Function to get initial orders from localStorage
const getInitialOrders = (): Order[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    return storedOrders ? JSON.parse(storedOrders) : [];
  } catch (error) {
    console.error("Failed to parse orders from localStorage", error);
    return [];
  }
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders to localStorage", error);
    }
  }, [orders]);
  
  const addOrder = useCallback((newOrder: Order) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    toast({
      title: "Order Submitted!",
      description: `Your order #${newOrder.id.split('_')[1]} has been placed.`,
    });
  }, [toast]);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }, []);
  
  const clearOrders = useCallback(() => {
    setOrders([]);
  }, []);


  return { orders, addOrder, updateOrderStatus, clearOrders };
}
