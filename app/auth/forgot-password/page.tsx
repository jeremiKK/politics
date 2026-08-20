"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordReset = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Sends secure password reset verification to the user's Google/registered email
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError?.code === 'auth/user-not-found') {
        setErrorMessage('No account found associated with this email address.');
      } else {
        setErrorMessage(firebaseError?.message || 'Failed to send recovery email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex items-center gap-3 bg-transparent border-none cursor-pointer text-left p-0"
        >
          <div className="bg-amber-500 text-black font-black px-3 py-1.5 rounded text-sm tracking-wider shadow">
            PRM
          </div>
          <span className="font-bold tracking-tight text-sm md:text-base text-white">
            People's Renaissance Movement
          </span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-xs md:text-sm font-semibold text-slate-400 hover:text-amber-400 transition bg-transparent border-none cursor-pointer"
        >
          ← Back to Home
        </button>
      </nav>

      {/* Main Form Container */}
      <div className="flex items-center justify-center px-4 py-12 flex-1">
        <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-2xl p-8 shadow-2xl relative">

          {!submitted ? (
            <div>
              <div className="text-center mb-6">
                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                  Secure Account Recovery
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white mt-3">Reset Your Password</h1>
                <p className="text-xs md:text-sm text-slate-400 mt-2 leading-relaxed">
                  Enter your Google-associated or registered email address below. We will send you a secure link to recover your account credentials.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-semibold text-center">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label htmlFor="recovery-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500 transition shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3.5 rounded-xl font-extrabold text-sm transition shadow-lg mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Sending Recovery Link...</span>
                    </>
                  ) : (
                    'SEND RECOVERY LINK / OTP'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-slate-800/80 pt-5">
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <span>Remembered your password?</span>
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="text-amber-400 font-bold hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                ✓
              </div>
              <h2 className="text-2xl font-extrabold text-white">Check Your Inbox</h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                We have successfully sent a password reset link to{' '}
                <strong className="text-amber-400 font-bold">{email}</strong>. Please check your spam or inbox folders to proceed.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="w-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 py-3.5 rounded-xl font-bold text-sm transition cursor-pointer shadow"
                >
                  Back to Portal Home
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-[#0b0f19]">
        &copy; 2026 People’s Renaissance Movement (PRM). All rights reserved.
      </footer>
    </main>
  );
}