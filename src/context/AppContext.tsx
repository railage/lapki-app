"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessConfig, OrderItem, INITIAL_BUSINESS_CONFIG } from '../types';

interface AppContextType {
  config: BusinessConfig;
  updateConfig: (newConfig: Partial<BusinessConfig>) => void;
  orders: OrderItem[];
  addOrder: (order: Omit<OrderItem, 'id' | 'createdAt' | 'status'>) => OrderItem;
  updateOrderStatus: (id: string, status: OrderItem['status']) => void;
  deleteOrder: (id: string) => void;
  resetToDefaults: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = 'lapki_config_v1';
const ORDERS_STORAGE_KEY = 'lapki_orders_v1';
const THEME_STORAGE_KEY = 'lapki_theme_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<BusinessConfig>(INITIAL_BUSINESS_CONFIG);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Загрузка данных из LocalStorage при запуске
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }

      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        const demoOrders: OrderItem[] = [
          {
            id: 'ord_1',
            petType: 'dog_small',
            petName: 'Арчи',
            breed: 'Йоркширский терьер',
            serviceType: 'walk',
            durationOrDays: 1,
            addons: ['paw_wash', 'photo_report'],
            totalPrice: 700,
            notes: 'Очень ласковый, но боится резких звуков',
            clientName: 'Анна Смирнова',
            clientPhone: '+7 (916) 555-01-23',
            clientAddress: 'ул. Тверская 12, кв 45',
            date: '2026-11-09',
            timeSlot: '10:00 - 11:00',
            status: 'new',
            createdAt: '2026-11-08T18:00:00.000Z',
          },
          {
            id: 'ord_2',
            petType: 'dog_medium',
            petName: 'Майло',
            breed: 'Джек Рассел',
            serviceType: 'sitting',
            durationOrDays: 3,
            addons: ['photo_report', 'training'],
            totalPrice: 3900,
            notes: 'Гулять 2 раза в день, кормить сухим кормом в 09:00 и 20:00',
            clientName: 'Михаил Ковалев',
            clientPhone: '+7 (925) 444-12-89',
            clientAddress: 'пр-т Мира 84, кв 12',
            date: '2026-11-12',
            timeSlot: 'с 09:00',
            status: 'confirmed',
            createdAt: '2026-11-08T14:00:00.000Z',
          },
        ];
        setOrders(demoOrders);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(demoOrders));
      }

      // Проверка темы
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error('Ошибка загрузки данных:', e);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const updateConfig = (newConfig: Partial<BusinessConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addOrder = (orderData: Omit<OrderItem, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: OrderItem = {
      ...orderData,
      id: 'ord_' + Math.random().toString(36).substring(2, 8),
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderItem['status']) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => (ord.id === id ? { ...ord, status } : ord));
      if (typeof window !== 'undefined') {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => {
      const updated = prev.filter((ord) => ord.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetToDefaults = () => {
    setConfig(INITIAL_BUSINESS_CONFIG);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(INITIAL_BUSINESS_CONFIG));
    }
  };

  return (
    <AppContext.Provider
      value={{
        config,
        updateConfig,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        resetToDefaults,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
