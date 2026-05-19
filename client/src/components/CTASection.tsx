export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
          🎉 Limited Time Offer — 40% Off All Plans
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
          Start Your Learning Journey Today
        </h2>

        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
          Join 50,000+ students already learning on EduFlow. Get unlimited access to 500+ courses, earn certificates, and advance your career — starting for free.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-base shadow-lg">
            Get Started for Free
          </button>
          <button className="px-8 py-4 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-base backdrop-blur-sm">
            Browse All Courses
          </button>
        </div>

        {/* Trust signals */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-indigo-200 text-sm">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Cancel anytime
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            30-day money-back guarantee
          </span>
        </div>
      </div>
    </section>
  );
}
