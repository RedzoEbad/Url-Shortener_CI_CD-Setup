'use client';

import { useEffect, useState } from 'react';
import { BarChart3, ExternalLink, Copy, Check, Calendar, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Url, UrlStats } from '@/types/url';

export default function StatsPage() {
  const [stats, setStats] = useState<UrlStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchStats}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              URL Statistics
            </h1>
            <p className="text-xl text-gray-600">
              Track your shortened URLs and their performance
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total URLs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalUrls || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalClicks || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MousePointer className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent URLs */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent URLs</h2>
            
            {stats?.recentUrls && stats.recentUrls.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Original URL</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Short Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Clicks</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUrls.map((url) => (
                      <tr key={url._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="max-w-xs truncate" title={url.originalUrl}>
                            {url.originalUrl}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {url.shortCode}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1">
                            <MousePointer className="w-4 h-4 text-gray-500" />
                            {url.clicks}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {formatDate(url.createdAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(url.shortUrl, url._id!)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Copy short URL"
                            >
                              {copied === url._id ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <a
                              href={url.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Open original URL"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <a
                              href={url.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition"
                              title="Open short URL"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No URLs created yet</p>
                <a
                  href="/"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Your First URL
                </a>
              </div>
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
