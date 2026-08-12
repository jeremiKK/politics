'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats] = useState({
    totalMembers: 1420,
    pendingVetting: 35,
    activeCampaigns: 4,
    regionCoverage: 'Bungoma & National'
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded text-lg tracking-wider">PRM</span>
          <span className="font-bold tracking-wide text-lg">Admin Control Center</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/members"
            className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-400 transition shadow-lg"
          >
            View Members Directory →
          </Link>
          <Link
            href="/"
            className="text-xs bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-300 font-semibold hover:bg-slate-700 transition"
          >
            Logout / Home
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <span className="bg-blue-900 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-700">
            Secure Session Active
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">
            Movement Command Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time analytics, grassroots membership oversight, and campaign logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Registered Members</p>
            <h3 className="text-3xl font-black text-amber-400 mt-2">{stats.totalMembers.toLocaleString()}</h3>
            <span className="text-xs text-emerald-400 mt-2 inline-block">↑ +12% this week</span>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pending Vetting</p>
            <h3 className="text-3xl font-black text-blue-400 mt-2">{stats.pendingVetting}</h3>
            <span className="text-xs text-slate-400 mt-2 inline-block">Requires review</span>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Campaigns</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-2">{stats.activeCampaigns}</h3>
            <span className="text-xs text-slate-400 mt-2 inline-block">Regional deployment</span>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Jurisdiction</p>
            <h3 className="text-xl font-black text-purple-400 mt-3">{stats.regionCoverage}</h3>
            <span className="text-xs text-slate-400 mt-2 inline-block">Fully synchronized</span>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-xl font-bold">Manage Grassroots Vetting & Members</h2>
            <p className="text-sm text-slate-400 mt-1">
              Verify incoming registration profiles, accept new movement supporters, and monitor communication lists.
            </p>
          </div>
          <Link
            href="/dashboard/members"
            className="bg-amber-500 text-slate-950 px-6 py-3 rounded-xl font-extrabold text-sm hover:bg-amber-400 transition shadow-lg whitespace-nowrap text-center"
          >
            Open Members Directory
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        &copy; 2026 People’s Renaissance Movement (PRM). Administrative Portal.
      </footer>
    </div>
  );
}