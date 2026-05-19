const stats = [
  { icon: "👨‍🎓", value: "50,000+", label: "Active Students", color: "text-indigo-600" },
  { icon: "📖", value: "500+", label: "Expert Courses", color: "text-purple-600" },
  { icon: "👨‍🏫", value: "120+", label: "Top Instructors", color: "text-pink-600" },
  { icon: "🏅", value: "35,000+", label: "Certificates Issued", color: "text-amber-600" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className={`text-3xl font-extrabold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
