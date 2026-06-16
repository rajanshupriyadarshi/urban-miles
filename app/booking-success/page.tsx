'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function BookingSuccessContent() {
  const params = useSearchParams()

  const bookingId = params.get('bookingId') || 'UMXXXXXX'
  const name      = params.get('name')      || ''
  const phone     = params.get('phone')     || ''
  const pickup    = params.get('pickup')    || ''
  const drop      = params.get('drop')      || ''
  const date      = params.get('date')      || ''
  const time      = params.get('time')      || ''
  const vehicle   = params.get('vehicle')   || ''
  const tripType  = params.get('tripType')  || ''
  const amount    = params.get('amount')    || ''
  const notes     = params.get('notes')     || ''

  // Save this booking to localStorage so admin dashboard can see it
  useEffect(() => {
    if (!bookingId || bookingId === 'UMXXXXXX') return
    const stored = localStorage.getItem('urbanmiles_all_bookings')
    const all = stored ? JSON.parse(stored) : []
    // Avoid duplicate saves on re-render
    if (all.find((b: {id: string}) => b.id === bookingId)) return
    const newBooking = {
      id: bookingId,
      name, phone, pickup, drop, date, time,
      vehicle, tripType, amount, notes,
      paymentMode: 'Pending',   // admin updates this
      journeyStatus: 'Upcoming', // admin updates this
      bookedAt: new Date().toISOString(),
    }
    localStorage.setItem('urbanmiles_all_bookings', JSON.stringify([newBooking, ...all]))
  }, [bookingId, name, phone, pickup, drop, date, time, vehicle, tripType, amount, notes])

  function handlePrint() {
    window.print()
  }

  const whatsappText = encodeURIComponent(
    `🚗 *Urban Miles Booking Confirmed!*\n\n` +
    `Booking ID: *${bookingId}*\n` +
    `Name: ${name}\n` +
    `From: ${pickup}\n` +
    `To: ${drop}\n` +
    `Date: ${date} at ${time}\n` +
    `Vehicle: ${vehicle}\n` +
    `Est. Fare: ₹${amount}\n\n` +
    `Payment: QR Code / Cash\n` +
    `Contact: +91 7857870449`
  )

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16 px-4">

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-show { display: block !important; }
          body { background: white !important; }
          .booking-card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto">

        {/* Success header — hidden on print */}
        <div className="no-print text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h1 className="font-outfit font-black text-3xl text-slate-900">Booking Confirmed! 🎉</h1>
          <p className="text-slate-500 mt-2">Your ride has been booked. Our driver will contact you before departure.</p>
        </div>

        {/* ── Booking Slip (printable) ── */}
        <div className="booking-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Slip header */}
          <div className="bg-gradient-to-r from-[#5B21B6] to-[#4C1D95] px-6 py-5 flex items-center justify-between">
            <div>
              <div className="font-outfit font-black text-2xl text-white">
                Urban<span className="text-[#F59E0B]">Miles</span>
              </div>
              <div className="text-white/60 text-xs tracking-widest uppercase mt-0.5">Premium Rides · Pune</div>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-xs uppercase tracking-wide">Booking Slip</div>
              <div className="text-white font-mono font-bold text-lg">{bookingId}</div>
            </div>
          </div>

          {/* Status banner */}
          <div className="bg-green-50 border-b border-green-100 px-6 py-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-700 font-semibold text-sm">Booking Confirmed</span>
            <span className="text-green-500 text-xs ml-auto">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-5 mb-6">
              {[
                { label: 'Passenger',  value: name },
                { label: 'Phone',      value: `+91 ${phone}` },
                { label: 'Trip Type',  value: tripType },
                { label: 'Vehicle',    value: vehicle },
                { label: 'Date',       value: date },
                { label: 'Time',       value: time },
              ].map(d => (
                <div key={d.label}>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wide">{d.label}</div>
                  <div className="text-slate-900 font-semibold text-sm mt-0.5">{d.value || '—'}</div>
                </div>
              ))}
            </div>

            {/* Route */}
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#5B21B6] border-2 border-[#5B21B6]" />
                  <div className="w-0.5 h-8 bg-slate-300 border-dashed" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B] border-2 border-[#F59E0B]" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wide">Pickup</div>
                    <div className="text-slate-900 font-semibold text-sm">{pickup}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wide">Drop</div>
                    <div className="text-slate-900 font-semibold text-sm">{drop}</div>
                  </div>
                </div>
              </div>
            </div>

            {notes && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5">
                <div className="text-blue-500 text-xs font-medium mb-0.5">Special Instructions</div>
                <div className="text-blue-800 text-sm">{notes}</div>
              </div>
            )}

            {/* Fare */}
            <div className="flex items-center justify-between py-3 border-t border-b border-slate-100 mb-5">
              <span className="text-slate-500 font-medium">Estimated Fare</span>
              <span className="font-outfit font-black text-2xl text-[#5B21B6]">₹{amount}</span>
            </div>

            {/* Payment section */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-outfit font-bold text-slate-900 text-base mb-4 text-center">
                💰 Payment Options
              </h3>
              <div className="grid grid-cols-2 gap-4 items-center">
                {/* QR Code */}
                <div className="text-center">
                  <div className="text-slate-600 text-xs font-semibold mb-2 uppercase tracking-wide">Scan QR to Pay</div>
                  <div className="bg-white rounded-xl p-2 inline-block border border-amber-200 shadow-sm">
                    <Image
                      src="/payment-qr.png"
                      alt="Payment QR Code"
                      width={120}
                      height={120}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="text-slate-500 text-[10px] mt-1">UPI / PhonePe / GPay</div>
                </div>

                {/* Divider */}
                <div>
                  <div className="text-center text-slate-400 text-xs font-medium mb-3">— OR —</div>
                  <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
                    <div className="text-3xl mb-2">💵</div>
                    <div className="font-bold text-slate-900 text-sm">Pay by Cash</div>
                    <div className="text-slate-500 text-xs mt-1">Hand cash directly to your driver</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
            <div className="text-slate-500 text-xs">For support, call or WhatsApp:</div>
            <a href="tel:7857870449" className="text-[#5B21B6] font-bold text-base">+91 7857870449</a>
            <div className="text-slate-400 text-[10px] mt-1">Lohegaon, Pune · urbanmiles.in</div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="no-print mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-[#5B21B6] text-white font-semibold py-3 rounded-xl hover:bg-[#4C1D95] transition-colors text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print / Save PDF
          </button>

          <a href={`https://wa.me/917857870449?text=${whatsappText}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Share on WhatsApp
          </a>

          <Link href="/"
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm col-span-2 sm:col-span-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </Link>
        </div>

        {/* Info note */}
        <div className="no-print mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center">
          <p className="text-blue-700 text-xs">
            📞 Our team will call you on <strong>+91 {phone}</strong> to confirm your booking details.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#5B21B6] border-t-transparent animate-spin" />
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}
