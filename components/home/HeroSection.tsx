'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PlacesAutocomplete from '@/components/PlacesAutocomplete'

const tripTabs = [
  { id: 'airport',    label: 'Airport',        icon: '✈️' },
  { id: 'one-way',   label: 'One-Way',         icon: '→'  },
  { id: 'round-trip',label: 'Round-Trip',      icon: '⇄'  },
  { id: 'hourly',    label: 'Hourly',          icon: '🕐' },
]

const trustBadges = [
  { icon: '✓', text: 'Guaranteed Rides' },
  { icon: '✓', text: '24x7 Support' },
  { icon: '✓', text: 'Free Cancellation' },
  { icon: '✓', text: 'Verified Drivers' },
]

// ⚠️ Do NOT compute time at module level — causes SSR hydration mismatch
// These are computed lazily inside useState() below

export default function HeroSection() {
  const router = useRouter()
  const [activeTab, setActiveTab]   = useState('airport')
  const [from, setFrom]             = useState('')
  const [to, setTo]                 = useState('')
  // Lazy initializers run only on client — prevents SSR/client time mismatch
  const [departure, setDeparture]   = useState(() => new Date().toISOString().split('T')[0])
  const [pickupTime, setPickupTime] = useState(() => new Date().toTimeString().slice(0, 5))
  const [duration, setDuration]     = useState('4')
  const [returnDate, setReturnDate] = useState('')
  const [error, setError]           = useState('')

  const today = new Date().toISOString().split('T')[0]

  function swapLocations() { setFrom(to); setTo(from) }

  function handleGo() {
    setError('')
    if (!from.trim())                            { setError('Please enter pickup location.'); return }
    if (activeTab !== 'hourly' && !to.trim())    { setError('Please enter drop location.'); return }
    if (!departure)                              { setError('Please select departure date.'); return }
    const params = new URLSearchParams({
      from,
      to: activeTab === 'hourly' ? `Local Ride (${duration} hrs)` : to,
      date: departure,
      time: pickupTime,
      tripType: activeTab,
      ...(activeTab === 'round-trip' && returnDate ? { returnDate } : {}),
    })
    router.push(`/book?${params.toString()}`)
  }

  const isHourly    = activeTab === 'hourly'
  const isRoundTrip = activeTab === 'round-trip'

  const labelCls = 'block text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1'
  const fieldCls = 'px-4 py-3 border-b border-slate-100 last:border-0'

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 pb-10">

        {/* Headline */}
        <h1 className="font-outfit font-black text-2xl sm:text-4xl md:text-5xl text-white mb-2 leading-tight drop-shadow-lg">
          Hassle-Free Cab Booking in{' '}
          <span style={{ color: '#F59E0B' }}>Pune</span>
        </h1>
        <p className="text-white/80 text-base sm:text-xl mb-6 font-light drop-shadow">
          Fast, Easy &amp; Reliable — Book Your Cab Now
        </p>

        {/* ── Booking Card ── */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-left">

          {/* Trip Type Tabs — scrollable on mobile */}
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {tripTabs.map(tab => (
              <button key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError('') }}
                className={`flex-1 min-w-[72px] flex flex-col sm:flex-row items-center justify-center gap-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#5B21B6] text-[#5B21B6] bg-purple-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}>
                <span className="text-base sm:text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── Form Fields ── */}
          <div className="divide-y divide-slate-100">

            {/* FROM */}
            <div className={fieldCls}>
              <label className={labelCls}>📍 Pickup Location</label>
              <PlacesAutocomplete
                id="pickup-location"
                value={from}
                onChange={setFrom}
                placeholder="Enter pickup location"
              />
            </div>

            {/* TO / DURATION */}
            {isHourly ? (
              <div className={fieldCls}>
                <label className={labelCls}>⏱ Duration</label>
                <select value={duration} onChange={e => setDuration(e.target.value)}
                  className="w-full text-slate-900 text-base font-medium outline-none bg-transparent">
                  {[2,3,4,6,8,10,12].map(h => (
                    <option key={h} value={String(h)}>{h} Hours</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className={`${fieldCls} relative`}>
                <label className={labelCls}>🏁 Drop Location</label>
                <div className="flex items-center gap-2">
                  <PlacesAutocomplete
                    id="drop-location"
                    value={to}
                    onChange={setTo}
                    placeholder="Enter drop location"
                  />
                  <button onClick={swapLocations}
                    className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#5B21B6] hover:text-[#5B21B6] transition-all"
                    title="Swap locations">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* DATE + TIME — side by side, visible native inputs (work on all mobile browsers) */}
            <div className="grid grid-cols-2 divide-x divide-slate-100">

              {/* DEPARTURE DATE */}
              <div className="px-4 py-3">
                <div className={labelCls}>📅 {isRoundTrip ? 'Departure' : 'Date'}</div>
                <input
                  type="date"
                  value={departure}
                  min={today}
                  onChange={e => setDeparture(e.target.value)}
                  onFocus={e => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
                  className="w-full text-slate-900 text-sm font-semibold bg-transparent border-0 outline-none cursor-pointer p-0"
                  style={{ colorScheme: 'light' }}
                />
              </div>

              {/* PICKUP TIME */}
              <div className="px-4 py-3">
                <div className={labelCls}>🕐 Time</div>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={e => setPickupTime(e.target.value)}
                  onFocus={e => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
                  className="w-full text-slate-900 text-sm font-semibold bg-transparent border-0 outline-none cursor-pointer p-0"
                  style={{ colorScheme: 'light' }}
                />
              </div>
            </div>

            {/* RETURN DATE (Round Trip) */}
            {isRoundTrip && (
              <div className="px-4 py-3 border-t border-slate-100">
                <div className={labelCls}>🔙 Return Date</div>
                <input
                  type="date"
                  value={returnDate}
                  min={departure || today}
                  onChange={e => setReturnDate(e.target.value)}
                  onFocus={e => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
                  className="w-full text-slate-900 text-sm font-semibold bg-transparent border-0 outline-none cursor-pointer p-0"
                  style={{ colorScheme: 'light' }}
                />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-2 text-red-500 text-xs font-medium bg-red-50 border-t border-red-100">
              ⚠️ {error}
            </div>
          )}

          {/* GO BUTTON — full width on mobile */}
          <div className="p-3">
            <button onClick={handleGo}
              className="w-full py-4 bg-gradient-to-r from-[#5B21B6] to-[#4C1D95] text-white font-bold text-base rounded-xl hover:shadow-[0_0_25px_rgba(91,33,182,0.5)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
              Search Cabs
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-6 mt-5">
          {trustBadges.map(badge => (
            <div key={badge.text} className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-[#5B21B6] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {badge.icon}
              </span>
              {badge.text}
            </div>
          ))}
        </div>

        {/* Phone CTA */}
        <div className="mt-4">
          <a href="tel:7857870449"
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#F59E0B] text-sm transition-colors duration-200">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            Or call: <strong className="text-white">+91 7857870449</strong>
          </a>
        </div>
      </div>
    </section>
  )
}
