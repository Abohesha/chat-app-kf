'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DreamInterpretation } from '@/types';

export default function AdminPage() {
  const [dreams, setDreams] = useState<DreamInterpretation[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [filterMarital, setFilterMarital] = useState<'all' | 'single' | 'married'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const adminToken = 'kareem-fuad-admin-2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminToken) {
      setAuthenticated(true);
      setError('');
      fetchDreams();
    } else {
      setError('Invalid password');
    }
  };

  const fetchDreams = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/dreams?token=${adminToken}`);
      const result = await response.json();
      
      if (result.success) {
        setDreams(result.data.dreams);
      } else {
        setError(result.error || 'Failed to fetch dreams');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedDreams = dreams
    .filter(dream => {
      if (filterGender !== 'all' && dream.gender !== filterGender) return false;
      if (filterMarital !== 'all' && dream.maritalStatus !== filterMarital) return false;
      if (searchTerm && !dream.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !dream.dream.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
      return a.name.localeCompare(b.name);
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status?: string) => {
    const statusClasses = {
      pending: 'status-pending',
      interpreted: 'status-interpreted',
      archived: 'status-archived'
    };
    
    const displayStatus = status || 'pending';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[displayStatus as keyof typeof statusClasses] || statusClasses.pending}`}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </span>
    );
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-islamic-pattern flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl glow-effect-strong p-8 islamic-border">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Admin Access
              </h1>
              <p className="text-muted">
                Enter the admin password to view dream submissions
              </p>
              <div className="w-16 h-1 bg-gradient-gold mx-auto mt-4 rounded-full"></div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input w-full text-lg"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full text-lg py-4 rounded-xl font-semibold"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login to Dashboard
                </span>
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <Link href="/" className="text-primary hover:text-secondary transition-colors duration-200 text-sm font-medium">
                ← Back to Dream Submission
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-islamic-pattern">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute top-40 right-32 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-60 right-20 w-1 h-1 bg-green-300 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4">
                ✨ Admin Dashboard ✨
              </h1>
              <p className="text-xl text-white/90 mb-8 font-medium">
                🌙 Manage and review submitted dreams 🌟
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-2xl border border-white/30 shadow-lg">
                <div className="text-3xl font-bold text-yellow-300">{dreams.length}</div>
                <div className="text-sm text-white/90 font-medium">🎯 Total Submissions</div>
              </div>
              <Link 
                href="/" 
                className="text-white/80 hover:text-white transition-all duration-300 flex items-center text-sm font-medium bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm hover:bg-white/20 hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                🏠 Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="relative -mt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl shadow-purple-500/20 relative overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  🔍 Search Dreams
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔎 Search by name or dream content..."
                    className="form-input w-full pl-12 text-lg"
                  />
                  <svg className="w-6 h-6 text-purple-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  📊 Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                  className="form-input w-full"
                >
                  <option value="date">📅 Submission Date</option>
                  <option value="name">👤 Name</option>
                </select>
              </div>
              
              {/* Filter by Gender */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  ⚧️ Gender
                </label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value as 'all' | 'male' | 'female')}
                  className="form-input w-full"
                >
                  <option value="all">🌍 All Genders</option>
                  <option value="male">👨 Male</option>
                  <option value="female">👩 Female</option>
                </select>
              </div>
              
              {/* Filter by Marital Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  💍 Marital Status
                </label>
                <select
                  value={filterMarital}
                  onChange={(e) => setFilterMarital(e.target.value as 'all' | 'single' | 'married')}
                  className="form-input w-full"
                >
                  <option value="all">🌍 All Status</option>
                  <option value="single">💫 Single</option>
                  <option value="married">💝 Married</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end relative z-10">
              <button
                onClick={fetchDreams}
                disabled={loading}
                className="btn-gold px-8 py-3 rounded-2xl font-bold flex items-center text-lg hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    🔄 Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    ✨ Refresh
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dreams List */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="bg-white rounded-2xl glow-effect p-12 text-center islamic-border-light">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-muted">Loading dreams...</p>
          </div>
        ) : filteredAndSortedDreams.length === 0 ? (
          <div className="bg-white rounded-2xl glow-effect p-12 text-center islamic-border-light">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.007a7.962 7.962 0 01-6-2.708V19a2 2 0 01-2 2H2a2 2 0 01-2-2v-1.081c0-1.106.447-2.105 1.172-2.829L6 10.172a4 4 0 015.656 0l4.172 4.172M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Dreams Found</h3>
            <p className="text-muted">No dreams found matching your current filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedDreams.map((dream, index) => (
              <div key={dream.id} className="bg-white rounded-2xl card-shadow p-6 islamic-border-light fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Personal Info */}
                  <div className="lg:col-span-1">
                    <div className="bg-cream p-4 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Name:</span>
                          <span className="font-semibold text-gray-800">{dream.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-600">Gender:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            dream.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                          }`}>
                            {dream.gender === 'male' ? 'Male (ذكر)' : 'Female (أنثى)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-600">Marital:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            dream.maritalStatus === 'single' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {dream.maritalStatus === 'single' ? 'Single (أعزب)' : 'Married (متزوج)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-600">Status:</span>
                          {getStatusBadge(dream.status)}
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <div className="text-xs text-muted mb-1">Submitted:</div>
                          <div className="font-medium text-gray-700">{formatDate(dream.submittedAt)}</div>
                        </div>
                        {dream.ipAddress && (
                          <div className="text-xs text-muted">
                            IP: {dream.ipAddress}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Dream Content */}
                  <div className="lg:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Dream Description
                    </h3>
                    <div className="bg-light-blue p-6 rounded-xl border-l-4 border-secondary">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                        {dream.dream}
                      </p>
                    </div>
                    
                    {dream.interpretation && (
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09z" />
                          </svg>
                          Interpretation
                        </h4>
                        <div className="bg-cream p-6 rounded-xl border-l-4 border-gold">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {dream.interpretation}
                          </p>
                          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-muted">
                            Interpreted by: <span className="font-medium">{dream.interpretedBy || 'Kareem Fuad'}</span>
                            {dream.interpretedAt && (
                              <span className="ml-4">on {formatDate(dream.interpretedAt)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}