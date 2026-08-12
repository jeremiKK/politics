'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Verified' | 'Pending Vetting';
}

const initialMembers: Member[] = [
  { id: 1, name: 'Jane Atieno', email: 'jane@example.com', phone: '+254 700 112233', status: 'Verified' },
  { id: 2, name: 'Brian Juma', email: 'brian@example.com', phone: '+254 711 223344', status: 'Pending Vetting' },
  { id: 3, name: 'Amina Mohamed', email: 'amina@example.com', phone: '+254 722 334455', status: 'Verified' },
  { id: 4, name: 'Kevin Wanjala', email: 'kevin@example.com', phone: '+254 733 445566', status: 'Pending Vetting' },
];

export default function MembersDirectoryPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleStatus = (id: number) => {
    setMembers(
      members.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'Verified' ? 'Pending Vetting' : 'Verified' }
          : m
      )
    );
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded text-lg tracking-wider">PRM</span>
          <span className="font-bold tracking-wide text-lg">Members Management</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="bg-slate-800 border border-slate-700 text-amber-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition"
          >
            ← Back to Command Center
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded text-xs uppercase tracking-wider">
              PRM Administration
            </span>
            <h1 className="text-3xl font-black mt-2">Registered Movement Members</h1>
            <p className="text-slate-400 text-sm mt-1">Review, vet, and manage grassroots supporters across all branches.</p>
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="p-4">Full Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Vetting Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-sm text-slate-300">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-750 transition">
                    <td className="p-4 font-bold text-white">{member.name}</td>
                    <td className="p-4">{member.email}</td>
                    <td className="p-4">{member.phone}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          member.status === 'Verified'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleStatus(member.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                          member.status === 'Verified'
                            ? 'bg-slate-700 text-amber-400 hover:bg-slate-600'
                            : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        }`}
                      >
                        {member.status === 'Verified' ? 'Revoke Vetting' : 'Approve Member'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No matching members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        &copy; 2026 People’s Renaissance Movement (PRM). Membership Registry.
      </footer>
    </div>
  );
}