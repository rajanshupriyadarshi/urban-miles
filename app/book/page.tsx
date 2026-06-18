'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const vehicles = [
  { id: 'sedan',  name: 'Urban Comfort', type: 'Sedan',       examples: 'Dzire / Etios',    seats: 4, price: 13, base: 400,  emoji: '🚗', color: '#5B21B6', gradient: 'from-violet-600 to-purple-700' },
  { id: 'suv',    name: 'Urban Plus',    type: 'SUV / MUV',   examples: 'Ertiga / Marazzo',  seats: 6, price: 16, base: 600,  emoji: '🚙', color: '#0284C7', gradient: 'from-sky-500 to-blue-600'    },
  { id: 'luxury', name: 'Urban Elite',   type: 'Premium SUV', examples: 'Innova Crysta',     seats: 7, price: 22, base: 900,  emoji: '🏎️', color: '#B45309', gradient: 'from-amber-500 to-orange-600' },
]

function BookPageContent() {
  const router = useRouter()
  const params = useSearchParams()

  const [fromLoc, setFromLoc]   = useState(params.get('from') || '')
  const [toLoc, setToLoc]       = useState(params.get('to')   || '')
  const [tripDate, setTripDate] = useState(params.get('date')       || '')
  const [tripTime, setTripTime] = useState(params.get('time')       || '')
  const [retDate, setRetDate]   = useState(params.get('returnDate') || '')
  const [tripType, setTripType] = useState(params.get('tripType')   || 'airport')

  const todayStr = new Date().toISOString().split('T')[0]

  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [vehicle, setVehicle] = useState('sedan')
  const [notes, setNotes]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function swapLocations() { setFromLoc(toLoc); setToLoc(fromLoc) }

  const tripLabel: Record<string, string> = {
    'airport':    'Airport Transfer',
    'one-way':    'Outstation One-Way',
    'round-trip': 'Outstation Round-Trip',
    'hourly':     'Hourly Rental',
  }

  const tripIcons: Record<string, string> = {
    'airport': '🛫', 'one-way': '➡️', 'round-trip': '🔄', 'hourly': '⏱️',
  }

  const selectedVehicle = vehicles.find(v => v.id === vehicle)!
  const estimatedKm = tripType === 'round-trip' ? 60 : 30
  const baseFare    = selectedVehicle.base
  const kmFare      = selectedVehicle.price * estimatedKm
  const total       = baseFare + kmFare

  async function handleConfirm() {
    setError('')
    if (!name.trim())        { setError('Please enter your name.'); return }
    if (phone.length !== 10) { setError('Please enter a valid 10-digit phone number.'); return }
    if (!fromLoc.trim())     { setError('Please enter a pickup location.'); return }
    if (!toLoc.trim())       { setError('Please enter a drop location.'); return }
    if (!tripDate)           { setError('Please select a travel date.'); return }
    if (!tripTime)           { setError('Please select a pickup time.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const bookingId = `UM${Date.now().toString().slice(-6)}`
    const successParams = new URLSearchParams({
      bookingId, name, phone,
      pickup: fromLoc, drop: toLoc,
      date: tripDate, time: tripTime,
      vehicle: selectedVehicle.name,
      tripType: tripLabel[tripType],
      amount: total.toFixed(2), notes,
      ...(retDate ? { returnDate: retDate } : {}),
    })
    router.push(`/booking-success?${successParams.toString()}`)
  }

  const inputCls = 'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all backdrop-blur-sm'
  const labelCls = 'block text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-1.5'

  return (
    <div className="min-h-screen bg-[#0A0F1E]">

      {/* ── Hero Header ── */}
      <div className="relative pt-24 pb-10 px-4 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5B21B6]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#5B21B6]/10 via-transparent to-[#0A0F1E] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-hover:-translate-x-1 transition-transform">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg shadow-amber-500/30 text-xl">
              🚖
            </div>
            <div>
              <h1 className="font-outfit font-black text-3xl sm:text-4xl text-white">Complete Your Booking</h1>
              <p className="text-white/50 text-sm mt-0.5">Fill in details below · Pay by UPI or Cash · Free cancellation</p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mt-6">
            {['Trip Details', 'Choose Vehicle', 'Your Info'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#F59E0B] text-[#0A0F1E] text-xs font-black flex items-center justify-center">{i + 1}</div>
                  <span className="text-white/70 text-xs font-medium hidden sm:block">{step}</span>
                </div>
                {i < 2 && <div className="w-8 h-px bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-4 pb-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* ── Trip Details Card ── */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#5B21B6] to-[#4C1D95] px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">📍</div>
                <div>
                  <h2 className="font-outfit font-bold text-white text-base">Trip Details</h2>
                  <p className="text-white/60 text-xs">Where are you going?</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="bg-[#13182B] p-6 space-y-5">

                {/* Pickup / Swap / Drop */}
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className={labelCls}>📍 Pickup Location</label>
                    <input type="text" value={fromLoc} onChange={e => setFromLoc(e.target.value)}
                      placeholder="Enter pickup address..." className={inputCls} />
                  </div>

                  {/* Swap */}
                  <button onClick={swapLocations} title="Swap"
                    className="flex-shrink-0 mb-0.5 w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-[#F59E0B] hover:border-[#F59E0B] text-white transition-all duration-200 flex items-center justify-center group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      className="group-hover:rotate-180 transition-transform duration-300">
                      <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
                    </svg>
                  </button>

                  <div className="flex-1">
                    <label className={labelCls}>🏁 Drop Location</label>
                    <input type="text" value={toLoc} onChange={e => setToLoc(e.target.value)}
                      placeholder="Enter drop address..." className={inputCls} />
                  </div>
                </div>

                {/* Trip Type / Date / Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>🚗 Trip Type</label>
                    <select value={tripType}
                      onChange={e => { setTripType(e.target.value); if (e.target.value !== 'round-trip') setRetDate('') }}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all cursor-pointer backdrop-blur-sm">
                      <option value="airport"    className="bg-[#1e293b] text-white">🛫 Airport Transfer</option>
                      <option value="one-way"    className="bg-[#1e293b] text-white">➡️ Outstation One-Way</option>
                      <option value="round-trip" className="bg-[#1e293b] text-white">🔄 Round-Trip</option>
                      <option value="hourly"     className="bg-[#1e293b] text-white">⏱️ Hourly Rental</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>📅 Travel Date *</label>
                    <input type="date" value={tripDate} min={todayStr}
                      onChange={e => setTripDate(e.target.value)}
                      onFocus={e => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
                      onClick={e  => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
                      className={inputCls + ' cursor-pointer'} />
                  </div>

                  <div>
                    <label className={labelCls}>⏰ Pickup Time *</label>
                    <input type="time" value={tripTime}
                      onChange={e => setTripTime(e.target.value)}
                      onFocus={e => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
                      onClick={e  => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
                      className={inputCls + ' cursor-pointer'} />
                  </div>
                </div>

                {/* Return Date */}
                {tripType === 'round-trip' && (
                  <div>
                    <label className={labelCls}>🔄 Return Date</label>
                    <input type="date" value={retDate} min={tripDate || todayStr}
                      onChange={e => setRetDate(e.target.value)}
                      onFocus={e => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
                      onClick={e  => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
                      className={inputCls + ' cursor-pointer sm:w-1/3'} />
                  </div>
                )}

                {/* Trip summary pills */}
                {(fromLoc || toLoc || tripDate) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {fromLoc && <span className="flex items-center gap-1.5 bg-[#5B21B6]/30 text-violet-300 text-xs px-3 py-1.5 rounded-full border border-[#5B21B6]/40">📍 {fromLoc}</span>}
                    {toLoc   && <span className="flex items-center gap-1.5 bg-[#5B21B6]/30 text-violet-300 text-xs px-3 py-1.5 rounded-full border border-[#5B21B6]/40">🏁 {toLoc}</span>}
                    {tripDate && <span className="flex items-center gap-1.5 bg-[#F59E0B]/20 text-amber-300 text-xs px-3 py-1.5 rounded-full border border-[#F59E0B]/30">📅 {new Date(tripDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                    {tripTime && <span className="flex items-center gap-1.5 bg-[#F59E0B]/20 text-amber-300 text-xs px-3 py-1.5 rounded-full border border-[#F59E0B]/30">⏰ {tripTime}</span>}
                    <span className="flex items-center gap-1.5 bg-white/10 text-white/60 text-xs px-3 py-1.5 rounded-full border border-white/10">{tripIcons[tripType]} {tripLabel[tripType]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Choose Vehicle Card ── */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-gradient-to-r from-[#B45309] to-[#92400E] px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">🚘</div>
                <div>
                  <h2 className="font-outfit font-bold text-white text-base">Choose Your Vehicle</h2>
                  <p className="text-white/60 text-xs">Select the ride that fits your journey</p>
                </div>
              </div>

              <div className="bg-[#13182B] p-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  {vehicles.map(v => (
                    <button key={v.id} onClick={() => setVehicle(v.id)}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden ${
                        vehicle === v.id
                          ? 'border-[#F59E0B] bg-[#F59E0B]/10 shadow-lg shadow-amber-500/20 scale-[1.02]'
                          : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8 hover:scale-[1.01]'
                      }`}>
                      {vehicle === v.id && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </div>
                      )}
                      {/* Glow on selected */}
                      {vehicle === v.id && <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 to-transparent pointer-events-none" />}

                      <div className="text-4xl mb-3">{v.emoji}</div>
                      <div className={`font-outfit font-bold text-base mb-0.5 ${vehicle === v.id ? 'text-[#F59E0B]' : 'text-white'}`}>{v.name}</div>
                      <div className="text-white/50 text-xs">{v.type}</div>
                      <div className="text-white/40 text-xs mb-3">{v.examples}</div>
                      <div className="flex items-center justify-between">
                        <div className={`font-bold text-sm ${vehicle === v.id ? 'text-[#F59E0B]' : 'text-white/80'}`}>
                          ₹{v.price}/km
                        </div>
                        <div className="text-white/40 text-xs">{v.seats} seats</div>
                      </div>
                      <div className="text-white/35 text-xs mt-0.5">Base ₹{v.base}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Your Details Card ── */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-gradient-to-r from-[#0E7490] to-[#0369A1] px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">👤</div>
                <div>
                  <h2 className="font-outfit font-bold text-white text-base">Your Details</h2>
                  <p className="text-white/60 text-xs">We&apos;ll use this to confirm your booking</p>
                </div>
              </div>

              <div className="bg-[#13182B] p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>👤 Full Name *</label>
                    <input type="text" placeholder="Enter your full name" value={name}
                      onChange={e => setName(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>📱 Phone Number *</label>
                    <div className="flex">
                      <span className="flex items-center px-3 bg-white/5 border border-r-0 border-white/20 rounded-l-xl text-white/60 text-sm font-medium">+91</span>
                      <input type="tel" placeholder="10-digit number" value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="flex-1 bg-white/10 border border-white/20 rounded-r-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>📝 Special Instructions (optional)</label>
                  <textarea placeholder="e.g. Luggage count, flight number, specific pickup point..." value={notes}
                    onChange={e => setNotes(e.target.value)} rows={2}
                    className={inputCls + ' resize-none'} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column — Fare Sidebar ── */}
          <div>
            <div className="sticky top-24 space-y-4">

              {/* Fare Estimate Card */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="bg-gradient-to-br from-[#5B21B6] via-[#4C1D95] to-[#3B0764] p-5 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full translate-y-6 -translate-x-6" />
                  <div className="relative">
                    <div className="text-5xl mb-2">{selectedVehicle.emoji}</div>
                    <div className="font-outfit font-black text-white text-lg">{selectedVehicle.name}</div>
                    <div className="text-white/60 text-xs">{selectedVehicle.type} · {selectedVehicle.seats} seats</div>
                  </div>
                </div>

                <div className="bg-[#13182B] p-5 space-y-3">
                  <h3 className="font-outfit font-bold text-white text-sm">Fare Estimate</h3>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm">Base Fare</span>
                      <span className="text-white text-sm font-medium">₹{baseFare}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm">Per KM (~{estimatedKm} km)</span>
                      <span className="text-white text-sm font-medium">₹{kmFare}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-base">Est. Total</span>
                      <span className="font-outfit font-black text-2xl text-[#F59E0B]">₹{total}</span>
                    </div>
                    <p className="text-white/30 text-[10px] text-center">* Estimate only. Final fare based on actual km.</p>
                  </div>

                  {/* Payment options */}
                  <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-3">
                    <div className="text-[#F59E0B] font-semibold text-xs text-center mb-2">💰 Payment Options</div>
                    <div className="flex justify-center gap-4 text-white/60 text-xs">
                      <span className="flex items-center gap-1">📱 UPI / QR</span>
                      <span className="flex items-center gap-1">💵 Cash</span>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2.5 rounded-xl flex items-start gap-2">
                      <span className="flex-shrink-0 mt-0.5">⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Confirm Button */}
                  <button onClick={handleConfirm} disabled={loading}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0A0F1E] font-outfit font-black py-4 rounded-xl text-sm hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2 group">
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-xl" />
                    {loading ? (
                      <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Confirming...</>
                    ) : (
                      <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> Confirm Booking</>
                    )}
                  </button>

                  <p className="text-center text-white/30 text-[11px]">No advance payment · Free cancellation</p>

                  {/* Help */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-white/50 text-xs mb-1">Need help booking?</div>
                    <a href="tel:7857870449" className="text-[#F59E0B] font-bold text-base hover:text-amber-300 transition-colors">
                      +91 7857870449
                    </a>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '🛡️', label: 'Safe Rides' },
                  { icon: '⭐', label: '4.9 Rated' },
                  { icon: '🕐', label: '24/7 Support' },
                ].map(b => (
                  <div key={b.label} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                    <div className="text-lg mb-1">{b.icon}</div>
                    <div className="text-white/50 text-[10px] font-medium">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-4 border-[#5B21B6] border-t-[#F59E0B] animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading booking...</p>
        </div>
      </div>
    }>
      <BookPageContent />
    </Suspense>
  )
}
