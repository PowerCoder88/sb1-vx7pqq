import React, { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { utils, write } from 'xlsx';
import type { Product } from '../../types/inventory';
import type { ReportFilters } from '../../types/report';

interface ReportGeneratorProps {
  products: Product[];
}

export function ReportGenerator({ products }: ReportGeneratorProps) {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: '',
    endDate: '',
    stockStatus: 'all',
  });

  const generateReport = () => {
    let filteredProducts = [...products];

    if (filters.stockStatus === 'low') {
      filteredProducts = filteredProducts.filter(p => p.quantity <= p.reorderPoint);
    } else if (filters.stockStatus === 'out') {
      filteredProducts = filteredProducts.filter(p => p.quantity === 0);
    }

    const worksheet = utils.json_to_sheet(
      filteredProducts.map(p => ({
        Name: p.name,
        SKU: p.sku,
        Category: p.category,
        Quantity: p.quantity,
        Price: p.price,
        'Total Value': p.price * p.quantity,
        'Reorder Point': p.reorderPoint,
        'Last Updated': new Date(p.updatedAt).toLocaleDateString(),
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Inventory Report');

    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Report</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Status</label>
          <select
            value={filters.stockStatus}
            onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value as ReportFilters['stockStatus'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Items</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={generateReport}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Generate Excel Report
        </button>
      </div>
    </div>
  );
}