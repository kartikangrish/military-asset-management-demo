'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transfers, assets, bases } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TransfersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    assetId: '',
    fromBaseId: '',
    toBaseId: '',
    quantity: '',
  });

  const { data: transfersList, isLoading: transfersLoading } = useQuery({
    queryKey: ['transfers'],
    queryFn: transfers.getAll,
  });

  const { data: assetsList, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: assets.getAll,
  });

  const { data: basesList, isLoading: basesLoading } = useQuery({
    queryKey: ['bases'],
    queryFn: bases.getAll,
  });

  const createTransferMutation = useMutation({
    mutationFn: transfers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      setIsModalOpen(false);
      setFormData({ assetId: '', fromBaseId: '', toBaseId: '', quantity: '' });
      setError(null);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to create transfer');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fromBaseId === formData.toBaseId) {
      setError('Source and destination bases must be different');
      return;
    }
    createTransferMutation.mutate({
      ...formData,
      assetId: parseInt(formData.assetId),
      fromBaseId: parseInt(formData.fromBaseId),
      toBaseId: parseInt(formData.toBaseId),
      quantity: parseInt(formData.quantity),
    });
  };

  if (transfersLoading) {
    return (
      <ProtectedRoute>
        <div>Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Transfers</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all asset transfers in the system
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Create Transfer
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To Base
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
              {transfersList?.map((transfer: any) => (
                <tr key={transfer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transfer.asset.type} ({transfer.asset.serial})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.fromBase.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.toBase.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transfer.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-medium mb-4">Create Transfer</h2>
              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="assetId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Asset
                  </label>
                  <select
                    id="assetId"
                    required
                    value={formData.assetId}
                    onChange={(e) =>
                      setFormData({ ...formData, assetId: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select an asset</option>
                    {assetsList?.map((asset: any) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.type} ({asset.serial})
                      </option>
                    ))}
                  </select>
                  {assetsLoading && <p className="mt-1 text-sm text-gray-500">Loading assets...</p>}
                </div>
                <div>
                  <label
                    htmlFor="fromBaseId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    From Base
                  </label>
                  <select
                    id="fromBaseId"
                    required
                    value={formData.fromBaseId}
                    onChange={(e) =>
                      setFormData({ ...formData, fromBaseId: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select source base</option>
                    {basesList?.map((base: any) => (
                      <option key={base.id} value={base.id}>
                        {base.name}
                      </option>
                    ))}
                  </select>
                  {basesLoading && <p className="mt-1 text-sm text-gray-500">Loading bases...</p>}
                </div>
                <div>
                  <label
                    htmlFor="toBaseId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    To Base
                  </label>
                  <select
                    id="toBaseId"
                    required
                    value={formData.toBaseId}
                    onChange={(e) =>
                      setFormData({ ...formData, toBaseId: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select destination base</option>
                    {basesList?.map((base: any) => (
                      <option 
                        key={base.id} 
                        value={base.id}
                        disabled={base.id === parseInt(formData.fromBaseId)}
                      >
                        {base.name}
                      </option>
                    ))}
                  </select>
                  {basesLoading && <p className="mt-1 text-sm text-gray-500">Loading bases...</p>}
                </div>
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setError(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTransferMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {createTransferMutation.isPending ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 