'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Lock, Globe, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-blue-100">
      {/* Header/Nav */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">EverAccess</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#security" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Security</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link 
                href="/login"
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center gap-2"
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-white opacity-70"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wide uppercase mb-8 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              The Digital Will Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1]">
              Your Digital Legacy, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Secured Forever.</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Securely store your digital assets, passwords, and crypto keys. 
              Ensure your beneficiaries can access them when it matters most.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:scale-105 active:scale-95"
              >
                Start Your Will
              </Link>
              <Link 
                href="#how-it-works" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300"
              >
                How it Works
              </Link>
            </div>

            {/* Stats/Trust */}
            <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: "Bank-Grade", value: "AES-256" },
                 { label: "Assets Secured", value: "$50M+" },
                 { label: "Active Users", value: "10k+" },
                 { label: "Uptime", value: "99.99%" },
               ].map((stat, i) => (
                 <div key={i}>
                   <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                   <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose EverAccess?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">We bridge the gap between physical estate planning and the digital world.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Lock,
                  title: "Secure Storage",
                  desc: "Store passwords, documents, and crypto keys in our encrypted vault."
                },
                {
                  icon: Globe,
                  title: "Global Access",
                  desc: "Access your dashboard from anywhere. Your legacy knows no borders."
                },
                {
                  icon: CheckCircle,
                  title: "Beneficiary Control",
                  desc: "You decide who gets what. Granular permissions for every asset."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <Shield className="text-blue-600 w-6 h-6" />
             <span className="font-bold text-slate-900">EverAccess</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2025 EverAccess Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
