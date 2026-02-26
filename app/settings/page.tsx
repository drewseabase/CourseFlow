'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();

  const [canvasUrl, setCanvasUrl] = useState('https://umich.instructure.com');
  const [accessToken, setAccessToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleConnect() {
    if (!accessToken.trim()) {
      setErrorMessage('Please enter your Canvas access token.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/canvas/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: accessToken.trim(),
          canvasBaseUrl: canvasUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? 'Connection failed. Please check your token and try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setAccessToken('');
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  const panel = 'bg-white rounded-2xl border border-zinc-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.05)]';

  const EyeIcon = ({ open }: { open: boolean }) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <main className="max-w-375 mx-auto px-6 ml-20">
      <div className="mb-8">
        <h1 className="text-[36px] font-bold text-[#18181B] mb-2">Settings</h1>
        <p className="text-[16px] text-[#52525B]">Manage your integrations and account.</p>
      </div>

      {/* Canvas Integration */}
      <div className={`${panel} p-8 mb-6`}>
        <div className="flex items-center gap-3 mb-1">
          <svg className="w-5 h-5 text-[#E66000]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-[20px] font-bold text-[#18181B]">Canvas Integration</h2>
        </div>
        <p className="text-[14px] text-[#71717A] mb-8">
          Connect your Canvas account to sync courses, assignments, and deadlines automatically.
        </p>

        {/* Success state */}
        {status === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
            <CheckIcon />
            <div>
              <p className="text-[14px] font-semibold text-green-800">Canvas connected successfully</p>
              <p className="text-[13px] text-green-700">Your courses and assignments are syncing now.</p>
            </div>
          </div>
        )}

        {/* Canvas URL */}
        <div className="mb-5">
          <label className="block text-[13px] font-semibold text-[#18181B] mb-2">
            Canvas URL
          </label>
          <input
            type="url"
            value={canvasUrl}
            onChange={e => setCanvasUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-[14px] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            placeholder="https://umich.instructure.com"
          />
        </div>

        {/* Access Token */}
        <div className="mb-3">
          <label className="block text-[13px] font-semibold text-[#18181B] mb-2">
            Access Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={accessToken}
              onChange={e => setAccessToken(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-zinc-200 bg-zinc-50 text-[14px] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              placeholder="Paste your Canvas access token"
            />
            <button
              type="button"
              onClick={() => setShowToken(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label={showToken ? 'Hide token' : 'Show token'}
            >
              <EyeIcon open={showToken} />
            </button>
          </div>
        </div>

        {/* Error message */}
        {status === 'error' && (
          <p className="text-[13px] text-red-600 mb-4">{errorMessage}</p>
        )}

        {/* How to get a token */}
        <button
          onClick={() => setShowHelp(v => !v)}
          className="flex items-center gap-1.5 text-[13px] text-violet-600 hover:text-violet-800 transition-colors mb-6"
        >
          <ChevronIcon open={showHelp} />
          How do I get an access token?
        </button>

        {showHelp && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 mb-6 text-[13px] text-[#52525B] leading-relaxed">
            <ol className="list-decimal list-inside space-y-2">
              <li>Log in to <span className="font-semibold text-[#18181B]">Canvas</span> at umich.instructure.com</li>
              <li>Click your profile picture in the top-left corner</li>
              <li>Go to <span className="font-semibold text-[#18181B]">Account → Settings</span></li>
              <li>Scroll down to <span className="font-semibold text-[#18181B]">Approved Integrations</span></li>
              <li>Click <span className="font-semibold text-[#18181B]">+ New Access Token</span></li>
              <li>Give it a name like "CourseFlow" and click <span className="font-semibold text-[#18181B]">Generate Token</span></li>
              <li>Copy the token and paste it above</li>
            </ol>
            <p className="mt-3 text-[12px] text-[#A1A1AA]">
              Your token is encrypted before being stored. We never store it in plaintext.
            </p>
          </div>
        )}

        {/* Connect button */}
        <button
          onClick={handleConnect}
          disabled={status === 'loading'}
          className="px-6 py-3 bg-[#18181B] text-white font-semibold text-[14px] rounded-xl hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {status === 'loading' ? 'Connecting...' : 'Connect Canvas'}
        </button>
      </div>

      {/* Account section */}
      {session?.user && (
        <div className={`${panel} p-8`}>
          <h2 className="text-[20px] font-bold text-[#18181B] mb-5">Account</h2>
          <div className="flex items-center gap-4 mb-6">
            {session.user.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-11 h-11 rounded-full border border-zinc-200"
              />
            )}
            <div>
              <p className="text-[15px] font-semibold text-[#18181B]">{session.user.name}</p>
              <p className="text-[13px] text-[#71717A]">{session.user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 text-[14px] font-semibold text-[#18181B] hover:bg-zinc-50 transition-all duration-150"
          >
            Sign out
          </button>
        </div>
      )}
    </main>
  );
}