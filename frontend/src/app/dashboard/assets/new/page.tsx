'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AssetCreate } from '@/types';

const ASSET_TYPES = [
  { value: 'login_credential', label: 'Login Credential' },
  { value: 'crypto_wallet', label: 'Crypto Wallet' },
  { value: 'document', label: 'Document' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'financial', label: 'Financial Account' },
  { value: 'other', label: 'Other' },
];

export default function NewAssetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<AssetCreate>({
    asset_type: 'login_credential',
    asset_name: '',
    platform_name: '',
    username: '',
    password: '',
    recovery_email: '',
    recovery_phone: '',
    notes: '',
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/assets/', formData);
      router.push('/dashboard/assets');
    } catch (err) {
      console.error('Error creating asset:', err);
      setError('Failed to create asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Asset</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Asset Type</label>
            <select
              name="asset_type"
              value={formData.asset_type}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {ASSET_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Asset Name *</label>
            <input
              type="text"
              name="asset_name"
              value={formData.asset_name}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., Gmail, Chase Bank"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Platform Name</label>
            <input
              type="text"
              name="platform_name"
              value={formData.platform_name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., Google, Facebook"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., Personal, Work"
            />
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Credentials (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Username / Email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Password / Key</label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recovery Info (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Recovery Email</label>
              <input
                type="email"
                name="recovery_email"
                value={formData.recovery_email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Recovery Phone</label>
              <input
                type="text"
                name="recovery_phone"
                value={formData.recovery_phone}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Additional details..."
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Saving...' : 'Save Asset'}
          </button>
        </div>
      </form>
    </div>
  );
}
