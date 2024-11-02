import React, { useState, useEffect } from 'react';
import { BarChart3, Package, AlertTriangle, DollarSign } from 'lucide-react';
import { useInventory } from '../contexts/InventoryContext';

interface Metrics {
  totalProducts: number;
  lowStockItems: number;
  totalValue: number;
  outOfStock: number;
}

export function Dashboard() {
  const { products } = useInventory();
  const [metrics, setMetrics] = useState<Metrics>({
    totalProducts: 0,
    lowStockItems: 0,
    totalValue: 0,
    outOfStock: 0
  });

  useEffect(() => {
    if (products) {
      const newMetrics = {
        totalProducts: products.length,
        lowStockItems: products.filter(p => p.quantity > 0 && p.quantity <= 10).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
        outOfStock: products.filter(p => p.quantity === 0).length
      };
      setMetrics(newMetrics);
    }
  }, [products]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-bold">{metrics.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold">{metrics.lowStockItems}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Value</p>
              <p className="text-2xl font-bold">${metrics.totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold">{metrics.outOfStock}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {products && products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{product.quantity} units</p>
                <p className="text-sm text-gray-500">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;