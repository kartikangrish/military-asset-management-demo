"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// API base URL - should match the one in api.ts
const API_BASE_URL = 'https://backend-production-0dc3.up.railway.app';

interface DashboardMetrics {
  openingBalance: number;
  closingBalance: number;
  netMovement: {
    total: number;
    purchases: number;
    transfersIn: number;
    transfersOut: number;
  };
  assigned: number;
  expended: number;
}

interface Asset {
  id: number;
  type: string;
}

interface Base {
  id: number;
  name: string;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMovementDetails, setShowMovementDetails] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [bases, setBases] = useState<Base[]>([]);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    baseId: '',
    assetType: ''
  });

  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch dashboard metrics
        const metricsResponse = await fetch(
          `${API_BASE_URL}/api/dashboard/metrics?${new URLSearchParams({
            ...filters,
            baseId: filters.baseId || (user?.baseId?.toString() || ''),
          })}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // Fetch assets for filter
        const assetsResponse = await fetch(`${API_BASE_URL}/api/assets`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Fetch bases for filter (if admin or logistics officer)
        const basesResponse = await fetch(`${API_BASE_URL}/api/bases`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!metricsResponse.ok || !assetsResponse.ok || !basesResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [metricsData, assetsData, basesData] = await Promise.all([
          metricsResponse.json(),
          assetsResponse.json(),
          basesResponse.json()
        ]);

        setMetrics(metricsData);
        setAssets(assetsData);
        setBases(basesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router, filters, user?.baseId]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => router.push('/assets')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Manage Assets
        </button>
        <button
          onClick={() => router.push('/purchases')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Purchase Assets
        </button>
        <button
          onClick={() => router.push('/transfers')}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Transfer Assets
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {(user?.role === 'Admin' || user?.role === 'Logistics Officer') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Base</label>
              <select
                name="baseId"
                value={filters.baseId}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Bases</option>
                {bases.map(base => (
                  <option key={base.id} value={base.id}>{base.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Type</label>
            <select
              name="assetType"
              value={filters.assetType}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.type}>{asset.type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Opening Balance</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{metrics?.openingBalance || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Closing Balance</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{metrics?.closingBalance || 0}</p>
        </div>

        <div 
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50"
          onClick={() => setShowMovementDetails(!showMovementDetails)}
        >
          <h3 className="text-lg font-medium text-gray-900">Net Movement</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{metrics?.netMovement.total || 0}</p>
          {showMovementDetails && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Purchases</span>
                <span className="text-sm font-medium text-green-600">+{metrics?.netMovement.purchases || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Transfers In</span>
                <span className="text-sm font-medium text-green-600">+{metrics?.netMovement.transfersIn || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Transfers Out</span>
                <span className="text-sm font-medium text-red-600">-{metrics?.netMovement.transfersOut || 0}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Assigned Assets</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{metrics?.assigned || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Expended Assets</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{metrics?.expended || 0}</p>
        </div>
      </div>
    </div>
  );
} 