import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CTASection from '@/components/home/CTASection'

export const metadata = {
  title: 'Local Cab Booking Pune | Hourly Cab | Urban Miles',
  description: 'Book a cab by the hour in Pune. Perfect for shopping, hospital visits, meetings, and sightseeing. Fixed hourly rates. Call 7857870449.',
}

const packages = [
  { hours: 2, km: 20, price: '₹350', ideal: 'Quick errands', color: '#5B21B6' },
  { hours: 4, km: 40, price: '₹600', ideal: 'Hospital / shopping', color: '#F59E0B', popular: true },
  { hours: 8, km: 80, price: '₹1,100', ideal: 'City tour / meetings', color: '#7C3AED' },
  { hours: 12, km: 120, price: '₹1,500', ideal: 'Full day use', color: '#EC4899' },
]

export default function LocalCabsPage() {
  return (
    <>
      <Navbar />

      <section className="relative min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">📍</div>
          <div className="inline-flex items-center gap-2 glass rounded-full border border-slate-200 px-4 py-2 mb-6">
            <span className="text-[#7C3AED] text-xs font-medium">Local / Hourly</span>
          </div>
          <h1 className="font-outfit font-bold text-5xl sm:text-6xl text-slate-900 mb-6">
            Your City,
            <span className="block" style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> Your Schedule</span>
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Pay by the hour, not the kilometer. Book for 2 to 12 hours with a dedicated driver across Pune.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-outfit font-bold text-3xl text-slate-900 text-center mb-12">Hourly Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map((pkg) => (
              <div key={pkg.hours} className={`relative glass border ${pkg.popular ? 'border-[#F59E0B]/30' : 'border-slate-200'} rounded-2xl p-6 card-hover text-center`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <div className="font-outfit font-bold text-5xl mb-1" style={{ color: pkg.color }}>
                  {pkg.hours}h
                </div>
                <div className="text-slate-600 text-xs mb-4">{pkg.km} km included</div>
                <div className="font-outfit font-bold text-3xl text-slate-900 mb-1">{pkg.price}</div>
                <div className="text-slate-600 text-xs mb-5">Sedan · AC · 1 driver</div>
                <div className="text-slate-600 text-xs mb-5 glass border border-slate-200 rounded-lg py-1.5">{pkg.ideal}</div>
                <Link
                  href={`/book?tripType=hourly&duration=${pkg.hours}`}
                  className="btn-shine w-full block py-3 rounded-xl text-sm font-bold transition-all duration-300 text-center"
                  style={{ background: `${pkg.color}20`, color: pkg.color, border: `1px solid ${pkg.color}30` }}
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-600 text-sm mt-6">
            Extra km: ₹13/km · Extra hour: ₹150/hr · SUV available at +₹150/hr
          </p>
        </div>
      </section>

      <CTASection />
      <Footer />
    </>
  )
}
