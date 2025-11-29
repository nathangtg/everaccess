'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function InheritanceClaimPage() {
  const router = useRouter();
  const [targetEmail, setTargetEmail] = useState('');
  const [claimantEmail, setClaimantEmail] = useState(''); // New state for claimant email
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !targetEmail || !claimantEmail) return; // Validate new field

    setLoading(true);
    setStatus('idle');
    setMessage('');

    const formData = new FormData();
    formData.append('target_user_email', targetEmail);
    formData.append('claimant_email', claimantEmail); // Append claimant email
    formData.append('file', file);

    try {
      await api.post('/verifications/inheritance-claim', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('success');
      setMessage('Your claim has been submitted securely. Our team will review the documentation and notify you shortly.');
      setTargetEmail('');
      setClaimantEmail(''); // Clear new field
      setFile(null);
    } catch (err: any) {
      console.error('Error submitting claim:', err);
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Failed to submit claim. Please verify the emails and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Claim Inheritance</h1>
        <p className="text-slate-600 text-lg">
          Securely submit proof of death to initiate the asset transfer process according to the user's digital will.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        {status === 'success' ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Claim Submitted</h3>
            <p className="text-slate-600 mb-8">{message}</p>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Submit Another Claim
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">Submission Failed</p>
                  <p className="text-sm">{message}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Deceased User's Email
              </label>
              <input
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="deceased@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* New field for Claimant's Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Your Email (as Beneficiary)
              </label>
              <input
                type="email"
                required
                value={claimantEmail}
                onChange={(e) => setClaimantEmail(e.target.value)}
                placeholder="your@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Death Certificate
              </label>
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${file ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}>
                <input
                  type="file"
                  id="file-upload"
                  required
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center h-full">
                  {file ? (
                    <>
                      <FileText size={40} className="text-blue-500 mb-3" />
                      <span className="font-bold text-slate-900">{file.name}</span>
                      <span className="text-sm text-slate-500 mt-1">Click to change file</span>
                    </>
                  ) : (
                    <>
                      <Upload size={40} className="text-slate-400 mb-3" />
                      <span className="font-bold text-slate-700">Upload Document</span>
                      <span className="text-sm text-slate-500 mt-1">PDF, JPG, or PNG (Max 10MB)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Claim'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
