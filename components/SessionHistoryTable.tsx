'use client';

import { useState, useEffect } from 'react';
import { Download, Filter, Search, Calendar, Clock, DollarSign } from 'lucide-react';
import { getDetailedSessionHistory } from '@/lib/actions/subscription.actions';
import { getAllCompanions } from '@/lib/actions/companion.actions';
import { subjectsColors } from '@/constants';

interface SessionHistoryItem {
  id: string;
  duration_minutes: number;
  cost: number;
  start_time: string;
  end_time: string;
  tutors: {
    id: string;
    name: string;
    subject: string;
    topic: string;
  };
}

interface Tutor {
  id: string;
  name: string;
  subject: string;
}

export default function SessionHistoryTable() {
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTutor, setSelectedTutor] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Load initial data
  useEffect(() => {
    loadSessions(true);
    loadTutors();
  }, []);

  // Load sessions when filters change
  useEffect(() => {
    loadSessions(true);
  }, [selectedTutor, startDate, endDate]);

  const loadTutors = async () => {
    try {
      const companionsData = await getAllCompanions({ limit: 100, page: 1 });
      setTutors(companionsData);
    } catch (error) {
      console.error('Error loading tutors:', error);
    }
  };

  const loadSessions = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      const filters = {
        tutorId: selectedTutor || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      };

      const result = await getDetailedSessionHistory(
        currentPage, 
        20, 
        filters.tutorId, 
        filters.startDate, 
        filters.endDate
      );

      if (result) {
        if (reset) {
          setSessions(result.sessions);
          setPage(1);
        } else {
          setSessions(prev => [...prev, ...result.sessions]);
        }
        setHasMore(result.hasMore);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadSessions(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes.toFixed(1)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Tutor Name', 
      'Subject',
      'Topic',
      'Duration (minutes)',
      'Cost',
      'Start Time',
      'End Time'
    ];

    const csvData = sessions.map(session => [
      new Date(session.start_time).toLocaleDateString(),
      session.tutors.name,
      session.tutors.subject,
      session.tutors.topic,
      session.duration_minutes.toFixed(2),
      session.cost.toFixed(2),
      new Date(session.start_time).toLocaleString(),
      new Date(session.end_time).toLocaleString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `session-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSelectedTutor('');
    setSelectedSubject('');
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
  };

  // Filter sessions by search term and subject
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.tutors.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tutors.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === '' || 
      session.tutors.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  const subjects = Array.from(new Set(sessions.map(s => s.tutors.subject)));

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Session History</h2>
          <p className="text-gray-600">Track and analyze your learning sessions</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              showFilters 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white/60 text-gray-700 border-gray-200 hover:bg-white/80'
            }`}
          >
            <Filter size={16} />
            Filters
          </button>
          
          <button
            onClick={exportToCSV}
            disabled={filteredSessions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tutors or topics..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tutor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tutor
              </label>
              <select
                value={selectedTutor}
                onChange={(e) => setSelectedTutor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All tutors</option>
                {tutors.map(tutor => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Sessions Table */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        {loading && page === 1 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">Try adjusting your filters or start a learning session!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-white/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ 
                            backgroundColor: subjectsColors[session.tutors.subject as keyof typeof subjectsColors] || '#6b7280' 
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {session.tutors.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.tutors.subject} • {session.tutors.topic}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(session.start_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        {formatTime(session.duration_minutes)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign size={14} className="mr-1 text-gray-400" />
                        {formatCost(session.cost)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="px-6 py-4 border-t border-gray-200/50">
            <button
              onClick={loadMore}
              className="w-full px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50/50 rounded-lg transition-colors"
            >
              Load more sessions
            </button>
          </div>
        )}

        {/* Loading More */}
        {loading && page > 1 && (
          <div className="px-6 py-4 border-t border-gray-200/50 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}