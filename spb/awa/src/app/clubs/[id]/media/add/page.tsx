'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';

export default function AddClubMediaPage({ params }: { params: { id: string } }) {
  const [filePath, setFilePath] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFileType(e.target.value);
  };

  const handleFilePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFilePath(url);
    setPreview(url);
  };

  const generateHash = () => {
    // Simple hash generation for demo purposes
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!filePath) {
      setError('File path is required');
      setLoading(false);
      return;
    }

    if (!fileType) {
      setError('File type is required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const mediaData = {
        file_path: filePath,
        file_type: fileType,
        hash: generateHash(),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.id}/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/clubs/${params.id}?tab=media`);
      } else {
        setError(data.message || 'Failed to add media');
      }
    } catch (err) {
      setError('An error occurred while adding media');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Add Media to Club">
      <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add Media to Club</h1>
        <Link
          href={`/clubs/${params.id}`}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-500">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="filePath" className="mb-2 block text-sm font-medium text-gray-700">
              Image URL *
            </label>
            <input
              type="text"
              id="filePath"
              value={filePath}
              onChange={handleFilePathChange}
              required
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="fileType" className="mb-2 block text-sm font-medium text-gray-700">
              File Type *
            </label>
            <select
              id="fileType"
              value={fileType}
              onChange={handleFileTypeChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="">Select file type</option>
              <option value="jpg">JPG</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="gif">GIF</option>
              <option value="webp">WEBP</option>
            </select>
          </div>

          {preview && (
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-gray-700">Preview</h2>
              <div className="overflow-hidden rounded-lg border">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-64 w-full object-contain"
                  onError={() => {
                    setPreview(null);
                    setError('Invalid image URL or the image cannot be loaded');
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Link
              href={`/clubs/${params.id}`}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Adding...' : 'Add Media'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </MainLayout>
  );
}
