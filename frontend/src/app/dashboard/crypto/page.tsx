'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Bitcoin, PieChart } from 'lucide-react';
import api from '@/lib/api';
import { Asset } from '@/types';

export default function CryptoPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      // Fetching all assets and filtering for crypto wallets
      // In a real app, there might be a specific endpoint or filter param
      const response = await api.get('/assets/?skip=0&limit=100');
      const allAssets: Asset[] = response.data;
      setAssets(allAssets.filter(a => a.asset_type === 'crypto_wallet'));
    } catch (err) {
      console.error('Error fetching crypto assets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Crypto Vault</h1>
           <p className="text-slate-500 mt-1">Secure your keys and wallet seeds.</p>
        </div>
        <Link
          href="/dashboard/crypto/new"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-orange-200 font-semibold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Wallet
        </Link>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
            <Bitcoin className="w-8 h-8" />
          </div>
          <p className="text-slate-500 mb-4">No crypto wallets connected.</p>
          <Link
            href="/dashboard/crypto/new"
            className="text-orange-500 font-semibold hover:text-orange-600 hover:underline"
          >
            Connect a Wallet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <Link key={asset.asset_id} href={`/dashboard/crypto/${asset.asset_id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-orange-100 p-6 transition-all hover:-translate-y-1 block">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mr-4 border border-orange-100 shadow-inner">
                  <Bitcoin className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{asset.asset_name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{asset.platform_name}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600 bg-orange-50/30 p-4 rounded-xl border border-orange-100/50 mb-4">
                 <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Notes</p>
                 {asset.notes ? (
                   <p className="italic text-slate-700 leading-relaxed line-clamp-2">{asset.notes}</p>
                 ) : (
                   <p className="text-slate-400 italic">No notes added</p>
                 )}
              </div>

              <div className="flex items-center text-orange-600 text-sm font-medium bg-orange-50 px-4 py-2 rounded-lg w-fit">
                <PieChart size={16} className="mr-2" />
                Manage Allocations
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
