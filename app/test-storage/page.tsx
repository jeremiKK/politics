"use client";

import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '@/app/lib/firebase'; // Adjust path to your firebase config

const storage = getStorage(app);

export default function TestStoragePage() {
  const [status, setStatus] = useState('Idle');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleTestUpload = async () => {
    setStatus('Uploading...');
    try {
      // Create a small text blob to test upload
      const dummyBlob = new Blob(['Hello Firebase Storage!'], { type: 'text/plain' });
      const storageRef = ref(storage, `test-folder/test-file-${Date.now()}.txt`);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, dummyBlob);
      console.log('Uploaded a blob or file!', snapshot);

      // Get download URL
      const url = await getDownloadURL(snapshot.ref);
      setDownloadUrl(url);
      setStatus('Success! File uploaded & URL retrieved.');
    } catch (error: any) {
      console.error('Storage error:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white p-12 flex flex-col items-center justify-center">
      <div className="bg-[#111827] border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-4 text-center">
        <h1 className="text-xl font-bold">Firebase Storage Connection Test</h1>
        <p className="text-xs text-slate-400">Click below to test uploading a dummy file to Firebase Storage.</p>
        
        <button
          type="button"
          onClick={handleTestUpload}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold text-sm transition cursor-pointer"
        >
          Test Storage Upload
        </button>

        <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
          <strong>Status:</strong> {status}
        </div>

        {downloadUrl && (
          <div className="text-xs text-amber-400 break-all">
            <strong>Download URL:</strong> <a href={downloadUrl} target="_blank" rel="noreferrer" className="underline">{downloadUrl}</a>
          </div>
        )}
      </div>
    </main>
  );
}