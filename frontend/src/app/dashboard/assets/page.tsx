'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Eye, FileText, ExternalLink } from 'lucide-react';
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

  if (loading) return <div className="p-10 text-center text-slate-400 animate-pulse">Syncing secure assets...</div>;

  return (
    <div className="pb-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Digital Assets</h1>
          <p className="text-slate-500 mt-2 text-lg">Securely manage your online presence and accounts.</p>
        </div>
        <Link
          href="/dashboard/assets/new"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} className="mr-2" />
          Add Asset
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {assets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6 animate-bounce">
            <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Your vault is empty</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
            Start securing your legacy by adding your first digital asset (social media, bank account, or document).
          </p>
          <Link
            href="/dashboard/assets/new"
            className="inline-flex px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
          >
            Add your first asset
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.asset_id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-3xl -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FileText size={24} />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                    {asset.asset_type.replace('_', ' ')}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{asset.asset_name}</h3>
                <p className="text-slate-500 text-sm font-medium mb-6 h-5">{asset.platform_name}</p>
                
                <div className="space-y-2 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {asset.username ? (
                    <div className="flex items-center justify-between">
                       <span className="text-slate-400 text-xs font-bold uppercase">Username</span>
                       <span className="font-mono text-slate-700 font-medium truncate max-w-[120px]" title={asset.username}>{asset.username}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                       <span className="text-slate-400 text-xs font-bold uppercase">ID</span>
                       <span className="font-mono text-slate-400 italic">Not set</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50">
                     <span className="text-slate-400 text-xs font-bold uppercase">Category</span>
                     <span className="text-slate-700 font-medium">{asset.category || 'General'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                   <button 
                     className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn"
                  >
                    View Details <ExternalLink size={14} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                  <button
                    onClick={() => handleDelete(asset.asset_id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
