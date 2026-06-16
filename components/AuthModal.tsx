'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: { name: string; phone: string; email: string; type?: string; companyName?: string }) => void
}

type UserTab = 'user' | 'agent'
type View    = 'user' | 'corporate'
type Mode    = 'login' | 'register'

// ── Fixed Corporate Admin Credentials ──
// Change these in .env.local:
// NEXT_PUBLIC_CORPORATE_EMAIL=admin@urbanmiles.in
// NEXT_PUBLIC_CORPORATE_PASSWORD=UrbanMiles@2025
const CORP_EMAIL = process.env.NEXT_PUBLIC_CORPORATE_EMAIL || 'admin@urbanmiles.in'
const CORP_PASS  = process.env.NEXT_PUBLIC_CORPORATE_PASSWORD || 'UrbanMiles@2025'

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const router = useRouter()

  const [view, setView]     = useState<View>('user')
  const [tab, setTab]       = useState<UserTab>('user')
  const [mode, setMode]     = useState<Mode>('login')

  // User fields
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [phone, setPhone]   = useState('')
  const [password, setPass] = useState('')

  // Corporate fields
  const [corpEmail, setCorpEmail] = useState('')
  const [corpPass, setCorpPass]   = useState('')

  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  function reset() {
    setName(''); setEmail(''); setPhone(''); setPass('')
    setCorpEmail(''); setCorpPass(''); setError('')
  }

  function switchView(v: View) { setView(v); reset() }
  function switchMode(m: Mode) { setMode(m); reset() }

  // ── User / Travel Agent submit ──
  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault(); setError('')
    if (mode === 'register' && !name.trim()) { setError('Please enter your full name.'); return }
    if (!email.trim() && !phone)             { setError('Please enter email or phone.'); return }
    if (!password || password.length < 6)    { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const user = { name: mode === 'register' ? name : (email || phone), phone, email, type: 'user' }
    localStorage.setItem('urbanmiles_user', JSON.stringify(user))
    setLoading(false); onLogin(user); onClose(); reset()
  }

  // ── Corporate Admin submit — checks fixed credentials ──
  async function handleCorporateSubmit(e: React.FormEvent) {
    e.preventDefault(); setError('')
    if (!corpEmail.trim()) { setError('Please enter the admin email.'); return }
    if (!corpPass)         { setError('Please enter the password.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    if (corpEmail.trim().toLowerCase() !== CORP_EMAIL.toLowerCase() || corpPass !== CORP_PASS) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false); return
    }

    const corporate = {
      type: 'corporate',
      name: 'Urban Miles Admin',
      email: corpEmail,
      phone: '7857870449',
      companyName: 'Urban Miles',
    }
    localStorage.setItem('urbanmiles_user', JSON.stringify(corporate))
    localStorage.setItem('urbanmiles_corporate', JSON.stringify({
      ...corporate, companyName: 'Urban Miles', gstNumber: '', industry: 'Transport'
    }))

    setLoading(false)
    router.push('/corporate/dashboard')
    onLogin(corporate); onClose(); reset()
  }

  const spinnerSvg = (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  )

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden max-h-[90vh] flex flex-col">

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center z-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* ── Header ── */}
          <div className={`px-6 pt-7 pb-5 flex-shrink-0 transition-colors duration-300 ${
            view === 'corporate'
              ? 'bg-gradient-to-r from-[#1e293b] to-[#334155]'
              : 'bg-gradient-to-r from-[#5B21B6] to-[#4C1D95]'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                {view === 'corporate' ? '🏢' : '👤'}
              </div>
              <div>
                <h2 className="text-white font-outfit font-bold text-lg leading-none">
                  {view === 'corporate' ? 'Corporate Admin Login' : (mode === 'login' ? 'Welcome Back!' : 'Create Account')}
                </h2>
                <p className="text-white/70 text-xs mt-0.5">
                  {view === 'corporate' ? 'Urban Miles Admin Portal' : 'Urban Miles Premium Rides'}
                </p>
              </div>
            </div>

            {/* Tabs — only shown for user view */}
            {view === 'user' && (
              <div className="flex bg-white/15 rounded-xl p-1 gap-1">
                {(['user', 'agent'] as UserTab[]).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-[#5B21B6]' : 'text-white/80 hover:text-white'}`}>
                    {t === 'user' ? '👤 As User' : '🏢 As Travel Agent'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Body ── */}
          <div className="overflow-y-auto flex-1">

            {/* USER FORM */}
            {view === 'user' && (
              <form onSubmit={handleUserSubmit} className="px-6 py-5 space-y-3">
                {mode === 'register' && (
                  <div>
                    <label className="block text-slate-500 text-xs font-medium mb-1.5">Full Name *</label>
                    <input type="text" placeholder="Enter your full name" value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 transition-all" />
                  </div>
                )}

                <div>
                  <label className="block text-slate-500 text-xs font-medium mb-1.5">
                    {mode === 'login' ? 'Email or Phone Number *' : 'Email Address *'}
                  </label>
                  <input type="text" placeholder={mode === 'login' ? 'Enter your email or phone' : 'Enter your email'}
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 transition-all" />
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-slate-500 text-xs font-medium mb-1.5">Phone Number *</label>
                    <div className="flex">
                      <span className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-sm">+91</span>
                      <input type="tel" placeholder="10-digit number" value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="flex-1 border border-slate-200 rounded-r-xl px-4 py-3 text-sm outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 transition-all" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-500 text-xs font-medium mb-1.5">Password *</label>
                  <input type="password"
                    placeholder={mode === 'register' ? 'Create a password (min 6 chars)' : 'Enter your password'}
                    value={password} onChange={e => setPass(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 transition-all" />
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">⚠️ {error}</div>}

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-[#5B21B6] to-[#4C1D95] text-white font-bold py-3.5 rounded-xl text-sm hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2">
                  {loading ? <>{spinnerSvg} Please wait...</> : mode === 'login' ? 'Login' : 'Create Account'}
                </button>

                <div className="text-center text-sm text-slate-500">
                  {mode === 'login'
                    ? <><span>New User? </span><button type="button" onClick={() => switchMode('register')} className="text-[#5B21B6] font-semibold hover:underline">Register Now</button></>
                    : <><span>Already have an account? </span><button type="button" onClick={() => switchMode('login')} className="text-[#5B21B6] font-semibold hover:underline">Login</button></>}
                </div>

                {/* Corporate link */}
                <div className="border-t border-slate-100 pt-3 text-center">
                  <button type="button" onClick={() => switchView('corporate')}
                    className="inline-flex items-center gap-2 text-slate-500 text-sm hover:text-[#1e293b] font-medium transition-colors">
                    <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">🏢</span>
                    Login As Corporate
                  </button>
                </div>
              </form>
            )}

            {/* CORPORATE ADMIN FORM — fixed credentials only */}
            {view === 'corporate' && (
              <form onSubmit={handleCorporateSubmit} className="px-6 py-5 space-y-4">

                {/* Info banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-start gap-3">
                  <span className="text-slate-400 text-lg flex-shrink-0">🔒</span>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    This portal is for <strong className="text-slate-700">Urban Miles admin only</strong>. Use your admin credentials to access the corporate dashboard.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-500 text-xs font-medium mb-1.5">Admin Email *</label>
                  <input type="email" placeholder="admin@urbanmiles.in" value={corpEmail}
                    onChange={e => setCorpEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1e293b] focus:ring-2 focus:ring-slate-200 transition-all" />
                </div>

                <div>
                  <label className="block text-slate-500 text-xs font-medium mb-1.5">Password *</label>
                  <input type="password" placeholder="Enter admin password" value={corpPass}
                    onChange={e => setCorpPass(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1e293b] focus:ring-2 focus:ring-slate-200 transition-all" />
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">⚠️ {error}</div>}

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-[#1e293b] to-[#334155] text-white font-bold py-3.5 rounded-xl text-sm hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2">
                  {loading ? <>{spinnerSvg} Verifying...</> : '🔑 Login to Dashboard'}
                </button>

                <div className="text-center">
                  <button type="button" onClick={() => switchView('user')}
                    className="text-[#5B21B6] text-sm font-medium hover:underline">
                    ← Back to User Login
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-4 pt-2 border-t border-slate-100 flex-shrink-0">
            <p className="text-slate-400 text-[11px] text-center">
              By proceeding, you agree to Urban Miles&apos;{' '}
              <span className="text-[#5B21B6] cursor-pointer hover:underline">Privacy Policy</span> &amp;{' '}
              <span className="text-[#5B21B6] cursor-pointer hover:underline">T&Cs</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
