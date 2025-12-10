'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { AssetCreate, Beneficiary, AssetFile } from '@/types';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import Link from 'next/link';

const ASSET_TYPES = [
  { value: 'login_credential', label: 'Login Credential' },
  { value: 'crypto_wallet', label: 'Crypto Wallet' },
  { value: 'document', label: 'Document' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'financial', label: 'Financial Account' },
  { value: 'other', label: 'Other' },
];

export default function EditAssetPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [files, setFiles] = useState<AssetFile[]>([]);

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
    const fetchData = async () => {
      try {
        const [assetRes, beneficiariesRes] = await Promise.all([
          api.get(`/assets/${assetId}`),
          api.get('/beneficiaries/')
        ]);

        setBeneficiaries(beneficiariesRes.data);

        const asset = assetRes.data;
        setFiles(asset.asset_files || []);
        setFormData({
          asset_type: asset.asset_type,
          asset_name: asset.asset_name,
          platform_name: asset.platform_name || '',
          username: asset.username || '',
          password: asset.password || '',
          recovery_email: asset.recovery_email || '',
          recovery_phone: asset.recovery_phone || '',
          notes: asset.notes || '',
          category: asset.category || '',
          beneficiary_ids: asset.beneficiaries ? asset.beneficiaries.map((b: any) => b.beneficiary_id) : [],
        });
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Failed to load asset data.');
      }
    };

    if (assetId) {
      fetchData();
    }
  }, [assetId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await api.put(`/assets/${assetId}`, formData);
      router.push('/dashboard/assets');
    } catch (err) {
      console.error('Error updating asset:', err);
      setError('Failed to update asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await api.get(`/assets/${assetId}/files/${fileId}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download file.');
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
        <h1 className="text-3xl font-bold text-slate-900">Edit Asset</h1>
        <p className="text-slate-500 mt-1">Update details about your digital property.</p>
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
          
          {files.length > 0 && (
            <div className="border-t border-slate-100 pt-6 mt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Attached Files</h3>
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.file_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-blue-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{file.file_name}</div>
                        <div className="text-xs text-slate-500">
                          {file.file_size ? `${(file.file_size / 1024).toFixed(2)} KB` : 'Unknown size'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(file.file_id, file.file_name)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                      title="Download"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          <div className="flex items-center justify-end gap-4 pt-4">
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
              {loading ? 'Updating Asset...' : 'Update Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
