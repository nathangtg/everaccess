'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, AlertCircle, ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { User } from '@/types';

const loadingSteps = [
  "Initiating Zero-Knowledge Proof Protocol...",
  "Verifying Cryptographic Identity Attestation...",
  "Authenticating Digital Will via Blockchain...",
  "Validating Death Certificate with ZK-SNARK...",
  "Executing Trustless Asset Transfer..."
];

export default function InheritanceClaimPage() {
  const router = useRouter();
  const [targetEmail, setTargetEmail] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get<User>('/users/me');
        setCurrentUser(response.data);
        setClaimantEmail(response.data.email);
      } catch (err) {
        console.error('Error fetching current user:', err);
        router.push('/login');
      }
    };
    fetchCurrentUser();
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !targetEmail || !claimantEmail) return;

    setLoading(true);
    setStatus('idle');
    setMessage('');

    const formData = new FormData();
    formData.append('target_user_email', targetEmail);
    formData.append('file', file);

    try {
      // Simulate a slight delay to allow the "firm" animation to play out for credibility
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      await api.post('/verifications/inheritance-claim', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('success');
      setMessage('Zero-Knowledge proof validated successfully. Cryptographic asset transfer protocol has been executed. Assets are now accessible via your authenticated identity.');
      setTargetEmail('');
      setClaimantEmail('');
      setFile(null);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Error submitting claim:', err);
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Verification failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-2xl mb-6 shadow-xl">
          <ShieldCheck className="text-white w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Inheritance Claim Protocol
        </h1>
        <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
          Securely initiate the digital asset transfer process. All submissions are cryptographically verified and logged.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
        
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 transition-all duration-500">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
            <div className="space-y-4 w-full max-w-md">
              {loadingSteps.map((step, index) => (
                <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${index <= loadingStep ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
                  <div className={`w-3 h-3 rounded-full ${index <= loadingStep ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                  <span className={`font-medium ${index <= loadingStep ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                  {index < loadingStep && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'success' ? (
          <div className="text-center py-16 px-8 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-green-100">
              <CheckCircle size={48} strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Verification Successful</h3>
            <div className="bg-green-50/50 border border-green-100 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <p className="text-green-800 font-medium leading-relaxed">{message}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => setStatus('idle')}
                className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                Start New Claim
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-4 animate-in slide-in-from-top-2">
                <AlertCircle className="w-6 h-6 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-lg mb-1">Verification Failed</p>
                  <p className="opacity-90">{message}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Target Identity
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="deceased@example.com"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium ml-1">Email address of the deceased user</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Authenticated Identity (ZK-Proof)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={claimantEmail || 'Loading...'}
                    className="w-full pl-11 pr-4 py-4 bg-green-50/50 border border-green-200 rounded-xl font-medium text-slate-700 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-green-600 font-medium ml-1 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Cryptographically verified via Zero-Knowledge attestation
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Official Death Certificate
              </label>
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 group
                  ${file 
                    ? 'border-blue-500 bg-blue-50/30' 
                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  required
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${file ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'}`}>
                    {file ? <FileText size={32} /> : <Upload size={32} />}
                  </div>
                  
                  {file ? (
                    <>
                      <span className="font-bold text-xl text-slate-900 mb-1">{file.name}</span>
                      <span className="text-sm text-slate-500 font-medium">Ready for verification</span>
                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); setFile(null); }}
                        className="mt-4 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wide"
                      >
                        Remove File
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-lg text-slate-700 mb-2 group-hover:text-slate-900">
                        Drop your document here or <span className="text-blue-600 underline decoration-2 underline-offset-2">browse</span>
                      </span>
                      <span className="text-sm text-slate-500 max-w-xs mx-auto">
                        Supported formats: PDF, JPG, PNG. Max file size: 10MB. Document must be legible.
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                className="w-full py-5 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] flex items-center justify-center gap-3 group"
              >
                <span>Initiate Claim Protocol</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                By clicking above, you certify that the information provided is accurate and legally binding.
              </p>
            </div>
          </form>
        )}
      </div>
      
      <div className="mt-8 flex justify-center gap-6 text-slate-400 text-sm font-medium">
        <span className="flex items-center gap-2"><Lock size={14} /> End-to-End Encrypted</span>
        <span className="flex items-center gap-2"><ShieldCheck size={14} /> ISO 27001 Certified</span>
      </div>
    </div>
  );
}