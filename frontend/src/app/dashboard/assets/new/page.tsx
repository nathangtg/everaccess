'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AssetCreate, Beneficiary } from '@/types';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';

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
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [file, setFile] = useState<File | null>(null);
  
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
    beneficiary_ids: [],
  });

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await api.get('/beneficiaries/');
        setBeneficiaries(res.data);
      } catch (err) {
        console.error('Failed to fetch beneficiaries', err);
      }
    };
    fetchBeneficiaries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleBeneficiaryChange = (beneficiaryId: string) => {
    setFormData((prev) => {
      const current = prev.beneficiary_ids || [];
      if (current.includes(beneficiaryId)) {
        return { ...prev, beneficiary_ids: current.filter((id) => id !== beneficiaryId) };
      } else {
        return { ...prev, beneficiary_ids: [...current, beneficiaryId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create the asset
      const res = await api.post('/assets/', formData);
      const newAsset = res.data;

      // 2. Upload file if selected
      if (file && newAsset.asset_id) {
        const fileData = new FormData();
        fileData.append('file', file);
        
        await api.post(`/assets/${newAsset.asset_id}/files/`, fileData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      router.push('/dashboard/assets');
    } catch (err) {
      console.error('Error creating asset:', err);
      setError('Failed to create asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/assets"
          className="inline-flex items-center text-slate-500 hover:text-slate-700 transition-colors mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Assets
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Add New Asset</h1>
        <p className="text-slate-500 mt-1">Securely store details about your digital property.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Asset Type</label>
              <select
                name="asset_type"
                value={formData.asset_type}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                {ASSET_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Asset Name *</label>
              <input
                type="text"
                name="asset_name"
                value={formData.asset_name}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="e.g., Gmail, Chase Bank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name</label>
              <input
                type="text"
                name="platform_name"
                value={formData.platform_name}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="e.g., Google, Facebook"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="e.g., Personal, Work"
              />
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-6 mt-6">
             <h3 className="text-lg font-bold text-slate-900 mb-4">File Attachment</h3>
             <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 text-center">
                <input 
                   type="file" 
                   id="file-upload" 
                   onChange={handleFileChange} 
                   className="hidden" 
                   accept=".pdf,.doc,.docx,.jpg,.png,.txt"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                   <Upload className="h-10 w-10 text-slate-400 mb-3" />
                   <span className="text-sm font-medium text-slate-700 mb-1">
                      {file ? file.name : "Click to upload a file"}
                   </span>
                   <span className="text-xs text-slate-500">
                      {file ? `${(file.size / 1024).toFixed(2)} KB` : "PDF, Word, Image, or Text (Max 10MB)"}
                   </span>
                </label>
             </div>
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Credentials (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Username / Email</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password / Key</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recovery Info (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recovery Email</label>
                <input
                  type="email"
                  name="recovery_email"
                  value={formData.recovery_email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recovery Phone</label>
                <input
                  type="text"
                  name="recovery_phone"
                  value={formData.recovery_phone}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Additional details..."
            />
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Assign Beneficiaries</h3>
            {beneficiaries.length === 0 ? (
              <div className="text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                No beneficiaries found. Go to <Link href="/dashboard/beneficiaries" className="text-blue-600 hover:underline">Beneficiaries</Link> to add one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {beneficiaries.map((beneficiary) => (
                  <label key={beneficiary.beneficiary_id} className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.beneficiary_ids?.includes(beneficiary.beneficiary_id)}
                      onChange={() => handleBeneficiaryChange(beneficiary.beneficiary_id)}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800">
                        {beneficiary.first_name} {beneficiary.last_name}
                      </div>
                      <div className="text-sm text-slate-500">{beneficiary.email}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
