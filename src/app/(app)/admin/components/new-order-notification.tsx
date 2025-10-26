"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BellRing } from 'lucide-react';

export function NewOrderNotification() {
  const { toast } = useToast();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'new_order_notification' && event.newValue) {
        try {
          const notification = JSON.parse(event.newValue);
          const timeSince = Date.now() - notification.timestamp;

          // Only show notification if it's recent (e.g., within last 10 seconds)
          if (timeSince < 10000) {
            toast({
              title: (
                <div className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  <span>New Order Received</span>
                </div>
              ),
              description: `Order #${notification.orderId.split('_')[1]} was just placed by ${notification.agentName}.`,
            });
          }
        } catch (error) {
          console.error("Failed to parse notification from storage", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [toast]);

  return null; // This component doesn't render anything itself
}
