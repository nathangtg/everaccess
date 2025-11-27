'use client';

import { AxiosError } from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import api, { setToken } from '@/lib/api';
import { AuthResponse } from '@/types';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      if (response.data && response.data.access_token) {
        setToken(response.data.access_token);
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const error = err as AxiosError<{ detail: string }>;
      console.error('Registration error:', error);
      setError(error.response?.data?.detail || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/50 blur-3xl opacity-60" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-100/50 blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-10 border border-white/50">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white mb-6 shadow-lg shadow-blue-500/30 transform rotate-3">
              <Shield size={32} className="-rotate-3" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 mt-3 text-lg">Start securing your digital legacy</p>
          </div>

          {error && (
            <div className="bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-600 text-sm p-4 rounded-2xl mb-8 text-center font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">First Name</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ease-in-out hover:bg-white hover:shadow-sm"
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Last Name</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ease-in-out hover:bg-white hover:shadow-sm"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ease-in-out hover:bg-white hover:shadow-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ease-in-out hover:bg-white hover:shadow-sm"
                  placeholder="Create a strong password"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 ml-1 font-medium">Must be at least 8 characters</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Create Account 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline decoration-2 underline-offset-4 transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer Trust Indicator */}
        <div className="text-center mt-8 opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
            <Lock size={12} /> Secured with AES-256 Encryption
          </p>
        </div>
      </div>
    </div>
  );
}