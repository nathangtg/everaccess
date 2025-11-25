'use client';

import Link from 'next/link';
import { Plus, ArrowUpRight, Wallet, Key, Users, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Manage your digital legacy and beneficiaries.</p>
        </div>
        <div className="flex gap-3">
           <Link 
             href="/dashboard/assets/new" 
             className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
           >
             <Plus size={16} className="mr-2" />
             Add Asset
           </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Assets", value: "12", icon: Key, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Beneficiaries", value: "3", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Crypto Vaults", value: "2", icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +2 new <ArrowUpRight size={12} className="ml-1" />
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity or Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/beneficiaries/new" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-blue-600 shadow-sm">
                  <Users size={18} />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-blue-700">Add Beneficiary</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600" />
            </Link>
            
            <Link href="/dashboard/crypto/new" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-blue-600 shadow-sm">
                  <Wallet size={18} />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-blue-700">Secure Crypto Wallet</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600" />
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold mb-1">Legacy Status</h2>
              <p className="text-blue-100 text-sm">Your vault is active and monitored.</p>
            </div>
            <ShieldCheck size={28} className="text-blue-200" />
          </div>
          
          <div className="space-y-4">
             <div>
               <div className="flex justify-between text-sm mb-2">
                 <span className="text-blue-100">Profile Completion</span>
                 <span className="font-semibold">85%</span>
               </div>
               <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden">
                 <div className="h-full w-[85%] bg-blue-300 rounded-full"></div>
               </div>
             </div>
             
             <div className="pt-4 border-t border-blue-500/30">
               <p className="text-sm text-blue-100 mb-3">Next Step:</p>
               <Link href="/dashboard/beneficiaries" className="block text-center w-full py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                 Verify Beneficiaries
               </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
