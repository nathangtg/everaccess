'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, ArrowUpRight, Wallet, Key, Users, ShieldCheck, Loader2, Activity, FileText } from 'lucide-react';
import api from '@/lib/api';
import { Asset, Beneficiary } from '@/types';

export default function Dashboard() {
  const [assetCount, setAssetCount] = useState(0);
  const [beneficiaryCount, setBeneficiaryCount] = useState(0);
  const [cryptoCount, setCryptoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, beneficiariesRes] = await Promise.all([
          api.get<Asset[]>('/assets/?skip=0&limit=100'),
          api.get<Beneficiary[]>('/beneficiaries/?skip=0&limit=100'),
        ]);

        const assets = assetsRes.data;
        setAssetCount(assets.length);
        setCryptoCount(assets.filter(a => a.asset_type === 'crypto_wallet').length);
        
        const beneficiaries = beneficiariesRes.data;
        setBeneficiaryCount(beneficiaries.length);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
           <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
           <p className="text-slate-400 text-sm font-medium animate-pulse">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
             <Activity size={12} className="mr-1" /> System Operational
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">User</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg max-w-xl">
            Your digital legacy is secure. You have <span className="font-bold text-slate-900">{assetCount} assets</span> protected across your vault.
          </p>
        </div>
        <div className="flex gap-3">
           <Link 
             href="/dashboard/assets/new" 
             className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
           >
             <Plus size={18} className="mr-2" />
             Add Asset
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Assets", value: assetCount, icon: Key, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Beneficiaries", value: beneficiaryCount, icon: Users, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
          { label: "Crypto Vaults", value: cryptoCount, icon: Wallet, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
        ].map((stat, i) => (
          <div key={i} className={`group bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={80} className={stat.color} />
             </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 mb-1 relative z-10">{stat.value}</div>
            <div className="text-sm text-slate-500 font-semibold relative z-10">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Legacy Status Card */}
         <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
           
           <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="flex items-start justify-between mb-8">
               <div>
                 <h2 className="text-2xl font-bold mb-2">Legacy Protection Status</h2>
                 <p className="text-blue-100">Your vault is active and waiting for trigger events.</p>
               </div>
               <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/10">
                 <ShieldCheck size={32} className="text-white" />
               </div>
             </div>
             
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-3">
                    <span className="text-blue-100">Setup Completion</span>
                    <span>85%</span>
                  </div>
                  <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full w-[85%] bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Link href="/dashboard/beneficiaries" className="flex-1 text-center py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                    Verify Beneficiaries
                  </Link>
                  <button className="px-4 py-3 bg-blue-800/50 text-blue-100 rounded-xl font-semibold hover:bg-blue-800/70 backdrop-blur-md transition-colors border border-white/10">
                    View Logs
                  </button>
                </div>
             </div>
           </div>
         </div>

         {/* Quick Actions */}
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 mb-6 px-2">Quick Actions</h2>
            <div className="space-y-3 flex-1">
              <Link href="/dashboard/assets/new" className="flex items-center p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group cursor-pointer">
                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-slate-900">Add Document</h3>
                    <p className="text-xs text-slate-500">Upload wills or deeds</p>
                 </div>
                 <ArrowUpRight size={18} className="text-slate-300 group-hover:text-green-600 transition-colors" />
              </Link>
              
              <Link href="/dashboard/crypto/new" className="flex items-center p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group cursor-pointer">
                 <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Wallet size={20} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-slate-900">Link Crypto Wallet</h3>
                    <p className="text-xs text-slate-500">Secure keys & seeds</p>
                 </div>
                 <ArrowUpRight size={18} className="text-slate-300 group-hover:text-orange-600 transition-colors" />
              </Link>

              <Link href="/dashboard/beneficiaries/new" className="flex items-center p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group cursor-pointer">
                 <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Users size={20} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-slate-900">Designate Heir</h3>
                    <p className="text-xs text-slate-500">Add trusted person</p>
                 </div>
                 <ArrowUpRight size={18} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
              </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
