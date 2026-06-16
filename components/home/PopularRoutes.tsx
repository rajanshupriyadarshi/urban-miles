import Link from 'next/link'

const routes = [
  {
    from: 'Pune',
    to: 'Mumbai',
    distance: '150 km',
    time: '3 hrs',
    price: '₹2,500',
    gradient: 'from-[#5B21B6]/20 to-[#4C1D95]/5',
    accent: '#5B21B6',
  },
  {
    from: 'Pune',
    to: 'Nashik',
    distance: '210 km',
    time: '4 hrs',
    price: '₹3,200',
    gradient: 'from-[#F59E0B]/20 to-[#D97706]/5',
    accent: '#F59E0B',
  },
  {
    from: 'Pune',
    to: 'Shirdi',
    distance: '185 km',
    time: '3.5 hrs',
    price: '₹2,800',
    gradient: 'from-[#7C3AED]/20 to-[#4C1D95]/5',
    accent: '#7C3AED',
  },
  {
    from: 'Pune',
    to: 'Lonavala',
    distance: '65 km',
    time: '1.5 hrs',
    price: '₹1,200',
    gradient: 'from-[#EC4899]/20 to-[#9D174D]/5',
    accent: '#EC4899',
  },
  {
    from: 'Pune',
    to: 'Kolhapur',
    distance: '230 km',
    time: '4.5 hrs',
    price: '₹3,500',
    gradient: 'from-[#5B21B6]/20 to-transparent',
    accent: '#5B21B6',
  },
  {
    from: 'Pune',
    to: 'Aurangabad',
    distance: '240 km',
    time: '4 hrs',
    price: '₹3,700',
    gradient: 'from-[#F59E0B]/20 to-transparent',
    accent: '#F59E0B',
  },
]

export default function PopularRoutes() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white rounded-full border border-slate-200 px-4 py-2 mb-4">
            <span className="text-[#F59E0B] text-xs font-medium tracking-wider uppercase">Popular Routes</span>
          </div>
          <h2 className="font-outfit font-bold text-4xl sm:text-5xl text-slate-900 mb-4">
            Top Outstation
            <span className="gradient-teal"> Destinations</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Pre-planned routes from Pune with transparent pricing and zero surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {routes.map((route) => (
            <Link
              key={`${route.from}-${route.to}`}
              href={`/book?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&tripType=one-way`}
              className={`group bg-white border border-slate-200 rounded-2xl p-6 card-hover overflow-hidden relative block bg-gradient-to-br ${route.gradient}`}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-900 font-outfit font-bold text-xl">{route.from}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: route.accent }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    <span className="text-slate-900 font-outfit font-bold text-xl">{route.to}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-xs">
                    <span>{route.distance}</span>
                    <span>·</span>
                    <span>{route.time}</span>
                  </div>
                </div>
                <div
                  className="text-right px-3 py-1.5 rounded-xl text-sm font-bold"
                  style={{ background: `${route.accent}15`, color: route.accent }}
                >
                  {route.price}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="bg-white/50 text-slate-600 text-xs px-2.5 py-1 rounded-lg border border-slate-200">One Way</span>
                  <span className="bg-white/50 text-slate-600 text-xs px-2.5 py-1 rounded-lg border border-slate-200">Round Trip</span>
                </div>
                <span
                  className="text-xs font-semibold group-hover:translate-x-1 transition-transform duration-200"
                  style={{ color: route.accent }}
                >
                  Book →
                </span>
              </div>

              {/* Bottom glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${route.accent}, transparent)` }}
              />
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/outstation-cabs"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 px-7 py-3.5 rounded-xl hover:border-[#5B21B6]/30 transition-all duration-300 text-sm shadow-sm"
          >
            View All Routes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
