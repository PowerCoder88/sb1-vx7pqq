import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { utils, read } from 'xlsx';
import type { Product } from '../../types/inventory';

interface BulkUploadProps {
  onUpload: (products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

interface ValidationError {
  row: number;
  errors: string[];
}

export function BulkUpload({ onUpload }: BulkUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateRow = (row: any, index: number): ValidationError | null => {
    const errors: string[] = [];

    if (!row.name) errors.push('Name is required');
    if (!row.sku) errors.push('SKU is required');
    if (isNaN(row.quantity) || row.quantity < 0) errors.push('Invalid quantity');
    if (isNaN(row.price) || row.price < 0) errors.push('Invalid price');
    if (!row.category) errors.push('Category is required');
    if (isNaN(row.reorderPoint) || row.reorderPoint < 0) errors.push('Invalid reorder point');

    return errors.length > 0 ? { row: index + 2, errors } : null;
  };

  const processFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = utils.sheet_to_json(worksheet);

      const validationErrors: ValidationError[] = [];
      const validProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [];

      rows.forEach((row: any, index) => {
        const error = validateRow(row, index);
        if (error) {
          validationErrors.push(error);
        } else {
          validProducts.push({
            name: row.name,
            sku: row.sku,
            quantity: Number(row.quantity),
            price: Number(row.price),
            category: row.category,
            reorderPoint: Number(row.reorderPoint),
          });
        }
      });

      setErrors(validationErrors);
      
      if (validationErrors.length === 0) {
        onUpload(validProducts);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      setErrors([{ row: 0, errors: ['Invalid file format'] }]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop your Excel file here, or click to select
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
      </div>

      {success && (
        <div className="flex items-center text-green-700 bg-green-50 p-4 rounded-md">
          <CheckCircle className="w-5 h-5 mr-2" />
          Products uploaded successfully
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Validation Errors</h3>
          </div>
          <ul className="list-disc list-inside text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>
                Row {error.row}: {error.errors.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}