'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bitcoin, PieChart, AlertCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { CryptoAsset, Beneficiary, CryptoAllocation } from '@/types';

export default function CryptoAssetDetail() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.id as string;

  const [asset, setAsset] = useState<CryptoAsset | null>(null);
  const [allocations, setAllocations] = useState<CryptoAllocation[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Allocation Form State
  const [allocationMode, setAllocationMode] = useState<'percentage' | 'amount'>('percentage');
  const [amountInput, setAmountInput] = useState<string>('');
  const [newAllocation, setNewAllocation] = useState({ beneficiary_id: '', percentage: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetRes, allocationsRes, beneficiariesRes] = await Promise.all([
          api.get<CryptoAsset>(`/crypto/assets/${assetId}`), 
          api.get<CryptoAllocation[]>(`/crypto/${assetId}/allocations`),
          api.get<Beneficiary[]>('/beneficiaries/'),
        ]);
        setAsset(assetRes.data);
        setAllocations(allocationsRes.data);
        setBeneficiaries(beneficiariesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load asset details.');
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
    // Use a small epsilon for float comparison if needed, but for now simple check
    if (totalAllocated + Number(newAllocation.percentage) > 100.01) {
      setError(`Cannot allocate more than 100%. Remaining: ${(100 - totalAllocated).toFixed(2)}%`);
      return;
    }

    try {
      await api.post(`/crypto/${assetId}/allocations`, newAllocation);
      // Refresh allocations
      const res = await api.get<CryptoAllocation[]>(`/crypto/${assetId}/allocations`);
      setAllocations(res.data);
      setNewAllocation({ beneficiary_id: '', percentage: 0 });
      setAmountInput('');
    } catch (err) {
      console.error('Error adding allocation:', err);
      setError('Failed to add allocation');
    }
  };

  const handlePercentageChange = (val: number) => {
    setNewAllocation({ ...newAllocation, percentage: val });
    if (asset) {
      const amt = (val / 100) * asset.balance_crypto;
      setAmountInput(amt.toFixed(6)); // approx display
    }
  };

  const handleAmountChange = (val: string) => {
    setAmountInput(val);
    if (asset && val) {
      const numVal = parseFloat(val);
      if (!isNaN(numVal)) {
        const pct = (numVal / asset.balance_crypto) * 100;
        setNewAllocation({ ...newAllocation, percentage: parseFloat(pct.toFixed(2)) });
      }
    } else {
       setNewAllocation({ ...newAllocation, percentage: 0 });
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading vault data...</div>;
  if (!asset) return <div className="p-8 text-center">Asset not found</div>;

  const totalAllocated = allocations.reduce((sum, a) => sum + Number(a.percentage), 0);
  const remaining = 100 - totalAllocated;
  const remainingAmount = (remaining / 100) * asset.balance_crypto;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <Link href="/dashboard/crypto" className="flex items-center text-slate-500 hover:text-slate-700 mb-4 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Back to Vault
        </Link>
        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm">
            <Bitcoin size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{asset.asset_name || 'Crypto Asset'}</h1>
            <div className="flex items-center gap-3 text-slate-500 mt-1">
               <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold uppercase">{asset.wallet_type}</span>
               <span>{asset.platform_name}</span>
            </div>
          </div>
          <div className="ml-auto text-right">
             <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Current Balance</div>
             <div className="text-2xl font-bold text-slate-900 font-mono">{asset.balance_crypto} <span className="text-base text-slate-400">TOK</span></div>
             <div className="text-slate-500 text-sm">≈ ${asset.balance_usd?.toLocaleString()} USD</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Allocation Chart / Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center">
              <PieChart size={20} className="mr-2 text-orange-500" /> Distribution Plan
            </h3>
            <div className="relative w-56 h-56 mx-auto rounded-full border-8 border-slate-50 flex items-center justify-center mb-8">
              <div 
                className="absolute inset-0 rounded-full border-8 border-orange-500 transition-all duration-700 ease-out"
                style={{ 
                   clipPath: totalAllocated === 100 ? 'none' : `polygon(50% 50%, 50% 0%, ${totalAllocated * 3.6 + 90}deg, 50% 50%)`, // Simplified CSS pie logic (not perfect for generic pie but works for 0-100 fill visualization roughly)
                   opacity: totalAllocated > 0 ? 1 : 0 
                }}
              />
               {/* Note: CSS-only pie charts are tricky with single div, simpler to just show text or use library. For prototype, standard ring is fine. */}
               <svg viewBox="0 0 36 36" className="absolute w-full h-full transform -rotate-90">
                  <path
                    className="text-slate-100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-orange-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${totalAllocated}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>

              <div className="text-center relative z-10">
                <span className="text-4xl font-bold text-slate-900">{remaining.toFixed(1)}%</span>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">Unallocated</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{remainingAmount.toFixed(4)} TOK</p>
              </div>
            </div>
            
            <div className="space-y-3">
               {allocations.map(a => {
                 const ben = beneficiaries.find(b => b.beneficiary_id === a.beneficiary_id);
                 return (
                   <div key={a.allocation_id || Math.random()} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${ben?.relationship_type === 'Charity' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <span className="font-bold text-slate-700">{ben?.first_name || 'Unknown'}</span>
                     </div>
                     <div className="text-right">
                        <span className="font-bold text-slate-900 block">{Number(a.percentage).toFixed(2)}%</span>
                        <span className="text-xs text-slate-500">
                          {((Number(a.percentage) / 100) * asset.balance_crypto).toFixed(4)} TOK
                        </span>
                     </div>
                   </div>
                 )
               })}
            </div>
          </div>
        </div>

        {/* Allocation Manager */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">New Allocation</h2>
            <p className="text-slate-500 mb-6">Assign a portion of this asset to a beneficiary.</p>
            
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center border border-red-100">
                <AlertCircle size={18} className="mr-2" /> {error}
              </div>
            )}

            <form onSubmit={handleAddAllocation} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Beneficiary</label>
                <select
                  value={newAllocation.beneficiary_id}
                  onChange={(e) => setNewAllocation({ ...newAllocation, beneficiary_id: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700"
                  required
                >
                  <option value="">Choose a recipient...</option>
                  {beneficiaries.map(b => (
                    <option key={b.beneficiary_id} value={b.beneficiary_id}>
                      {b.relationship_type === 'Charity' ? `❤️ ${b.first_name}` : `👤 ${b.first_name} ${b.last_name}`}
                       {' '}({b.relationship_type})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-4">Allocation Amount</label>
                
                {/* Toggle */}
                <div className="flex bg-white rounded-lg p-1 border border-slate-200 w-fit mb-6">
                  <button
                    type="button"
                    onClick={() => { setAllocationMode('percentage'); setAmountInput(''); setNewAllocation({...newAllocation, percentage: 0}) }}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${allocationMode === 'percentage' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAllocationMode('amount'); setAmountInput(''); setNewAllocation({...newAllocation, percentage: 0}) }}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${allocationMode === 'amount' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    Exact Amount (TOK)
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max={allocationMode === 'percentage' ? remaining : asset.balance_crypto}
                      value={allocationMode === 'percentage' ? (newAllocation.percentage || '') : amountInput}
                      onChange={(e) => {
                         if (allocationMode === 'percentage') handlePercentageChange(parseFloat(e.target.value));
                         else handleAmountChange(e.target.value);
                      }}
                      className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono text-lg font-bold text-slate-900"
                      placeholder="0.00"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      {allocationMode === 'percentage' ? '%' : 'TOK'}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                     {allocationMode === 'percentage' ? (
                        <span>≈ {amountInput || '0.00'} TOK</span>
                     ) : (
                        <span>≈ {newAllocation.percentage}%</span>
                     )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Available to allocate: {remaining.toFixed(2)}% ({remainingAmount.toFixed(4)} TOK)
                </div>
              </div>

              <button
                type="submit"
                disabled={remaining <= 0.01}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Allocation
              </button>
            </form>
          </div>

          {/* List of Allocations Table style */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-900">Allocation History</h3>
               <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{allocations.length} Beneficiaries</span>
            </div>
            
            {allocations.length === 0 ? (
              <div className="p-10 text-center text-slate-500 italic">No allocations have been set yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {allocations.map((allocation) => {
                   const ben = beneficiaries.find(b => b.beneficiary_id === allocation.beneficiary_id);
                   const isCharity = ben?.relationship_type === 'Charity';
                   const amount = (Number(allocation.percentage) / 100) * asset.balance_crypto;
                   
                   return (
                    <div key={allocation.allocation_id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm border 
                           ${isCharity ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-500 border-blue-100'}`}>
                          {isCharity ? '❤️' : '👤'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{ben?.first_name} {ben?.last_name}</p>
                          <div className="flex gap-2">
                             <span className="text-xs font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{ben?.relationship_type}</span>
                             {!ben?.is_registered && <span className="text-xs font-bold uppercase text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Not Registered</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           <span className="text-2xl font-bold text-slate-900">{Number(allocation.percentage).toFixed(2)}%</span>
                           <button className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all" title="Remove Allocation">
                             <Trash2 size={16} />
                           </button>
                        </div>
                        <p className="text-sm text-slate-500 font-mono">{amount.toFixed(6)} TOK</p>
                      </div>
                    </div>
                   );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
