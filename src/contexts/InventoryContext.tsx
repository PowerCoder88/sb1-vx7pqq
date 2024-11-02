import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types/inventory';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteProduct: (id: string) => void;
  bulkAddProducts: (products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('inventory', []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, ...product, updatedAt: new Date().toISOString() }
        : p
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const bulkAddProducts = (newProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const timestamp = new Date().toISOString();
    const productsWithIds = newProducts.map(product => ({
      ...product,
      id: crypto.randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    }));
    setProducts([...products, ...productsWithIds]);
  };

  return (
    <InventoryContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, bulkAddProducts }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}