'use client';

import { useState } from 'react';
import { FormData } from '@/types';

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: 'male',
    maritalStatus: 'single',
    dream: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/dreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          gender: 'male',
          maritalStatus: 'single',
          dream: ''
        });
      } else {
        setError(result.error || 'Failed to submit dream');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-green-400/30 to-teal-400/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-lg w-full relative z-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/30 shadow-2xl shadow-green-500/20 relative overflow-hidden">
            {/* Celebration particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute top-8 right-6 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
            </div>
            
            {/* Success Icon with enhanced animation */}
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/50 animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Enhanced Arabic Blessing */}
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-3 font-arabic">
              ✨ جزاك الله خيراً ✨
            </h2>
            <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8 font-bold">
              🌟 May Allah reward you with goodness 🌟
            </p>
            
            {/* Enhanced Success Message */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-2xl mb-10 border border-green-200 shadow-inner">
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                🎉 Thank you for sharing your dream! Your submission has been received and will be reviewed by 
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> ✨ Kareem Fuad ✨ </span>
                for interpretation according to Islamic teachings 🕌
              </p>
            </div>
            
            {/* Enhanced Action Button */}
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-2xl text-xl font-bold transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 w-full sm:w-auto group relative overflow-hidden"
            >
              <span className="relative z-10">🌙 Submit Another Dream ✨</span>
              
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </button>
            
            {/* Enhanced Decorative Element */}
            <div className="mt-10 flex justify-center">
              <div className="w-32 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-teal-400/30 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
          {/* Sparkle Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute top-40 right-32 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-60 right-20 w-1 h-1 bg-green-300 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center relative z-10">
            {/* Main Title with Enhanced Gradients */}
            <div className="mb-12">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-6 leading-tight animate-pulse">
                ✨ كريم فؤاد ✨
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 mb-8">
                🌙 Dream Interpretations 🌟
              </h2>
              <div className="w-40 h-2 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto mb-10 rounded-full shadow-lg shadow-pink-500/50"></div>
            </div>
            
            {/* Enhanced Description */}
            <div className="max-w-4xl mx-auto">
              <p className="text-xl sm:text-2xl text-white/90 leading-relaxed mb-10 font-medium">
                🌈 Welcome to our <span className="text-yellow-300 font-bold">magical</span> Islamic dream interpretation service ✨<br/>
                Share your dreams and receive guidance based on authentic Islamic teachings 🕌
              </p>
              
              {/* Enhanced Quranic Verse */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl shadow-purple-500/20">
                <p className="text-3xl font-arabic text-yellow-300 mb-4 leading-relaxed drop-shadow-lg">
                  ﴿وَمِنْ آيَاتِهِ مَنَامُكُم بِاللَّيْلِ وَالنَّهَارِ وَابْتِغَاؤُكُم مِّن فَضْلِهِ﴾
                </p>
                <p className="text-white/90 text-base font-medium">
                  "And among His signs is your sleep by night and day, and your seeking of His bounty" - Quran 30:23
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="relative -mt-12 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 sm:p-12 border border-white/30 shadow-2xl shadow-purple-500/20 relative overflow-hidden">
            {/* Animated border glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl opacity-20 blur-xl"></div>
            
            {/* Form Header */}
            <div className="text-center mb-10 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50 animate-pulse">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
                ✨ Share Your Dream ✨
              </h3>
              <p className="text-gray-600 text-xl font-medium">
                🌙 Describe your dream in detail for Islamic interpretation 🌟
              </p>
              <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
            </div>
            
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 shadow-lg">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input w-full text-lg"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Gender and Marital Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Gender Field */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-3">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full text-lg"
                  >
                    <option value="male">Male (ذكر)</option>
                    <option value="female">Female (أنثى)</option>
                  </select>
                </div>

                {/* Marital Status Field */}
                <div>
                  <label htmlFor="maritalStatus" className="block text-sm font-semibold text-gray-700 mb-3">
                    Marital Status *
                  </label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full text-lg"
                  >
                    <option value="single">Single (أعزب)</option>
                    <option value="married">Married (متزوج)</option>
                  </select>
                </div>
              </div>

              {/* Dream Field */}
              <div>
                <label htmlFor="dream" className="block text-sm font-semibold text-gray-700 mb-3">
                  Describe Your Dream *
                </label>
                <p className="text-sm text-muted mb-3">
                  Please provide as much detail as possible including colors, people, places, emotions, and actions you remember.
                </p>
                <textarea
                  id="dream"
                  name="dream"
                  value={formData.dream}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="form-textarea w-full text-lg"
                  placeholder="I dreamed that I was..."
                />
                <div className="mt-2 text-sm text-muted">
                  {formData.dream.length}/5000 characters
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'btn-gold hover:scale-105 glow-effect'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting Dream...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Dream للتفسير
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
              <div className="mb-4">
                <p className="text-2xl font-arabic text-gold mb-2 leading-relaxed">
                  بسم الله الرحمن الرحيم
                </p>
                <p className="text-sm text-muted">
                  Your dreams will be interpreted according to Islamic teachings and traditions
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-muted">
                <a 
                  href="/admin" 
                  className="hover:text-primary transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin Access
                </a>
                <span className="text-gray-300">•</span>
                <span>Secure & Confidential</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
