'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const vehicles = [
  { id: 'sedan',  name: 'Urban Comfort', type: 'Sedan',      examples: 'Dzire / Etios',   seats: 4, price: 13, base: 400, emoji: '🚗' },
  { id: 'suv',    name: 'Urban Plus',    type: 'SUV / MUV',  examples: 'Ertiga / Marazzo', seats: 6, price: 16, base: 600, emoji: '🚙' },
  { id: 'luxury', name: 'Urban Elite',   type: 'Premium SUV', examples: 'Innova Crysta',   seats: 7, price: 22, base: 900, emoji: '🏎️' },
]

function BookPageContent() {
  const router = useRouter()
  const params = useSearchParams()

  const [fromLoc, setFromLoc]   = useState(params.get('from') || '')
  const [toLoc, setToLoc]       = useState(params.get('to')   || '')
  const date       = params.get('date')      || ''
  const time       = params.get('time')      || ''
  const tripType   = params.get('tripType')  || 'airport'
  const returnDate = params.get('returnDate') || ''

  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [vehicle, setVehicle] = useState('sedan')
  const [notes, setNotes]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function swapLocations() {
    setFromLoc(toLoc)
    setToLoc(fromLoc)
  }

  const tripLabel: Record<string, string> = {
    'airport':    'Airport Transfer',
    'one-way':    'Outstation One-Way',
    'round-trip': 'Outstation Round-Trip',
    'hourly':     'Hourly Rental',
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

    setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    const bookingId = `UM${Date.now().toString().slice(-6)}`

    const successParams = new URLSearchParams({
      bookingId,
      name, phone,
      pickup: fromLoc, drop: toLoc,
      date, time,
      vehicle: selectedVehicle.name,
      tripType: tripLabel[tripType],
      amount: total.toFixed(2),
      notes,
      ...(returnDate ? { returnDate } : {}),
    })
    router.push(`/booking-success?${successParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#5B21B6] text-sm mb-6 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Home
        </Link>

        <h1 className="font-outfit font-black text-2xl text-slate-900 mb-1">Complete Your Booking</h1>
        <p className="text-slate-500 text-sm mb-8">Fill in your details and confirm. Payment can be made via QR code or cash.</p>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — Details */}
          <div className="lg:col-span-2 space-y-5">

            {/* Trip Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-outfit font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#5B21B6]" />
                Trip Details
              </h2>

              {/* Pickup / Swap / Drop row */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">📍 Pickup Location</label>
                  <input
                    type="text"
                    value={fromLoc}
                    onChange={e => setFromLoc(e.target.value)}
                    placeholder="Enter pickup address..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 transition-all"
                  />
                </div>

                {/* Swap button */}
                <button
                  onClick={swapLocations}
                  title="Swap pickup and drop"
                  className="mt-5 flex-shrink-0 w-9 h-9 rounded-full border-2 border-[#5B21B6]/30 bg-purple-50 hover:bg-[#5B21B6] hover:border-[#5B21B6] text-[#5B21B6] hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm group"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
                    <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
                  </svg>
                </button>

                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">🏁 Drop Location</label>
                  <input
                    type="text"
                    value={toLoc}
                    onChange={e => setToLoc(e.target.value)}
                    placeholder="Enter drop address..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 transition-all"
                  />
                </div>
              </div>

              {/* Other trip info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Trip Type',    value: tripLabel[tripType] },
                  { label: 'Date',         value: date },
                  { label: 'Time',         value: time },
                  ...(returnDate ? [{ label: 'Return Date', value: returnDate }] : []),
                ].map(d => (
                  <div key={d.label}>
                    <div className="text-slate-400 text-[11px] uppercase tracking-wide">{d.label}</div>
                    <div className="text-slate-900 text-sm font-semibold mt-0.5">{d.value || '—'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-outfit font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#F59E0B]" />
                Choose Vehicle
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {vehicles.map(v => (
                  <button key={v.id} onClick={() => setVehicle(v.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${vehicle === v.id ? 'border-[#5B21B6] bg-purple-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <div className="text-3xl mb-2">{v.emoji}</div>
                    <div className={`font-bold text-sm ${vehicle === v.id ? 'text-[#5B21B6]' : 'text-slate-900'}`}>{v.name}</div>
                    <div className="text-slate-400 text-xs">{v.type}</div>
                    <div className="text-slate-500 text-xs mt-1">{v.examples}</div>
                    <div className="mt-2 font-semibold text-sm text-[#5B21B6]">₹{v.price}/km · Base ₹{v.base}</div>
                    <div className="text-slate-400 text-[11px]">{v.seats} seats</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-outfit font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#5B21B6]" />
                Your Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 text-xs font-medium mb-1.5">Full Name *</label>
                  <input type="text" placeholder="Enter your full name" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs font-medium mb-1.5">Phone Number *</label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-sm">+91</span>
                    <input type="tel" placeholder="10-digit number" value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 border border-slate-200 rounded-r-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 transition-all" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-slate-500 text-xs font-medium mb-1.5">Special Instructions (optional)</label>
                <textarea placeholder="e.g. Luggage count, flight number, specific pickup point..." value={notes}
                  onChange={e => setNotes(e.target.value)} rows={2}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 transition-all resize-none" />
              </div>
            </div>
          </div>

          {/* Right — Fare + Confirm */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24 space-y-4">
              <h2 className="font-outfit font-bold text-slate-900 text-base">Fare Estimate</h2>

              {/* Vehicle badge */}
              <div className="text-center py-4 border border-slate-100 rounded-xl bg-slate-50">
                <div className="text-3xl mb-1">{selectedVehicle.emoji}</div>
                <div className="font-bold text-slate-900">{selectedVehicle.name}</div>
                <div className="text-slate-400 text-xs">{selectedVehicle.type} · {selectedVehicle.seats} seats</div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Base Fare</span>
                  <span className="text-slate-900">₹{baseFare}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Per KM (~{estimatedKm} km)</span>
                  <span className="text-slate-900">₹{kmFare}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-100 text-base">
                  <span className="text-slate-900">Est. Total</span>
                  <span className="text-[#5B21B6] font-outfit text-xl">₹{total}</span>
                </div>
                <p className="text-[10px] text-slate-400 text-center">* Estimate only. Final fare based on actual km.</p>
              </div>

              {/* Payment method info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <div className="text-amber-700 font-semibold text-sm mb-1">💰 Payment Options</div>
                <div className="text-amber-600 text-xs space-y-0.5">
                  <div>📱 UPI / QR Code</div>
                  <div>💵 Cash to Driver</div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              <button onClick={handleConfirm} disabled={loading}
                className="w-full bg-gradient-to-r from-[#5B21B6] to-[#4C1D95] text-white font-bold py-4 rounded-xl text-sm hover:shadow-[0_0_25px_rgba(91,33,182,0.4)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2">
                {loading ? (
                  <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Confirming...</>
                ) : (
                  <>✅ Confirm Booking</>
                )}
              </button>

              <p className="text-center text-slate-400 text-[11px]">
                No advance payment required · Free cancellation
              </p>

              <div className="mt-2 p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
                <div className="text-slate-600 text-xs font-medium">Need help booking?</div>
                <a href="tel:7857870449" className="text-[#5B21B6] font-bold text-sm">+91 7857870449</a>
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#5B21B6] border-t-transparent animate-spin" />
      </div>
    }>
      <BookPageContent />
    </Suspense>
  )
}
