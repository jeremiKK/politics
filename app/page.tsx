'use client';
import { useState } from 'react';

export default function Home() {
  // State for leader details (static display, no upload needed)
  const [leaderName] = useState('Hon. Caleb Amisi Luyai');
  const [leaderTitle] = useState('PRM Commander-in-Chief');
  const [leaderQuote] = useState(
    'True power belongs to the people. Together, we are building a movement founded on equity, integrity, and absolute accountability.'
  );

  // Modal / View Switcher State for Access Control Flow
  const [activeModal, setActiveModal] = useState<'none' | 'login' | 'register'>('none');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [memberPhoto, setMemberPhoto] = useState<string | null>(null);

  // Handle member registration photo preview
  const handleMemberPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMemberPhoto(imageUrl);
    }
  };

  // Mock Login Handler
  const handleLoginSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert('Please fill in all login details.');
      return;
    }
    window.location.href = '/dashboard';
  };

  // Mock Registration Handler
  const handleRegisterSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regPassword) {
      alert('Please fill out all mandatory movement credentials.');
      return;
    }
    alert('Movement registration submitted successfully! Awaiting administrative verification before dashboard access.');
    setActiveModal('login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between relative">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Logo Display (mp1.jpeg) - Using object-contain to fit perfectly */}
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center border border-amber-500 shadow-md p-0.5">
            <img src="/mp1.jpeg" alt="PRM Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold tracking-wide text-lg">People’s Renaissance Movement</span>
        </div>
        <div className="flex gap-4 items-center">
          {/* Member Login Triggers Controlled Access Modal */}
          <button
            type="button"
            onClick={() => setActiveModal('login')}
            className="text-sm font-medium hover:text-amber-400 transition bg-transparent border-none cursor-pointer text-white"
          >
            Member Login
          </button>

          {/* Join Movement Trigger Direct Credential Form Modal */}
          <button
            type="button"
            onClick={() => setActiveModal('register')}
            className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-400 transition shadow-lg cursor-pointer"
          >
            Join Movement
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-blue-900 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-blue-700">
            Official 2027 Movement Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            Economic Liberation & Social Justice for All.
          </h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Welcome to the official digital hub of the People’s Renaissance Movement (PRM). Stand with our Party Leader in reshaping governance, fostering transparency, and empowering grassroots communities.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setActiveModal('register')}
              className="bg-amber-500 text-slate-950 px-8 py-4 rounded-xl font-extrabold text-base hover:bg-amber-400 transition shadow-xl text-center cursor-pointer"
            >
              Join Campaign Movement
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('login')}
              className="bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-xl font-bold text-base hover:bg-slate-700 transition text-center cursor-pointer"
            >
              Access Portal
            </button>
          </div>
        </div>

        {/* Leader Feature Card (mp.jpeg) */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-bl-xl uppercase z-10">
            Party Leader
          </div>

          {/* Leader Photo Display (mp.jpeg) - Using object-contain so full photo fits without clipping */}
          <div className="w-full h-80 bg-slate-950 rounded-xl mb-6 overflow-hidden flex items-center justify-center border-2 border-amber-500/45 relative">
            <img src="/mp.jpeg" alt={leaderName} className="w-full h-full object-contain" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{leaderName}</h3>
            <p className="text-sm text-amber-400 font-medium mb-3">{leaderTitle}, PRM Party</p>
            <p className="text-sm text-slate-300 italic">
              &ldquo;{leaderQuote}&rdquo;
            </p>
          </div>
        </div>
      </main>

      {/* SECURE ACCESS OVERLAY MODAL */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold bg-transparent border-none cursor-pointer"
            >
              ✕
            </button>

            {/* LOGIN VIEW */}
            {activeModal === 'login' && (
              <div>
                <div className="text-center mb-6">
                  <span className="bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded text-xs uppercase tracking-wider">Secure Portal</span>
                  <h2 className="text-2xl font-extrabold text-white mt-2">Member Login</h2>
                  <p className="text-xs text-slate-400 mt-1">Authenticate to access your verified PRM dashboard</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 text-slate-950 py-3 rounded-lg font-extrabold text-sm hover:bg-amber-400 transition shadow-lg mt-2 cursor-pointer"
                  >
                    LOGIN TO DASHBOARD
                  </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-700/60 pt-4">
                  <p className="text-xs text-slate-400">
                    Not a registered supporter yet?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveModal('register')}
                      className="text-amber-400 font-bold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Register for Movement
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* REGISTER / JOIN MOVEMENT VIEW */}
            {activeModal === 'register' && (
              <div>
                <div className="text-center mb-6">
                  <span className="bg-blue-900 text-amber-400 font-bold px-2.5 py-0.5 rounded text-xs uppercase tracking-wider border border-blue-700">Grassroots Vetting</span>
                  <h2 className="text-2xl font-extrabold text-white mt-2">Join PRM Movement</h2>
                  <p className="text-xs text-slate-400 mt-1">Provide your credentials and photo for party enrollment</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  <div>
                    <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      id="reg-fullname"
                      type="text"
                      required
                      placeholder="e.g., Jane Atieno"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      id="reg-phone"
                      type="text"
                      placeholder="+254 700 000000"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <input
                      id="reg-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-photo" className="block text-xs font-semibold text-slate-300 mb-1">Upload Member Photo / Credential</label>
                    <div className="flex items-center gap-3">
                      {memberPhoto && <img src={memberPhoto} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-amber-500" />}
                      <input
                        id="reg-photo"
                        type="file"
                        accept="image/*"
                        onChange={handleMemberPhotoChange}
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 text-slate-950 py-3 rounded-lg font-extrabold text-sm hover:bg-amber-400 transition shadow-lg mt-3 cursor-pointer"
                  >
                    SUBMIT MOVEMENT CREDENTIALS
                  </button>
                </form>

                <div className="mt-4 text-center border-t border-slate-700/60 pt-3">
                  <p className="text-xs text-slate-400">
                    Already an approved member?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveModal('login')}
                      className="text-amber-400 font-bold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Member Login
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        &copy; 2026 People’s Renaissance Movement (PRM). All rights reserved.
      </footer>
    </div>
  );
}