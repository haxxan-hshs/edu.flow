const categories = [
  { name: "Web Development", icon: "💻", courses: 124, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-700" },
  { name: "Data Science", icon: "📊", courses: 87, color: "from-purple-500 to-violet-500", bg: "bg-purple-50", text: "text-purple-700" },
  { name: "UI/UX Design", icon: "🎨", courses: 63, color: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-700" },
  { name: "Mobile Development", icon: "📱", courses: 52, color: "from-green-500 to-emerald-500", bg: "bg-green-50", text: "text-green-700" },
  { name: "Machine Learning", icon: "🤖", courses: 71, color: "from-indigo-500 to-blue-500", bg: "bg-indigo-50", text: "text-indigo-700" },
  { name: "Cybersecurity", icon: "🔐", courses: 38, color: "from-red-500 to-orange-500", bg: "bg-red-50", text: "text-red-700" },
  { name: "Business & Finance", icon: "💼", courses: 95, color: "from-amber-500 to-yellow-500", bg: "bg-amber-50", text: "text-amber-700" },
  { name: "Cloud Computing", icon: "☁️", courses: 44, color: "from-sky-500 to-blue-500", bg: "bg-sky-50", text: "text-sky-700" },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Browse Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Explore by Topic
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            From coding to creativity — find the perfect course in your area of interest.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`group relative overflow-hidden ${cat.bg} border border-transparent hover:border-slate-200 rounded-2xl p-6 text-left transition-all duration-200 card-hover`}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cat.color} opacity-10 rounded-full -translate-y-6 translate-x-6 group-hover:opacity-20 transition-opacity`} />

              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className={`font-bold text-sm sm:text-base ${cat.text} mb-1`}>{cat.name}</h3>
              <p className="text-slate-400 text-xs">{cat.courses} courses</p>

              {/* Arrow */}
              <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${cat.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Explore
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
