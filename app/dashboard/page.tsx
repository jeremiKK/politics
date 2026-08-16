'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'issues'>('pending');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('prm_current_user') || 'null');
    
    // Security Guard: Prevent normal users or unauthenticated visitors from accessing Admin URL
    if (!currentUser || currentUser?.role !== 'admin') {
      alert('Unauthorized access! Admin privileges required.');
      window.location.href = '/';
      return;
    }

    setAdminUser(currentUser);
    loadData();
  }, []);

  const loadData = () => {
    const loadedUsers = JSON.parse(localStorage.getItem('prm_users') || '[]');
    const loadedIssues = JSON.parse(localStorage.getItem('prm_issues') || '[]');
    setUsers(loadedUsers);
    setIssues(loadedIssues);
  };

  const handleApproveUser = (email: string) => {
    const updatedUsers = users.map((u) => {
      if (u.email === email) {
        return { ...u, status: 'Approved' };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('prm_users', JSON.stringify(updatedUsers));
    alert(`Member account for ${email} has been successfully verified and approved!`);
  };

  const handleRejectUser = (email: string) => {
    const updatedUsers = users.filter((u) => u.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem('prm_users', JSON.stringify(updatedUsers));
    alert(`Member account for ${email} has been rejected and removed.`);
  };

  const handleApproveIssue = (id: number) => {
    const updatedIssues = issues.map((i) => {
      if (i.id === id) {
        return { ...i, status: 'Resolved & Approved' };
      }
      return i;
    });
    setIssues(updatedIssues);
    localStorage.setItem('prm_issues', JSON.stringify(updatedIssues));
    alert('Grassroots issue status updated to Resolved.');
  };

  const handleLogout = () => {
    localStorage.removeItem('prm_current_user');
    window.location.href = '/';
  };

  if (!adminUser) return null;

  const pendingUsers = users.filter((u) => u.status === 'Pending' || !u.status);
  const verifiedUsers = users.filter((u) => u.status === 'Approved');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Professional Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-black font-black px-3 py-1.5 rounded text-sm tracking-wider shadow">
            PRM
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm md:text-base text-white block">
              Central Command Admin Portal
            </span>
            <span className="text-[10px] text-slate-400">Restricted Security Clearance</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-300">{adminUser.email} (Admin)</span>
          </div>
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
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">{pendingUsers.length}</h3>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-400">⏳</div>
          </div>

          <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Members</p>
              <h3 className="text-3xl font-black text-green-400 mt-1">{verifiedUsers.length}</h3>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-green-400">🛡️</div>
          </div>

          <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grassroots Issues</p>
              <h3 className="text-3xl font-black text-blue-400 mt-1">{issues.length}</h3>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-blue-400">📋</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`pb-3 text-xs md:text-sm font-bold tracking-wide border-b-2 transition cursor-pointer px-2 ${
              activeTab === 'pending'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Pending Registrations ({pendingUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verified')}
            className={`pb-3 text-xs md:text-sm font-bold tracking-wide border-b-2 transition cursor-pointer px-2 ${
              activeTab === 'verified'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Verified Members Directory ({verifiedUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`pb-3 text-xs md:text-sm font-bold tracking-wide border-b-2 transition cursor-pointer px-2 ${
              activeTab === 'issues'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
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
              <p className="text-xs text-slate-400 mt-0.5">Review credentials, National IDs, and photos submitted by applicants before granting portal access.</p>
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
                      <th className="p-3">Role</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {pendingUsers.map((u) => (
                      <tr key={u.email || u.nationalId} className="hover:bg-slate-900/40 transition">
                        <td className="p-3">
                          <img src={u.photo || '/mp1.jpeg'} alt="Applicant" className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow" />
                        </td>
                        <td className="p-3 font-semibold text-white">{u.fullName}</td>
                        <td className="p-3 text-slate-300">{u.email}</td>
                        <td className="p-3 text-amber-400 font-bold">{u.nationalId}</td>
                        <td className="p-3 text-slate-300">{u.phone || 'N/A'}</td>
                        <td className="p-3">
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{u.role || 'user'}</span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleApproveUser(u.email)}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectUser(u.email)}
                            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer border border-red-600/40"
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
              <p className="text-xs text-slate-400 mt-0.5">Complete record of all fully vetted members with active system access.</p>
            </div>

            {verifiedUsers.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-500">No verified members registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {verifiedUsers.map((u) => (
                  <div key={u.email || u.nationalId} className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow">
                    <img src={u.photo || '/mp1.jpeg'} alt="Verified" className="w-14 h-14 rounded-full object-cover border-2 border-green-500/40" />
                    <div className="overflow-hidden space-y-0.5">
                      <h4 className="font-bold text-sm text-white truncate">{u.fullName}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-amber-400 font-bold">ID: {u.nationalId}</span>
                        <span className="bg-green-500/10 text-green-400 text-[9px] font-bold px-2 py-0.2 rounded uppercase border border-green-500/20">Verified</span>
                      </div>
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
              <p className="text-xs text-slate-400 mt-0.5">Inquiries and developmental concerns submitted by registered members.</p>
            </div>

            {issues.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-500">No issues submitted by members yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div key={issue.id} className="bg-[#0b0f19] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{issue.title}</h4>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">By: {issue.userName} ({issue.userEmail})</span>
                      </div>
                      <p className="text-xs text-slate-300">{issue.description}</p>
                      <span className="text-[10px] text-slate-500 block">Submitted on: {issue.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        issue.status.includes('Resolved') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {issue.status}
                      </span>
                      {!issue.status.includes('Resolved') && (
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