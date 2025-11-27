'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, FileText, Upload, Loader2, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

export default function VerificationPage() {
  const [step, setStep] = useState(1); // 1: Details, 2: Upload, 3: Success
  const [email, setEmail] = useState(''); // Requester (Beneficiary) Email
  const [deceasedId, setDeceasedId] = useState(''); // In real app, this might be a code
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [error, setError] = useState('');

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Create the request record
      // NOTE: In a real app, 'user_id' (deceased) would be found via a unique 'Legacy Code'
      // provided to the beneficiary. Here we simulate or ask for ID.
      const response = await api.post('/verifications/requests', {
        requester_email: email,
        user_id: deceasedId, 
      });
      setRequestId(response.data.request_id);
      setStep(2);
    } catch (err: any) {
      console.error('Verification request error:', err);
      setError('Failed to initiate verification. Please check the User ID.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !requestId) return;

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', 'death_certificate');

    try {
      await api.post(`/verifications/requests/${requestId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStep(3);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Failed to upload document.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-12 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <ShieldCheck size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-2xl font-bold">Beneficiary Verification</h1>
          <p className="text-slate-400 text-sm mt-1">Securely submit proof of claim</p>
        </div>

        <div className="p-8">
          {/* Progress Steps */}
          <div className="flex justify-center mb-8 space-x-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${
                  s === step ? 'bg-blue-600 scale-125' : s < step ? 'bg-green-500' : 'bg-slate-200'
                } transition-all duration-300`}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 flex items-center">
              <span className="font-medium mr-2">Error:</span> {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleCreateRequest} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="beneficiary@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Deceased User ID / Legacy Code</label>
                <input
                  type="text"
                  value={deceasedId}
                  onChange={(e) => setDeceasedId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., 550e8400-e29b..."
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  This code is typically provided in the Digital Will or legal instructions.
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-200 flex justify-center items-center"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Start Verification'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleUpload} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Upload Death Certificate</h3>
                <p className="text-slate-500 text-sm">
                  Please provide an official death certificate or legal proof of passing.
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.jpg,.png,.jpeg"
                  required
                />
                <div className="pointer-events-none">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  {file ? (
                    <p className="text-blue-600 font-medium truncate">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-slate-600 font-medium">Click to upload document</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG, or PNG (Max 10MB)</p>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !file}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Submit Documents'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Submission Received</h2>
              <p className="text-slate-500 mb-8">
                Your verification request (ID: <span className="font-mono text-slate-700 bg-slate-100 px-1 rounded">{requestId.slice(0, 8)}...</span>) has been submitted.
                Our legal team will review the documents within 3-5 business days. You will receive an email update.
              </p>
              <Link
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm">
        &copy; 2025 EverAccess Legacy Protection
      </p>
    </div>
  );
}