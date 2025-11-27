'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, User, Heart, Phone, Mail } from 'lucide-react';
import api from '@/lib/api';
import { Beneficiary } from '@/types';

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await api.get('/beneficiaries/?skip=0&limit=100');
      setBeneficiaries(response.data);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
      setError('Failed to load beneficiaries.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this beneficiary?')) return;

    try {
      await api.delete(`/beneficiaries/${id}`);
      setBeneficiaries(beneficiaries.filter((b) => b.beneficiary_id !== id));
    } catch (err) {
      console.error('Error deleting beneficiary:', err);
      alert('Failed to delete beneficiary.');
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400 animate-pulse">Syncing beneficiaries...</div>;

  return (
    <div className="pb-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Beneficiaries</h1>
          <p className="text-slate-500 mt-2 text-lg">Who will inherit your digital legacy?</p>
        </div>
        <Link
          href="/dashboard/beneficiaries/new"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} className="mr-2" />
          Add Beneficiary
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {beneficiaries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6 animate-bounce">
            <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No beneficiaries yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
            You need to designate at least one person or charity to receive your assets.
          </p>
          <Link
            href="/dashboard/beneficiaries/new"
            className="inline-flex px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
          >
            Add your first beneficiary
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficiaries.map((person) => {
            const isCharity = person.relationship_type === 'Charity';
            
            return (
              <div key={person.beneficiary_id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                {/* Decorative Background Blob */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110 ${isCharity ? 'bg-red-50' : 'bg-blue-50'}`}></div>

                <div className="flex items-center mb-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border transition-colors duration-300 mr-4 
                    ${isCharity 
                      ? 'bg-red-50 text-red-500 border-red-100 group-hover:bg-red-500 group-hover:text-white' 
                      : 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                    {isCharity ? <Heart size={28} fill={isCharity ? "currentColor" : "none"} /> : <User size={28} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {person.first_name} {person.last_name}
                    </h3>
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full mt-1.5
                      ${isCharity ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {person.relationship_type}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600 mb-6 flex-1 relative z-10">
                  <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 transition-colors">
                     <div className="p-1.5 bg-white rounded-lg text-slate-400 mr-3 shadow-sm">
                       <Mail size={14} />
                     </div>
                     <span className="font-medium text-slate-700 truncate">{person.email}</span>
                  </div>
                  {person.phone_number && (
                    <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 transition-colors">
                       <div className="p-1.5 bg-white rounded-lg text-slate-400 mr-3 shadow-sm">
                         <Phone size={14} />
                       </div>
                       <span className="font-medium text-slate-700">{person.phone_number}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-50 relative z-10">
                  <button
                    onClick={() => handleDelete(person.beneficiary_id)}
                    className="text-slate-400 hover:text-red-600 flex items-center gap-2 text-xs font-bold uppercase px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
