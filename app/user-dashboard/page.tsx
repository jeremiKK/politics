'use client';

import { useEffect, useState, useRef, type SyntheticEvent } from 'react';

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [registeredAccounts, setRegisteredAccounts] = useState<any[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  // Meeting & Interactive Streaming states
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [meetingType, setMeetingType] = useState<'audio' | 'video'>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [audioDevice, setAudioDevice] = useState<'speaker' | 'bluetooth' | 'earpiece'>('speaker');
  const [meetingSeconds, setMeetingSeconds] = useState(0);
  const [displayMode, setDisplayMode] = useState<'face' | 'initial'>('face');
  const [participants, setParticipants] = useState<any[]>([]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('prm_current_user') || 'null');
    
    // Security Guard: Restrict access exclusively to verified standard users
    if (!userSession || userSession?.role !== 'user') {
      window.location.href = '/';
      return;
    }

    setCurrentUser(userSession);

    // Load registered accounts from local storage with persistent image fallback support
    const allUsers = JSON.parse(localStorage.getItem('prm_users') || '[]');
    setRegisteredAccounts(allUsers);
  }, []);

  // Timer effect for live active meeting
  useEffect(() => {
    let interval: any = null;
    if (isInMeeting) {
      interval = setInterval(() => {
        setMeetingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setMeetingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isInMeeting]);

  // Manage media stream when meeting starts or camera toggles
  useEffect(() => {
    if (isInMeeting && meetingType === 'video' && !isCameraOff) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Fallback if camera permission is denied or unavailable
          setIsCameraOff(true);
        });
    } else if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isInMeeting, meetingType, isCameraOff]);

  const startMeeting = (type: 'audio' | 'video') => {
    setMeetingType(type);
    setIsInMeeting(true);
    setIsMuted(false);
    setIsCameraOff(type === 'audio');
    setDisplayMode('face');

    // Simulate active participants joining the interactive room session preserving stored images
    const mockPeers = registeredAccounts.slice(0, 3).map((acc, idx) => ({
      id: idx + 1,
      name: acc.fullName,
      initial: acc.fullName.charAt(0).toUpperCase(),
      isSpeaking: idx === 0,
      muted: idx % 2 === 0,
      avatar: acc.photo || '/mp1.jpeg',
    }));
    setParticipants(mockPeers);
  };

  const endMeeting = () => {
    setIsInMeeting(false);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleCamera = () => {
    setIsCameraOff((prev) => !prev);
  };

  const cycleAudioOutput = () => {
    const devices: ('speaker' | 'bluetooth' | 'earpiece')[] = ['speaker', 'bluetooth', 'earpiece'];
    const nextIndex = (devices.indexOf(audioDevice) + 1) % devices.length;
    setAudioDevice(devices[nextIndex]);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Share Stream Link functionality
  const handleCopyStreamLink = () => {
    const streamUrl = window.location.href;
    navigator.clipboard.writeText(streamUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PRM Live Movement Conference',
          text: 'Join our secure live stream meeting now!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopyStreamLink();
    }
  };

  const handleIssueSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!newIssueTitle || !newIssueDesc) {
      alert('Please fill out all fields for your grievance or issue.');
      return;
    }

    const allIssues = JSON.parse(localStorage.getItem('prm_issues') || '[]');
    const newIssue = {
      id: Date.now(),
      title: newIssueTitle,
      description: newIssueDesc,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      status: 'Pending Review',
      date: new Date().toLocaleDateString(),
    };

    const updatedIssues = [newIssue, ...allIssues];
    localStorage.setItem('prm_issues', JSON.stringify(updatedIssues));

    setNewIssueTitle('');
    setNewIssueDesc('');
    alert('Grassroots issue submitted successfully to movement leaders.');
  };

  const handleLogout = () => {
    localStorage.removeItem('prm_current_user');
    window.location.href = '/';
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col selection:bg-amber-500 selection:text-black relative">
      {/* Top Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-black font-black px-3 py-1.5 rounded text-sm tracking-wider shadow">
            PRM
          </div>
          <span className="font-bold tracking-tight text-sm md:text-base text-white">
            Supporter Portal & Community Directory
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <img src={currentUser.photo || '/mp1.jpeg'} alt="User" className="w-8 h-8 rounded-full object-cover border border-amber-500" />
            <span className="text-xs font-semibold text-slate-300">{currentUser.fullName}</span>
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

      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-10 flex-1">
        {/* Live Conference & Meeting Launch Bar with Share Options */}
        <div className="bg-gradient-to-r from-amber-500/10 via-[#111827] to-[#111827] border border-amber-500/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <h3 className="text-lg font-black text-white tracking-wide">Live Movement Conference Center</h3>
            </div>
            <p className="text-xs text-slate-400">Launch real-time voice calls or video streams with fellow movement members instantly.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopyStreamLink}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              {linkCopied ? 'Link Copied!' : 'Copy Stream Link'}
            </button>
            <button
              type="button"
              onClick={() => startMeeting('audio')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"></path></svg>
              Voice Call
            </button>
            <button
              type="button"
              onClick={() => startMeeting('video')}
              className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-extrabold text-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Video Conference
            </button>
          </div>
        </div>

        {/* Welcome Banner & User Credentials Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center justify-between">
            <div>
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-slate-700 mb-4 mx-auto shadow-lg">
                <img src={currentUser.photo || '/mp1.jpeg'} alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-950" />
              </div>
              <h2 className="text-xl font-black text-white">{currentUser.fullName}</h2>
              <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider mt-1.5">
                Verified Supporter
              </span>
            </div>

            <div className="w-full mt-6 space-y-2 text-left bg-[#0b0f19] p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-white font-medium truncate max-w-[150px]">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">National ID:</span>
                <span className="text-amber-400 font-bold">{currentUser.nationalId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="text-white font-medium">{currentUser.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Submit Grievance / Issue Form */}
          <div className="md:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-2">Raise Grassroots Issue / Inquiry</h3>
              <p className="text-xs text-slate-400 mb-6">Submit community development concerns directly to the movement management dashboard for action.</p>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label htmlFor="issue-title" className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
                <input
                  id="issue-title"
                  type="text"
                  placeholder="e.g., Infrastructure upgrade in local ward"
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label htmlFor="issue-desc" className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  id="issue-desc"
                  rows={3}
                  placeholder="Describe the challenge or proposal clearly..."
                  value={newIssueDesc}
                  onChange={(e) => setNewIssueDesc(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-6 py-3 rounded-xl text-xs transition cursor-pointer shadow-lg w-full md:w-auto"
              >
                Submit Issue to Leadership
              </button>
            </form>
          </div>
        </div>

        {/* Directory of All Registered Movement Members & Accounts (Persisted Storage Images) */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Movement Member Directory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Explore accounts and registered supporters with persistent profile storage across refreshes.</p>
            </div>
            <span className="bg-slate-800 text-amber-400 text-xs font-bold px-3 py-1 rounded-lg border border-slate-700">
              Total Members: {registeredAccounts.length}
            </span>
          </div>

          {registeredAccounts.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No registered accounts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {registeredAccounts.map((acc) => (
                <div key={acc.email || acc.nationalId} className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-4 flex flex-col items-center text-center space-y-3 hover:border-amber-500/50 transition">
                  <img src={acc.photo || '/mp1.jpeg'} alt="Member" className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 shadow-md bg-slate-900" />
                  <div>
                    <h4 className="font-bold text-sm text-white truncate max-w-[200px]">{acc.fullName}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{acc.email}</p>
                  </div>
                  <div className="w-full pt-2 border-t border-slate-800/60 flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">ID: <strong className="text-slate-300">{acc.nationalId}</strong></span>
                    <span className={`px-2 py-0.5 rounded uppercase text-[9px] font-bold ${
                      acc.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {acc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ACTIVE MEETING MODAL / OVERLAY */}
      {isInMeeting && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8 animate-fadeIn">
          {/* Modal Header */}
          <div className="flex justify-between items-center bg-[#111827]/80 border border-slate-800 px-6 py-4 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500 text-black font-black px-2.5 py-1 rounded text-xs">
                {meetingType === 'video' ? 'VIDEO CONFERENCE' : 'VOICE CALL'}
              </div>
              <h3 className="font-extrabold text-sm md:text-base text-white">PRM Secure Movement Room</h3>
            </div>

            {/* Timer & Stream Controls / Sharing */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleNativeShare}
                className="bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                Share Stream
              </button>

              <div className="hidden sm:flex items-center gap-2 bg-[#0b0f19] px-4 py-1.5 rounded-xl border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
                  {formatTimer(meetingSeconds)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setDisplayMode(displayMode === 'face' ? 'initial' : 'face')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700 cursor-pointer"
              >
                View: {displayMode === 'face' ? 'Live Camera' : 'Initial Letter'}
              </button>
            </div>
          </div>

          {/* Main Video/Audio Grid Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6 flex-1 items-center justify-center max-w-7xl mx-auto w-full">
            {/* Current User Stream Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl h-[320px] md:h-[400px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group">
              {meetingType === 'video' && !isCameraOff && displayMode === 'face' ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 to-slate-700 flex items-center justify-center text-4xl font-black text-black shadow-2xl border-4 border-amber-400 overflow-hidden">
                  {displayMode === 'initial' || isCameraOff || meetingType === 'audio' ? currentUser.fullName.charAt(0).toUpperCase() : <img src={currentUser.photo || '/mp1.jpeg'} alt="Me" className="w-full h-full rounded-full object-cover" />}
                </div>
              )}

              {/* User Label Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">{currentUser.fullName} (You)</span>
                <div className="flex items-center gap-2">
                  {isMuted && <span className="text-[10px] bg-red-600/80 text-white px-2 py-0.5 rounded font-bold">Muted</span>}
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
              </div>
            </div>

            {/* Peer Participants Simulation Cards */}
            {participants.map((peer) => (
              <div key={peer.id} className="bg-[#111827] border border-slate-800 rounded-2xl h-[320px] md:h-[400px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                {displayMode === 'face' ? (
                  <div className="w-full h-full relative">
                    <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-black text-amber-400 shadow-xl border-4 border-slate-700">
                    {peer.initial}
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-xs font-bold text-white truncate max-w-[120px]">{peer.name}</span>
                  {peer.isSpeaking && (
                    <div className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 bg-amber-400 animate-pulse h-2"></span>
                      <span className="w-0.5 bg-amber-400 animate-bounce h-3"></span>
                      <span className="w-0.5 bg-amber-400 animate-pulse h-1"></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Control Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-[#111827]/90 backdrop-blur-md border border-slate-800 px-6 py-4 rounded-2xl shadow-2xl max-w-3xl mx-auto w-full">
            {/* Mute / Unmute Button */}
            <button
              type="button"
              onClick={toggleMute}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMuted ? 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2' : 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'}></path></svg>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            {/* Camera Toggle */}
            {meetingType === 'video' && (
              <button
                type="button"
                onClick={toggleCamera}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  isCameraOff ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                {isCameraOff ? 'Cam Off' : 'Cam On'}
              </button>
            )}

            {/* Audio Output Switcher (Speaker / Bluetooth / Earpiece) */}
            <button
              type="button"
              onClick={cycleAudioOutput}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
              Audio: <span className="uppercase text-[10px] text-white">{audioDevice}</span>
            </button>

            {/* End Call / Leave Meeting */}
            <button
              type="button"
              onClick={endMeeting}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-extrabold text-xs transition shadow-lg cursor-pointer"
            >
              Leave Meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}