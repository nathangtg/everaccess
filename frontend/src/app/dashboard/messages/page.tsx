'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Plus, Clock, User, Send } from 'lucide-react';
import api from '@/lib/api';
import { UserMessage } from '@/types';

export default function MessagesPage() {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get<UserMessage[]>('/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) return <div className="p-10 text-center text-slate-400 animate-pulse">Loading Time Capsule...</div>;

  return (
    <div className="pb-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Time Capsule</h1>
          <p className="text-slate-500 mt-2 text-lg">Leave lasting messages for your loved ones.</p>
        </div>
        <Link
          href="/dashboard/messages/new"
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} className="mr-2" />
          New Message
        </Link>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6 animate-bounce">
            <Mail size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No messages yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
            Create a digital time capsule. Write letters or notes that will only be delivered to your beneficiaries when the time comes.
          </p>
          <Link
            href="/dashboard/messages/new"
            className="inline-flex px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
          >
            Write your first message
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((message) => (
            <div
              key={message.message_id}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
            >
               {/* Decorative Blob */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Mail size={24} />
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide rounded-full border border-slate-200">
                  {message.delivery_condition.replace('_', ' ')}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 relative z-10">
                {message.message_title}
              </h3>
              
              <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed relative z-10">
                {message.message_content}
              </p>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-medium text-slate-400 relative z-10">
                <div className="flex items-center bg-slate-50 px-2 py-1 rounded-lg">
                  <Clock size={12} className="mr-1.5" />
                  <span>{formatDate(message.created_at)}</span>
                </div>
                {message.beneficiary_id ? (
                   <div className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg" title="Beneficiary Assigned">
                     <User size={12} className="mr-1.5" />
                     <span>Assigned</span>
                   </div>
                ) : (
                    <div className="flex items-center text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                     <Send size={12} className="mr-1.5" />
                     <span>General</span>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}