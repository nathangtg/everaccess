'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Eye } from 'lucide-react';
import api from '@/lib/api';
import { Asset } from '@/types';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets/?skip=0&limit=100');
      setAssets(response.data);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load assets.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      await api.delete(`/assets/${assetId}`);
      setAssets(assets.filter((a) => a.asset_id !== assetId));
    } catch (err) {
      console.error('Error deleting asset:', err);
      alert('Failed to delete asset.');
    }
  };

  if (loading) return <div>Loading assets...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Digital Assets</h1>
          <p className="text-slate-500 mt-1">Manage your accounts and passwords securely</p>
        </div>
        <Link
          href="/dashboard/assets/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 font-semibold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Asset
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {assets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No assets found</h3>
          <p className="text-slate-500 mb-6">Start by adding your first digital asset.</p>
          <Link
            href="/dashboard/assets/new"
            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
          >
            Add your first asset
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.asset_id} className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 p-6 transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-50 text-blue-600 mb-3">
                    {asset.asset_type.replace('_', ' ')}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{asset.asset_name}</h3>
                  {asset.platform_name && <p className="text-slate-500 text-sm font-medium">{asset.platform_name}</p>}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600 mb-6 bg-slate-50/50 p-3 rounded-lg border border-slate-100/50">
                {asset.username && (
                  <div className="flex items-center justify-between">
                     <span className="text-slate-400 text-xs font-semibold uppercase">Username</span>
                     <span className="font-mono text-slate-700">{asset.username}</span>
                  </div>
                )}
                {asset.category && (
                  <div className="flex items-center justify-between">
                     <span className="text-slate-400 text-xs font-semibold uppercase">Category</span>
                     <span>{asset.category}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                 <button 
                   className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                   title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(asset.asset_id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
