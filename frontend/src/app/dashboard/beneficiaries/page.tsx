'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, User } from 'lucide-react';
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

  if (loading) return <div>Loading beneficiaries...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Beneficiaries</h1>
          <p className="text-slate-500 mt-1">Who will inherit your digital legacy?</p>
        </div>
        <Link
          href="/dashboard/beneficiaries/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 font-semibold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Beneficiary
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {beneficiaries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
            <Plus className="w-8 h-8" />
          </div>
          <p className="text-slate-500 mb-4">You haven&apos;t added any beneficiaries yet.</p>
          <Link
            href="/dashboard/beneficiaries/new"
            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
          >
            Add your first beneficiary
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficiaries.map((person) => (
            <div key={person.beneficiary_id} className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 p-6 flex flex-col transition-all hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mr-4 shadow-sm border border-blue-100">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {person.first_name} {person.last_name}
                  </h3>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full uppercase tracking-wide mt-1">
                    {person.relationship_type}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 mb-6 flex-1">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                   <span className="text-slate-400 font-medium">Email</span>
                   <span className="font-medium text-slate-800">{person.email}</span>
                </div>
                {person.phone_number && (
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                     <span className="text-slate-400 font-medium">Phone</span>
                     <span className="font-medium text-slate-800">{person.phone_number}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-50">
                <button
                  onClick={() => handleDelete(person.beneficiary_id)}
                  className="text-slate-400 hover:text-red-600 flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
