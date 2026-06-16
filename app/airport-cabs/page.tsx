import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CTASection from '@/components/home/CTASection'

const airports = [
  { city: 'Pune', code: 'PNQ', name: 'Pune International Airport', color: '#5B21B6' },
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji International', color: '#F59E0B' },
  { city: 'Nashik', code: 'ISK', name: 'Ozar Airport Nashik', color: '#7C3AED' },
]

export const metadata = {
  title: 'Airport Cab Booking Pune | Urban Miles',
  description: 'Book reliable airport cab from Pune. Punctual pickup and drop, flight tracking, meet & greet service. Call 7857870449.',
}

export default function AirportCabsPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#5B21B6]/8 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">✈️</div>
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-2 mb-6">
            <span className="text-[#5B21B6] text-xs font-medium">Airport Transfer</span>
          </div>
          <h1 className="font-outfit font-bold text-5xl sm:text-6xl text-slate-900 mb-6">
            Never Miss a
            <span className="gradient-gold"> Flight</span>
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto mb-8">
            Urban Miles ensures you reach the airport 30 minutes early, every time. We track your flight, adapt to delays, and guarantee on-time arrivals.
          </p>
          <Link
            href={`/book?from=&to=Pune+Airport+(PNQ)&tripType=airport&date=${new Date().toISOString().split('T')[0]}&time=${new Date().toTimeString().slice(0,5)}`}
            className="btn-shine inline-flex items-center gap-2 bg-gradient-to-r from-[#5B21B6] to-[#4C1D95] text-white font-bold px-8 py-4 rounded-2xl text-lg hover:shadow-[0_0_30px_rgba(91,33,182,0.4)] transition-all duration-300"
          >
            Book Airport Cab ✈️
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-outfit font-bold text-3xl text-slate-900 text-center mb-12">What Makes Our Airport Transfer Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🛩️', title: 'Flight Tracking', desc: 'We monitor your flight in real-time and adjust pickup time automatically for delays.' },
              { icon: '⏰', title: '30-Min Early Arrival', desc: 'Our drivers arrive 30 minutes before your scheduled pickup to ensure you never rush.' },
              { icon: '📋', title: 'Meet & Greet', desc: 'Driver holds a name board inside the terminal for a seamless, premium experience.' },
              { icon: '💰', title: 'No Waiting Charges', desc: 'No extra charges if your flight is delayed. We wait at no additional cost.' },
              { icon: '🚗', title: 'Clean Vehicles', desc: 'Sanitized, well-maintained cabs for every trip. No compromise on hygiene.' },
              { icon: '📞', title: 'Driver Contact', desc: "You get the driver's number right after booking. Always stay in touch." },
            ].map((f) => (
              <div key={f.title} className="glass border border-slate-200 rounded-2xl p-6 card-hover">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-outfit font-bold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Airports */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-outfit font-bold text-3xl text-slate-900 text-center mb-12">Airports We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {airports.map((airport) => (
              <div
                key={airport.code}
                className="glass border border-slate-200 rounded-2xl p-6 card-hover"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold mb-4 font-outfit"
                  style={{ background: `${airport.color}20`, color: airport.color }}
                >
                  {airport.code}
                </div>
                <h3 className="font-outfit font-bold text-slate-900 text-lg mb-1">{airport.city}</h3>
                <p className="text-slate-600 text-sm">{airport.name}</p>
                <Link
                  href={`/book?from=&to=${encodeURIComponent(airport.name)}&tripType=airport&date=${new Date().toISOString().split('T')[0]}&time=${new Date().toTimeString().slice(0,5)}`}
                  className="mt-4 flex items-center gap-1 text-sm font-semibold transition-colors hover:gap-2"
                  style={{ color: airport.color }}
                >
                  Book Pickup →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </>
  )
}
