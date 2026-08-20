'use client';

import { useEffect, useState, type SyntheticEvent } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [registeredAccounts, setRegisteredAccounts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = '/';
        return;
      }

      setCurrentUser({ uid: user.uid, email: user.email });
    });

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
      setRegisteredAccounts(usersList);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, []);

  const handleIssueSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!newIssueTitle || !newIssueDesc) {
      alert('Please fill out all fields for your grievance or issue.');
      return;
    }

    try {
      await addDoc(collection(db, 'issues'), {
        title: newIssueTitle,
        description: newIssueDesc,
        userEmail: currentUser.email,
        userName: currentUser.fullName || currentUser.email,
        status: 'Pending Review',
        date: new Date().toLocaleDateString(),
        createdAt: Date.now(),
      });

      setNewIssueTitle('');
      setNewIssueDesc('');
      alert('Grassroots issue submitted successfully to movement leaders.');
    } catch (error) {
      console.error('Error adding issue: ', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col selection:bg-amber-500 selection:text-black relative">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-black font-black px-3 py-1.5 rounded text-sm tracking-wider shadow">PRM</div>
          <span className="font-bold tracking-tight text-sm md:text-base text-white">Supporter Portal & Community Directory</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600/20 text-red-400 border border-red-600/40 px-3.5 py-1.5 rounded-lg font-semibold text-xs hover:bg-red-600 hover:text-white transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-10 flex-1">
        {/* Issue Submission Section */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-xl font-extrabold text-white">Submit a Grassroots Issue</h3>
          <form onSubmit={handleIssueSubmit} className="space-y-4">
            <div>
              <label htmlFor="issueTitleInput" className="block text-xs font-semibold text-slate-400 mb-1">Issue Title</label>
              <input
                id="issueTitleInput"
                type="text"
                value={newIssueTitle}
                onChange={(e) => setNewIssueTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label htmlFor="issueDescInput" className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
              <textarea
                id="issueDescInput"
                value={newIssueDesc}
                onChange={(e) => setNewIssueDesc(e.target.value)}
                placeholder="Describe the issue..."
                rows={3}
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer shadow"
            >
              Submit Issue
            </button>
          </form>
        </div>

        {/* Directory Listing */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xl font-extrabold text-white">Registered Movement Accounts ({registeredAccounts.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {registeredAccounts.map((acc) => (
              <div key={acc.id} className="bg-[#0b0f19] border border-slate-800 p-4 rounded-xl space-y-1">
                <p className="font-bold text-sm text-white">{acc.fullName || 'Member'}</p>
                <p className="text-xs text-slate-400">{acc.email}</p>
                <span className="text-[10px] text-amber-400 font-semibold block">Status: {acc.status || 'Pending'}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}