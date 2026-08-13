'use client';
import { useState } from 'react';

export default function Home() {
  // State for leader details (removed unused setter assignments to resolve SonarLint S1854)
  const leaderName = 'Hon. Caleb Amisi Luyai';
  const leaderTitle = 'PRM Commander-in-Chief';
  const leaderQuote =
    'True power belongs to the people. Together, we are building a movement founded on equity, integrity, and absolute accountability.';
  
  const [leaderPhoto, setLeaderPhoto] = useState<string>('/mp.jpeg');

  // Handle Leader Photo Upload / Update
  const handleLeaderPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLeaderPhoto(imageUrl);
    }
  };

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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative selection:bg-red-600 selection:text-white">
      {/* Top Professional Navigation Bar matching logo colors */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full border-b border-blue-900/40 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white overflow-hidden flex items-center justify-center border-2 border-red-600 shadow-md p-0.5">
            <img src="/mp1.jpeg" alt="PRM Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-black tracking-wider text-base md:text-lg block text-white">PEOPLE'S RENAISSANCE MOVEMENT</span>
            <span className="text-[10px] tracking-widest text-red-500 font-bold uppercase block">The Change We Need</span>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={() => setActiveModal('login')}
            className="text-xs md:text-sm font-semibold hover:text-red-400 transition bg-transparent border border-blue-800 px-3.5 py-2 rounded-lg cursor-pointer text-slate-200"
          >
            Member Login
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('register')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xs md:text-sm hover:bg-red-700 transition shadow-md cursor-pointer border border-red-500"
          >
            Join Movement
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-950 border border-blue-800 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-inner">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>Official 2027 Movement Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
            Economic Liberation & <span className="text-red-600">Social Justice</span> for All.
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Welcome to the official digital headquarters of the People’s Renaissance Movement (PRM). Stand with our leadership in reshaping governance, fostering transparency, and empowering grassroots communities nationwide.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal('register')}
              className="bg-red-600 text-white px-7 py-3.5 rounded-xl font-extrabold text-sm hover:bg-red-700 transition shadow-xl text-center cursor-pointer border border-red-500"
            >
              Join Campaign Movement
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('login')}
              className="bg-blue-900/40 text-blue-200 border border-blue-700/60 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-900/70 transition text-center cursor-pointer"
            >
              Access Portal
            </button>
          </div>
        </div>

        {/* Dynamic Editable Leader Feature Card */}
        <div className="bg-slate-900 border border-blue-900/60 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-bl-xl uppercase tracking-wider z-10 shadow-md">
            Party Leader
          </div>

          {/* Leader Photo Display with dynamic upload capability */}
          <div className="w-full h-72 md:h-80 bg-slate-950 rounded-xl mb-6 overflow-hidden flex items-center justify-center border-2 border-blue-800/60 relative group/img shadow-inner">
            <img src={leaderPhoto} alt={leaderName} className="w-full h-full object-contain" />
            
            {/* Quick Upload Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
              <label htmlFor="leader-photo-upload" className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-4 rounded-lg cursor-pointer shadow-lg transition border border-red-500">
                Change Leader Photo
              </label>
              <input 
                id="leader-photo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleLeaderPhotoChange} 
                className="hidden" 
              />
              <span className="text-[10px] text-slate-300 mt-2">Upload any portrait image instantly</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-wide">{leaderName}</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-red-500">{leaderTitle} — PRM Party</p>
            <p className="text-sm text-slate-300 italic pt-1 border-t border-slate-800">
              &ldquo;{leaderQuote}&rdquo;
            </p>
          </div>
        </div>
      </main>

      {/* SECURE ACCESS OVERLAY MODAL */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-900/60 w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
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
                  <span className="bg-red-600 text-white font-black px-2.5 py-0.5 rounded text-xs uppercase tracking-wider">Secure Portal</span>
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-red-600"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-extrabold text-sm hover:bg-red-700 transition shadow-lg mt-2 cursor-pointer border border-red-500"
                  >
                    LOGIN TO DASHBOARD
                  </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-800 pt-4">
                  <p className="text-xs text-slate-400">
                    Not a registered supporter yet?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveModal('register')}
                      className="text-red-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
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
                  <span className="bg-blue-900 text-blue-200 font-bold px-2.5 py-0.5 rounded text-xs uppercase tracking-wider border border-blue-700">Grassroots Vetting</span>
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-600"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-600"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-600"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-photo" className="block text-xs font-semibold text-slate-300 mb-1">Upload Member Photo / Credential</label>
                    <div className="flex items-center gap-3">
                      {memberPhoto && <img src={memberPhoto} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-red-600" />}
                      <input
                        id="reg-photo"
                        type="file"
                        accept="image/*"
                        onChange={handleMemberPhotoChange}
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-extrabold text-sm hover:bg-red-700 transition shadow-lg mt-3 cursor-pointer border border-red-500"
                  >
                    SUBMIT MOVEMENT CREDENTIALS
                  </button>
                </form>

                <div className="mt-4 text-center border-t border-slate-800 pt-3">
                  <p className="text-xs text-slate-400">
                    Already an approved member?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveModal('login')}
                      className="text-red-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
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
      <footer className="border-t border-blue-950 py-6 text-center text-xs text-slate-500 bg-slate-950">
        &copy; 2026 People’s Renaissance Movement (PRM). All rights reserved. The Change We Need.
      </footer>
    </div>
  );
}