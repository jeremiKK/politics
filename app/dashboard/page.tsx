'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'issues'>('pending');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert('Unauthorized access! Admin privileges required.');
        window.location.href = '/';
        return;
      }

      setAdminUser({ email: user.email, uid: user.uid });
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const loadedUsers = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
      setUsers(loadedUsers);
    });

    const unsubIssues = onSnapshot(collection(db, 'issues'), (snapshot) => {
      const loadedIssues = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
      setIssues(loadedIssues);
    });

    return () => {
      unsubscribeAuth();
      unsubUsers();
      unsubIssues();
    };
  }, []);

  const handleApproveUser = async (docId: string, email: string) => {
    try {
      const userRef = doc(db, 'users', docId);
      await updateDoc(userRef, { status: 'Approved' });
      alert(`Member account for ${email} has been successfully verified and approved!`);
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (docId: string, email: string) => {
    try {
      await deleteDoc(doc(db, 'users', docId));
      alert(`Member account for ${email} has been rejected and removed.`);
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleApproveIssue = async (issueId: string) => {
    try {
      const issueRef = doc(db, 'issues', issueId);
      await updateDoc(issueRef, { status: 'Resolved & Approved' });
      alert('Grassroots issue status updated to Resolved.');
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  if (!adminUser) return null;

  const pendingUsers = users.filter((u) => u.status === 'Pending' || !u.status);
  const verifiedUsers = users.filter((u) => u.status === 'Approved');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col selection:bg-amber-500 selection:text-black">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-black font-black px-3 py-1.5 rounded text-sm tracking-wider shadow">PRM</div>
          <div>
            <span className="font-bold tracking-tight text-sm md:text-base text-white block">Central Command Admin Portal</span>
            <span className="text-[10px] text-slate-400">Firebase Firestore Synced</span>
          </div>
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

      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">{pendingUsers.length}</h3>
            </div>
          </div>
          <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Members</p>
              <h3 className="text-3xl font-black text-green-400 mt-1">{verifiedUsers.length}</h3>
            </div>
          </div>
          <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grassroots Issues</p>
              <h3 className="text-3xl font-black text-blue-400 mt-1">{issues.length}</h3>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`pb-3 text-xs md:text-sm font-bold tracking-wide border-b-2 transition cursor-pointer px-2 ${
              activeTab === 'pending' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Pending Registrations ({pendingUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verified')}
            className={`pb-3 text-xs md:text-sm font-bold tracking-wide border-b-2 transition cursor-pointer px-2 ${
              activeTab === 'verified' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Verified Members Directory ({verifiedUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`pb-3 text-xs md:text-sm font-bold tracking-wide border-b-2 transition cursor-pointer px-2 ${
              activeTab === 'issues' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Community Issues & Grievances ({issues.length})
          </button>
        </div>

        {/* Tab 1: Pending Registrations */}
        {activeTab === 'pending' && (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Pending Supporter Vetting</h3>
              <p className="text-xs text-slate-400 mt-0.5">Review credentials submitted by applicants before granting portal access.</p>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-500">No pending registration requests at this time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-amber-400 uppercase tracking-wider">
                      <th className="p-3">Supporter Photo</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">National ID</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {pendingUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-3">
                          <img src={u.photo || '/mp1.jpeg'} alt="Applicant" className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow" />
                        </td>
                        <td className="p-3 font-semibold text-white">{u.fullName}</td>
                        <td className="p-3 text-slate-300">{u.email}</td>
                        <td className="p-3 text-amber-400 font-bold">{u.nationalId}</td>
                        <td className="p-3 text-slate-300">{u.phone || 'N/A'}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleApproveUser(u.id, u.email)}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectUser(u.id, u.email)}
                            className="bg-red-600/25 hover:bg-red-600 text-red-400 hover:text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer border border-red-600/40"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Verified Members Directory */}
        {activeTab === 'verified' && (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Verified Movement Directory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Complete record of fully vetted members.</p>
            </div>
            {verifiedUsers.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-500">No verified members registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {verifiedUsers.map((u) => (
                  <div key={u.id} className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow">
                    <img src={u.photo || '/mp1.jpeg'} alt="Verified" className="w-14 h-14 rounded-full object-cover border-2 border-green-500/40" />
                    <div className="overflow-hidden space-y-0.5">
                      <h4 className="font-bold text-sm text-white truncate">{u.fullName}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                      <span className="text-[10px] text-amber-400 font-bold block">ID: {u.nationalId}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Community Issues & Grievances */}
        {activeTab === 'issues' && (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Grassroots Issues & Grievances</h3>
              <p className="text-xs text-slate-400 mt-0.5">Inquiries submitted by registered members.</p>
            </div>
            {issues.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-500">No issues submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div key={issue.id} className="bg-[#0b0f19] border border-slate-800 p-4 rounded-xl flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white">{issue.title}</h4>
                      <p className="text-xs text-slate-300">{issue.description}</p>
                      <span className="text-[10px] text-slate-500">By: {issue.userName} ({issue.userEmail})</span>
                    </div>
                    <div>
                      {!issue.status?.includes('Resolved') && (
                        <button
                          type="button"
                          onClick={() => handleApproveIssue(issue.id)}
                          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}