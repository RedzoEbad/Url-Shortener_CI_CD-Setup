'use client';

import { useState } from 'react';
import { Link, Copy, Check, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
}

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortenedUrl(null);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl,
          customCode: customCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setShortenedUrl(data);
      setOriginalUrl('');
      setCustomCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortenedUrl) {
      try {
        await navigator.clipboard.writeText(shortenedUrl.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              URL Shortener
            </h1>
            <p className="text-xl text-gray-600">
              Transform long URLs into short, shareable links
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your long URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/very-long-url-that-needs-shortening"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="custom" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom code (optional)
                </label>
                <input
                  type="text"
                  id="custom"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="my-custom-code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !originalUrl}
                className={cn(
                  "w-full py-3 px-6 rounded-lg font-semibold text-white transition-all transform",
                  loading || !originalUrl
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
                )}
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Success Result */}
            {shortenedUrl && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-800">
                    Your shortened URL is ready!
                  </h3>
                  <Link className="w-6 h-6 text-green-600" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Original URL:</p>
                    <p className="text-sm text-gray-800 truncate">{shortenedUrl.originalUrl}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Short URL:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={shortenedUrl.shortUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 font-mono"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Code: {shortenedUrl.shortCode}</span>
                    <span>Clicks: {shortenedUrl.clicks}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Link className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Shortening</h3>
              <p className="text-gray-600">Create short URLs in seconds with our fast and reliable service.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Clicks</h3>
              <p className="text-gray-600">Monitor how many people click on your shortened links.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Copy className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Sharing</h3>
              <p className="text-gray-600">Copy and share your short URLs across all platforms.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
