import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              🎓 Over 50,000 students enrolled
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Learn Skills That{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Shape Your Future
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
              EduFlow brings world-class courses in programming, design, business, and more — taught by industry experts. Learn at your own pace, earn certificates, and advance your career.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-lg mx-auto lg:mx-0">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors whitespace-nowrap">
                Search
              </button>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="text-slate-400 text-sm">Popular:</span>
              {["Python", "React", "UI/UX", "Data Science", "Node.js"].map((tag) => (
                <button
                  key={tag}
                  className="text-xs text-slate-300 bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content — Stats Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {/* Main card */}
            <div className="col-span-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <p className="text-white font-semibold">Full-Stack Web Development</p>
                  <p className="text-slate-400 text-sm">by Sarah Johnson</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span>⭐ 4.9 (2.4k reviews)</span>
                <span>•</span>
                <span>42 hours</span>
                <span>•</span>
                <span className="text-green-400 font-semibold">Bestseller</span>
              </div>
              <div className="mt-4 bg-white/10 rounded-full h-2">
                <div className="bg-indigo-400 h-2 rounded-full w-3/4" />
              </div>
              <p className="text-slate-400 text-xs mt-1">75% complete</p>
            </div>

            {/* Mini cards */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-slate-400 text-sm">Courses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-2xl font-bold text-white">98%</p>
              <p className="text-slate-400 text-sm">Satisfaction</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">👨‍🏫</div>
              <p className="text-2xl font-bold text-white">120+</p>
              <p className="text-slate-400 text-sm">Instructors</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">🎓</div>
              <p className="text-2xl font-bold text-white">50k+</p>
              <p className="text-slate-400 text-sm">Students</p>
            </div>
          </div>
        </div>

        {/* Trusted by logos */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm mb-6">Trusted by learners from top companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Spotify"].map((company) => (
              <span key={company} className="text-slate-300 font-bold text-lg tracking-wide">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
