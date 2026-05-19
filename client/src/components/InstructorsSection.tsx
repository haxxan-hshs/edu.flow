const instructors = [
  {
    name: "Dr. James Wilson",
    title: "Python & Data Science Expert",
    students: "18,500+",
    courses: 8,
    rating: 4.9,
    avatar: "JW",
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
    bio: "PhD in Computer Science from MIT. 15+ years of industry experience at Google and Amazon.",
    tags: ["Python", "Data Science", "ML"],
  },
  {
    name: "Sarah Johnson",
    title: "Full-Stack React Developer",
    students: "12,300+",
    courses: 5,
    rating: 4.8,
    avatar: "SJ",
    color: "bg-gradient-to-br from-cyan-400 to-blue-500",
    bio: "Senior Engineer at Meta. Passionate about teaching modern web development.",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    name: "Emily Chen",
    title: "UI/UX Design Lead",
    students: "9,800+",
    courses: 4,
    rating: 4.9,
    avatar: "EC",
    color: "bg-gradient-to-br from-pink-400 to-purple-500",
    bio: "Design Lead at Airbnb. Specializes in user-centered design and Figma workflows.",
    tags: ["Figma", "UI Design", "UX"],
  },
  {
    name: "Prof. Alex Kumar",
    title: "AI & Machine Learning Researcher",
    students: "22,000+",
    courses: 6,
    rating: 4.7,
    avatar: "AK",
    color: "bg-gradient-to-br from-violet-400 to-indigo-500",
    bio: "Professor at Stanford. Published 40+ research papers on AI and deep learning.",
    tags: ["AI", "Deep Learning", "Python"],
  },
];

export default function InstructorsSection() {
  return (
    <section id="instructors" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Meet the Experts
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Learn from Industry Leaders
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Our instructors are working professionals and academics with real-world experience in their fields.
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <div
              key={instructor.name}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden card-hover group"
            >
              {/* Avatar Header */}
              <div className={`${instructor.color} h-28 flex items-center justify-center`}>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-extrabold text-2xl border-4 border-white/30">
                  {instructor.avatar}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 text-center">
                <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                  {instructor.name}
                </h3>
                <p className="text-indigo-600 text-xs font-semibold mb-3">{instructor.title}</p>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{instructor.bio}</p>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {instructor.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{instructor.students}</p>
                    <p className="text-xs text-slate-400">Students</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{instructor.courses}</p>
                    <p className="text-xs text-slate-400">Courses</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-500">⭐ {instructor.rating}</p>
                    <p className="text-xs text-slate-400">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become Instructor CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Are You an Expert? Teach on EduFlow</h3>
          <p className="text-indigo-200 mb-6 max-w-xl mx-auto">
            Share your knowledge with 50,000+ students worldwide. Earn money doing what you love and build your personal brand.
          </p>
          <button className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Become an Instructor
          </button>
        </div>
      </div>
    </section>
  );
}
