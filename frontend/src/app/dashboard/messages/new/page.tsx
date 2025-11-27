'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { Beneficiary } from '@/types';

export default function NewMessagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    beneficiary_id: '',
    delivery_condition: 'upon_death',
  });

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await api.get<Beneficiary[]>('/beneficiaries');
        setBeneficiaries(response.data);
      } catch (error) {
        console.error('Failed to fetch beneficiaries', error);
      }
    };
    fetchBeneficiaries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/messages', {
        message_title: formData.title,
        message_content: formData.content,
        beneficiary_id: formData.beneficiary_id || null,
        delivery_condition: formData.delivery_condition,
      });
      router.push('/dashboard/messages');
    } catch (error) {
      console.error('Failed to create message', error);
      // Ideally handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/messages"
          className="inline-flex items-center text-slate-500 hover:text-slate-700 transition-colors mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Messages
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">New Time Capsule Message</h1>
        <p className="text-slate-500 mt-1">Write a message to be delivered in the future.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">Title / Subject</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g., A letter for my daughter"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">Message Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              placeholder="Write your message here..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">Recipient (Optional)</label>
              <select
                value={formData.beneficiary_id}
                onChange={(e) => setFormData({ ...formData, beneficiary_id: e.target.value })}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">Select a Beneficiary</option>
                {beneficiaries.map((b) => (
                  <option key={b.beneficiary_id} value={b.beneficiary_id}>
                    {b.first_name} {b.last_name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">Leave blank to make it available to all verified heirs.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">Delivery Condition</label>
              <select
                value={formData.delivery_condition}
                onChange={(e) => setFormData({ ...formData, delivery_condition: e.target.value })}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="upon_death">Upon Verified Death</option>
                <option value="after_verification">After Verification Approval</option>
                <option value="scheduled_date">On a Scheduled Date (Coming Soon)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
             <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Save Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}