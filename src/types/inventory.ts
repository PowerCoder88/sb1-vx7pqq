export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  reorderPoint: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  lowStockItems: number;
  totalValue: number;
  categoryCounts: Record<string, number>;
}