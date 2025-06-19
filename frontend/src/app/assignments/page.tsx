"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignments, expenditures, assets, users } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Assignment {
  id: number;
  assetId: number;
  baseId: number;
  personnelId: number;
  quantity: number;
  date: string;
  asset: {
    type: string;
    serial: string;
  };
  personnel: {
    name: string;
    email: string;
  };
}

interface Expenditure {
  id: number;
  assetId: number;
  baseId: number;
  personnelId: number;
  quantity: number;
  date: string;
  asset: {
    type: string;
    serial: string;
  };
  personnel: {
    name: string;
    email: string;
  };
}

interface Asset {
  id: number;
  type: string;
  serial: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function AssignmentsPage() {
  const queryClient = useQueryClient();
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showExpenditureForm, setShowExpenditureForm] = useState(false);
  const [assignmentFormData, setAssignmentFormData] = useState({
    assetId: '',
    personnelId: '',
    quantity: ''
  });
  const [expenditureFormData, setExpenditureFormData] = useState({
    assetId: '',
    personnelId: '',
    quantity: ''
  });

  const { user } = useAuth();

  const { data: assignmentsList, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: assignments.getAll
  });

  const { data: expendituresList, isLoading: expendituresLoading } = useQuery({
    queryKey: ['expenditures'],
    queryFn: expenditures.getAll
  });

  const { data: assetsList, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: assets.getAll
  });

  const { data: personnelList, isLoading: personnelLoading } = useQuery({
    queryKey: ['users'],
    queryFn: users.getAll
  });

  const createAssignmentMutation = useMutation({
    mutationFn: assignments.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setShowAssignmentForm(false);
      setAssignmentFormData({ assetId: '', personnelId: '', quantity: '' });
    }
  });

  const createExpenditureMutation = useMutation({
    mutationFn: expenditures.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenditures'] });
      setShowExpenditureForm(false);
      setExpenditureFormData({ assetId: '', personnelId: '', quantity: '' });
    }
  });

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    createAssignmentMutation.mutate({
      assetId: parseInt(assignmentFormData.assetId),
      personnelId: parseInt(assignmentFormData.personnelId),
      quantity: parseInt(assignmentFormData.quantity)
    });
  };

  const handleCreateExpenditure = async (e: React.FormEvent) => {
    e.preventDefault();
    createExpenditureMutation.mutate({
      assetId: parseInt(expenditureFormData.assetId),
      personnelId: parseInt(expenditureFormData.personnelId),
      quantity: parseInt(expenditureFormData.quantity)
    });
  };

  if (assignmentsLoading || expendituresLoading || assetsLoading || personnelLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Asset Assignments</h2>
            <button
              onClick={() => setShowAssignmentForm(!showAssignmentForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {showAssignmentForm ? 'Cancel' : 'Create Assignment'}
            </button>
          </div>

          {showAssignmentForm && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Create New Assignment</h3>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">
                    Asset
                  </label>
                  <select
                    id="assetId"
                    value={assignmentFormData.assetId}
                    onChange={(e) => setAssignmentFormData({ ...assignmentFormData, assetId: e.target.value })}
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
                  <label htmlFor="personnelId" className="block text-sm font-medium text-gray-700">
                    Personnel
                  </label>
                  <select
                    id="personnelId"
                    value={assignmentFormData.personnelId}
                    onChange={(e) => setAssignmentFormData({ ...assignmentFormData, personnelId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select personnel</option>
                    {personnelList?.map((person: User) => (
                      <option key={person.id} value={person.id}>
                        {person.name} ({person.email})
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
                    value={assignmentFormData.quantity}
                    onChange={(e) => setAssignmentFormData({ ...assignmentFormData, quantity: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    min="1"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAssignmentForm(false)}
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
                    Personnel
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
                {assignmentsList?.map((assignment: Assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.asset.type} - {assignment.asset.serial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.personnel.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(assignment.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Asset Expenditures</h2>
            <button
              onClick={() => setShowExpenditureForm(!showExpenditureForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {showExpenditureForm ? 'Cancel' : 'Create Expenditure'}
            </button>
          </div>

          {showExpenditureForm && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Create New Expenditure</h3>
              <form onSubmit={handleCreateExpenditure} className="space-y-4">
                <div>
                  <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">
                    Asset
                  </label>
                  <select
                    id="assetId"
                    value={expenditureFormData.assetId}
                    onChange={(e) => setExpenditureFormData({ ...expenditureFormData, assetId: e.target.value })}
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
                  <label htmlFor="personnelId" className="block text-sm font-medium text-gray-700">
                    Personnel
                  </label>
                  <select
                    id="personnelId"
                    value={expenditureFormData.personnelId}
                    onChange={(e) => setExpenditureFormData({ ...expenditureFormData, personnelId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select personnel</option>
                    {personnelList?.map((person: User) => (
                      <option key={person.id} value={person.id}>
                        {person.name} ({person.email})
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
                    value={expenditureFormData.quantity}
                    onChange={(e) => setExpenditureFormData({ ...expenditureFormData, quantity: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    min="1"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowExpenditureForm(false)}
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
                    Personnel
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
                {expendituresList?.map((expenditure: Expenditure) => (
                  <tr key={expenditure.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expenditure.asset.type} - {expenditure.asset.serial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expenditure.personnel.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expenditure.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expenditure.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 