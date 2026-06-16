import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CTASection from '@/components/home/CTASection'
import PopularRoutes from '@/components/home/PopularRoutes'

export const metadata = {
  title: 'Outstation Cab Booking from Pune | Urban Miles',
  description: 'Book one-way and round-trip outstation cabs from Pune. Transparent pricing, comfortable vehicles, verified drivers. Call 7857870449.',
}

export default function OutstationCabsPage() {
  return (
    <>
      <Navbar />

      <section className="relative min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F59E0B]/8 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🚨</div>
          <div className="inline-flex items-center gap-2 glass rounded-full border border-slate-200 px-4 py-2 mb-6">
            <span className="text-[#F59E0B] text-xs font-medium">Outstation Rides</span>
          </div>
          <h1 className="font-outfit font-bold text-5xl sm:text-6xl text-slate-900 mb-6">
            Explore Maharashtra
            <span className="gradient-teal block">With Ease</span>
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto mb-8">
            One-way and round trips to any destination from Pune. Fixed fares, no hidden charges, experienced drivers who know the roads.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book?tripType=one-way" className="btn-shine bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold px-8 py-4 rounded-2xl text-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300">
              Book One Way
            </Link>
            <Link href="/book?tripType=round-trip" className="btn-shine glass border border-slate-200 text-slate-900 font-bold px-8 py-4 rounded-2xl text-lg hover:border-[#F59E0B]/40 transition-all duration-300">
              Book Round Trip
            </Link>
          </div>
        </div>
      </section>

      <PopularRoutes />

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-outfit font-bold text-3xl text-slate-900 text-center mb-12">Why Choose Urban Miles for Outstation?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '💰', title: 'Fixed Fares', desc: 'Pay exactly what you see at booking. No surge, no extras.' },
              { icon: '🗯️', title: 'Route Expertise', desc: 'Drivers with 5+ years on Maharashtra highways.' },
              { icon: '🚶', title: 'Comfortable Stops', desc: 'Planned halts at dhabas and rest areas on long routes.' },
              { icon: '📞', title: 'Live Tracking', desc: 'Share your live location with family throughout the journey.' },
              { icon: '❌', title: 'Free Cancellation', desc: 'Cancel anytime before the ride for a full refund.' },
              { icon: '⭐', title: 'Top Rated Drivers', desc: 'Only 4.8+ rated drivers handle outstation trips.' },
            ].map((f) => (
              <div key={f.title} className="glass border border-slate-200 rounded-2xl p-5 card-hover">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-outfit font-semibold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-slate-600 text-sm">{f.desc}</p>
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
