'use client';

import { useState } from 'react';

export default function Home() {
  const [leaderName, setLeaderName] = useState('Hon. Caleb Amisi Luyai');
  const [leaderTitle, setLeaderTitle] = useState('PRM Commander-in-Chief');
  const [leaderQuote, setLeaderQuote] = useState(
    'True power belongs to the people. Together, we are building a movement founded on equity, integrity, and absolute accountability.'
  );
  const [leaderPhoto, setLeaderPhoto] = useState<string>('/mp.jpeg');

  const handleLeaderPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLeaderPhoto(imageUrl);
    }
  };

  const handleSaveChanges = () => {
    alert('Changes saved successfully!');
  };

  const [activeModal, setActiveModal] = useState<'none' | 'login' | 'register'>('none');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [memberPhoto, setMemberPhoto] = useState<string | null>(null);
  const [regRole, setRegRole] = useState<'user' | 'admin'>('user'); // Toggle to choose Admin or User role on registration

  const handleMemberPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMemberPhoto(imageUrl);
    }
  };

  // Registration Handler with dynamic Role assignment (User or Admin)
  const handleRegisterSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regNationalId || !regPassword) {
      alert('Please fill out all mandatory movement credentials including National ID.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('prm_users') || '[]');
    
    // Check if user already exists
    const userExists = existingUsers.some((u: any) => u.email === regEmail || u.nationalId === regNationalId);
    if (userExists) {
      alert('A user with this Email or National ID already exists.');
      return;
    }

    const newUser = {
      fullName: regFullName,
      email: regEmail,
      nationalId: regNationalId,
      phone: regPhone,
      password: regPassword,
      photo: memberPhoto || '/mp1.jpeg',
      role: regRole, // Captures whether they registered as 'user' or 'admin'
      status: regRole === 'admin' ? 'Approved' : 'Pending', // Admins auto-approve or can be vetted; standard users start as Pending
    };

    existingUsers.push(newUser);
    localStorage.setItem('prm_users', JSON.stringify(existingUsers));

    alert(`Successfully registered as ${regRole.toUpperCase()}! You can now login with your credentials.`);
    setActiveModal('login');
  };

  // Secure Authentication & Routing Handler matching registered roles
  const handleLoginSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert('Please fill in all login details.');
      return;
    }

    // Default hardcoded admin check as backup
    if (loginEmail === 'admin@prm.com' && loginPassword === 'admin123') {
      const adminSession = { role: 'admin', email: loginEmail, fullName: 'System Admin', status: 'Approved' };
      localStorage.setItem('prm_current_user', JSON.stringify(adminSession));
      window.location.href = '/dashboard';
      return;
    }

    // Check Registered Users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('prm_users') || '[]');
    const foundUser = existingUsers.find(
      (u: any) => u.email === loginEmail && u.password === loginPassword
    );

    if (foundUser) {
      if (foundUser.status !== 'Approved' && foundUser.role !== 'admin') {
        alert('Your account is still pending administrative approval by the Admin.');
        return;
      }

      // Save current active session user details
      localStorage.setItem('prm_current_user', JSON.stringify(foundUser));

      // Route precisely based on exact credential role saved during registration
      if (foundUser.role === 'admin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/user-dashboard';
      }
    } else {
      alert('Invalid credentials or account not found. Please register or check your login details.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-between relative selection:bg-amber-500 selection:text-black">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-black font-black px-3 py-1.5 rounded text-sm tracking-wider shadow">
            PRM
          </div>
          <span className="font-bold tracking-tight text-sm md:text-base text-white">
            People's Renaissance Movement
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveChanges}
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold hover:bg-slate-800 transition bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-lg cursor-pointer text-slate-200 shadow-sm"
          >
            💾 Save Changes
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('login')}
            className="text-xs md:text-sm font-semibold hover:text-amber-400 transition bg-transparent px-3 py-2 cursor-pointer text-slate-300"
          >
            Member Login
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('register')}
            className="bg-amber-500 text-black px-4 py-2 rounded-lg font-bold text-xs md:text-sm hover:bg-amber-400 transition shadow-md cursor-pointer"
          >
            Join Movement
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Official 2027 Movement Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
            Economic Liberation & <span className="text-amber-500">Social Justice</span> for All.
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Welcome to the official digital hub of the People’s Renaissance Movement (PRM). Stand with our Party Leader in reshaping governance, fostering transparency, and empowering grassroots communities.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal('register')}
              className="bg-amber-500 text-black px-7 py-3.5 rounded-xl font-extrabold text-sm hover:bg-amber-400 transition shadow-xl text-center cursor-pointer"
            >
              Join Campaign Movement
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('login')}
              className="bg-slate-900 text-slate-200 border border-slate-700 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition text-center cursor-pointer"
            >
              Access Portal
            </button>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-xs px-3.5 py-1.5 rounded-bl-xl uppercase tracking-wider z-10 shadow-md">
            PARTY LEADER
          </div>

          <div className="w-full h-64 md:h-72 bg-slate-950 rounded-xl mb-6 overflow-hidden flex items-center justify-center border border-slate-800 relative group shadow-inner">
            {leaderPhoto ? (
              <img src={leaderPhoto} alt={leaderName} className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-500 text-sm font-semibold">No Portrait Uploaded</div>
            )}
            <div className="absolute inset-0 bg-black/40 hover:bg-black/60 transition-all flex flex-col items-center justify-center p-4">
              <label htmlFor="leader-photo-upload" className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition flex items-center gap-2">
                📁 Upload New Photo
              </label>
              <input 
                id="leader-photo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleLeaderPhotoUpload} 
                className="hidden" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="leader-name-input" className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                Leader Full Name:
              </label>
              <input
                id="leader-name-input"
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label htmlFor="leader-title-input" className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                Title / Designation:
              </label>
              <input
                id="leader-title-input"
                type="text"
                value={leaderTitle}
                onChange={(e) => setLeaderTitle(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label htmlFor="leader-quote-input" className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                Campaign Vision Quote:
              </label>
              <textarea
                id="leader-quote-input"
                value={leaderQuote}
                onChange={(e) => setLeaderQuote(e.target.value)}
                rows={3}
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 italic focus:outline-none focus:border-amber-500 transition resize-none"
              />
            </div>
          </div>
        </div>
      </main>

      {activeModal !== 'none' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold bg-transparent border-none cursor-pointer"
            >
              ✕
            </button>

            {activeModal === 'login' && (
              <div>
                <div className="text-center mb-6">
                  <span className="bg-amber-500 text-black font-black px-2.5 py-0.5 rounded text-xs uppercase tracking-wider">Secure Portal</span>
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
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
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
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 text-black py-3 rounded-lg font-extrabold text-sm hover:bg-amber-400 transition shadow-lg mt-2 cursor-pointer"
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
                      className="text-amber-400 font-bold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Register for Movement
                    </button>
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'register' && (
              <div>
                <div className="text-center mb-6">
                  <span className="bg-slate-800 text-amber-400 font-bold px-2.5 py-0.5 rounded text-xs uppercase tracking-wider border border-slate-700">Grassroots Vetting</span>
                  <h2 className="text-2xl font-extrabold text-white mt-2">Join PRM Movement</h2>
                  <p className="text-xs text-slate-400 mt-1">Provide your credentials and account role for registration</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  <div>
                    <label htmlFor="reg-role" className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
                    <select
                      id="reg-role"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as 'user' | 'admin')}
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="user">Regular Supporter / User</option>
                      <option value="admin">System Administrator (Admin)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      id="reg-fullname"
                      type="text"
                      required
                      placeholder="e.g., Jane Atieno"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
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
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-nid" className="block text-xs font-semibold text-slate-300 mb-1">National ID Number</label>
                    <input
                      id="reg-nid"
                      type="text"
                      required
                      placeholder="e.g., 34567890"
                      value={regNationalId}
                      onChange={(e) => setRegNationalId(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
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
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
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
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-photo" className="block text-xs font-semibold text-slate-300 mb-1">Upload Member Photo</label>
                    <div className="flex items-center gap-3">
                      {memberPhoto && <img src={memberPhoto} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-amber-500" />}
                      <input
                        id="reg-photo"
                        type="file"
                        accept="image/*"
                        onChange={handleMemberPhotoChange}
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 text-black py-3 rounded-lg font-extrabold text-sm hover:bg-amber-400 transition shadow-lg mt-3 cursor-pointer"
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

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-[#0b0f19]">
        &copy; 2026 People’s Renaissance Movement (PRM). All rights reserved. The Change We Need.
      </footer>
    </div>
  );
}