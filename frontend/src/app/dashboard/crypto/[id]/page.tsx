'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bitcoin, PieChart, Save, Trash2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { Asset, Beneficiary, CryptoAllocation } from '@/types';

export default function CryptoAssetDetail() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.id as string;

  const [asset, setAsset] = useState<Asset | null>(null);
  const [allocations, setAllocations] = useState<CryptoAllocation[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAllocation, setNewAllocation] = useState({ beneficiary_id: '', percentage: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetRes, allocationsRes, beneficiariesRes] = await Promise.all([
          api.get<Asset>(`/assets/${assetId}`), // Assuming get single asset endpoint exists
          api.get<CryptoAllocation[]>(`/crypto/${assetId}/allocations`),
          api.get<Beneficiary[]>('/beneficiaries/'),
        ]);
        setAsset(assetRes.data);
        setAllocations(allocationsRes.data);
        setBeneficiaries(beneficiariesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assetId]);

  const handleAddAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const totalAllocated = allocations.reduce((sum, a) => sum + Number(a.percentage), 0);
    if (totalAllocated + Number(newAllocation.percentage) > 100) {
      setError(`Cannot allocate more than 100%. Remaining: ${100 - totalAllocated}%`);
      return;
    }

    try {
      await api.post(`/crypto/${assetId}/allocations`, newAllocation);
      // Refresh allocations
      const res = await api.get<CryptoAllocation[]>(`/crypto/${assetId}/allocations`);
      setAllocations(res.data);
      setNewAllocation({ beneficiary_id: '', percentage: 0 });
    } catch (err) {
      console.error('Error adding allocation:', err);
      setError('Failed to add allocation');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!asset) return <div className="p-8 text-center">Asset not found</div>;

  const totalAllocated = allocations.reduce((sum, a) => sum + Number(a.percentage), 0);
  const remaining = 100 - totalAllocated;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/crypto" className="flex items-center text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft size={18} className="mr-1" /> Back to Vault
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 border border-orange-100">
            <Bitcoin size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{asset.asset_name}</h1>
            <p className="text-slate-500">{asset.platform_name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Allocation Chart / Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <PieChart size={20} className="mr-2 text-orange-500" /> Distribution
            </h3>
            <div className="relative w-48 h-48 mx-auto rounded-full border-8 border-slate-100 flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full border-8 border-orange-500 transition-all duration-500"
                style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`, opacity: totalAllocated > 0 ? 1 : 0 }} // Simplified viz
              />
              <div className="text-center">
                <span className="text-3xl font-bold text-slate-900">{remaining}%</span>
                <p className="text-xs text-slate-500 uppercase font-medium">Unallocated</p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
               {allocations.map(a => {
                 const ben = beneficiaries.find(b => b.beneficiary_id === a.beneficiary_id);
                 return (
                   <div key={a.allocation_id || Math.random()} className="flex justify-between text-sm">
                     <span className="text-slate-600">{ben?.first_name || 'Unknown'}</span>
                     <span className="font-bold">{a.percentage}%</span>
                   </div>
                 )
               })}
            </div>
          </div>
        </div>

        {/* Allocation Manager */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Add Beneficiary Allocation</h2>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center">
                <AlertCircle size={18} className="mr-2" /> {error}
              </div>
            )}

            <form onSubmit={handleAddAllocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Beneficiary / Charity</label>
                <select
                  value={newAllocation.beneficiary_id}
                  onChange={(e) => setNewAllocation({ ...newAllocation, beneficiary_id: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  required
                >
                  <option value="">Select Recipient</option>
                  {beneficiaries.map(b => (
                    <option key={b.beneficiary_id} value={b.beneficiary_id}>
                      {b.relationship_type === 'Charity' ? `❤️ ${b.first_name}` : `${b.first_name} ${b.last_name}`}
                       {' '}({b.relationship_type})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Percentage Share (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max={remaining}
                    value={newAllocation.percentage}
                    onChange={(e) => setNewAllocation({ ...newAllocation, percentage: Number(e.target.value) })}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    required
                  />
                  <span className="text-slate-400 font-medium whitespace-nowrap">Max: {remaining}%</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={remaining === 0}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all disabled:opacity-50"
              >
                Add Allocation
              </button>
            </form>
          </div>

          {/* List of Allocations */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900">Current Allocations</h3>
            {allocations.length === 0 && <p className="text-slate-500 italic">No allocations set.</p>}
            {allocations.map((allocation) => {
               const ben = beneficiaries.find(b => b.beneficiary_id === allocation.beneficiary_id);
               return (
                <div key={allocation.allocation_id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${ben?.relationship_type === 'Charity' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                      {ben?.relationship_type === 'Charity' ? '❤️' : '👤'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{ben?.first_name} {ben?.last_name}</p>
                      <p className="text-xs text-slate-500 uppercase">{ben?.relationship_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-slate-900">{allocation.percentage}%</span>
                    {/* Delete button would go here */}
                  </div>
                </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
