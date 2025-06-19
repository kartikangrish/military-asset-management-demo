"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchases, assets, bases } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Purchase {
  id: number;
  assetId: number;
  baseId: number;
  quantity: number;
  date: string;
  asset: {
    type: string;
    serial: string;
    description?: string;
  };
  base: {
    name: string;
    location: string;
  };
}

interface Asset {
  id: number;
  type: string;
  serial: string;
  description?: string;
}

interface Base {
  id: number;
  name: string;
  location: string;
}

export default function PurchasesPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    baseId: '',
    quantity: ''
  });

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: purchasesList, isLoading: purchasesLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: purchases.getAll
  });

  const { data: assetsList, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: assets.getAll
  });

  const { data: basesList, isLoading: basesLoading } = useQuery({
    queryKey: ['bases'],
    queryFn: bases.getAll
  });

  const createPurchaseMutation = useMutation({
    mutationFn: purchases.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      setShowForm(false);
      setFormData({ assetId: '', baseId: '', quantity: '' });
    }
  });

  const handleCreatePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    createPurchaseMutation.mutate({
      assetId: parseInt(formData.assetId),
      baseId: parseInt(formData.baseId),
      quantity: parseInt(formData.quantity)
    });
  };

  if (purchasesLoading || assetsLoading || basesLoading) {
    return (
      <ProtectedRoute allowedRoles={['Admin', 'Logistics Officer']}>
        <div className="flex justify-center items-center min-h-screen">Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Logistics Officer']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Asset Purchases</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {showForm ? 'Cancel' : 'Create Purchase'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Create New Purchase</h2>
            <form onSubmit={handleCreatePurchase} className="space-y-4">
              <div>
                <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">
                  Asset
                </label>
                <select
                  id="assetId"
                  value={formData.assetId}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select an asset</option>
                  {assetsList?.map((asset: Asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.type} - {asset.serial}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="baseId" className="block text-sm font-medium text-gray-700">
                  Base
                </label>
                <select
                  id="baseId"
                  value={formData.baseId}
                  onChange={(e) => setFormData({ ...formData, baseId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a base</option>
                  {basesList?.map((base: Base) => (
                    <option key={base.id} value={base.id}>
                      {base.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min="1"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchasesList?.map((purchase: Purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.asset.type} - {purchase.asset.serial}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.base.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
} 