import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "Complete Python Bootcamp: From Zero to Hero",
    instructor: "Dr. James Wilson",
    rating: 4.9,
    reviews: 3241,
    students: 18500,
    price: 89.99,
    originalPrice: 199.99,
    duration: "52 hours",
    level: "Beginner",
    badge: "Bestseller",
    badgeColor: "bg-amber-400 text-amber-900",
    emoji: "🐍",
    gradient: "from-yellow-400 to-orange-500",
    tags: ["Python", "Programming", "Data Science"],
  },
  {
    id: 2,
    title: "React & Next.js: The Complete Developer Guide",
    instructor: "Sarah Johnson",
    rating: 4.8,
    reviews: 2187,
    students: 12300,
    price: 79.99,
    originalPrice: 179.99,
    duration: "42 hours",
    level: "Intermediate",
    badge: "Hot",
    badgeColor: "bg-red-400 text-white",
    emoji: "⚛️",
    gradient: "from-cyan-400 to-blue-500",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass with Figma",
    instructor: "Emily Chen",
    rating: 4.9,
    reviews: 1854,
    students: 9800,
    price: 69.99,
    originalPrice: 149.99,
    duration: "38 hours",
    level: "All Levels",
    badge: "New",
    badgeColor: "bg-green-400 text-green-900",
    emoji: "🎨",
    gradient: "from-pink-400 to-purple-500",
    tags: ["Figma", "UI Design", "UX Research"],
  },
  {
    id: 4,
    title: "Machine Learning A-Z with Python & R",
    instructor: "Prof. Alex Kumar",
    rating: 4.7,
    reviews: 4102,
    students: 22000,
    price: 94.99,
    originalPrice: 219.99,
    duration: "65 hours",
    level: "Advanced",
    badge: "Bestseller",
    badgeColor: "bg-amber-400 text-amber-900",
    emoji: "🤖",
    gradient: "from-violet-400 to-indigo-500",
    tags: ["ML", "Python", "AI"],
  },
  {
    id: 5,
    title: "Node.js & Express: Backend Development",
    instructor: "Marcus Lee",
    rating: 4.8,
    reviews: 1623,
    students: 8700,
    price: 74.99,
    originalPrice: 169.99,
    duration: "35 hours",
    level: "Intermediate",
    badge: "Popular",
    badgeColor: "bg-blue-400 text-white",
    emoji: "🟢",
    gradient: "from-green-400 to-teal-500",
    tags: ["Node.js", "Express", "REST API"],
  },
  {
    id: 6,
    title: "Digital Marketing & SEO Complete Course",
    instructor: "Rachel Torres",
    rating: 4.6,
    reviews: 987,
    students: 5400,
    price: 59.99,
    originalPrice: 129.99,
    duration: "28 hours",
    level: "Beginner",
    badge: "New",
    badgeColor: "bg-green-400 text-green-900",
    emoji: "📈",
    gradient: "from-orange-400 to-red-500",
    tags: ["SEO", "Marketing", "Analytics"],
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function FeaturedCourses() {
  return (
    <section id="courses" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Featured Courses
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Learn from the Best
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Hand-picked courses taught by industry experts. Start learning today and build skills that employers are looking for.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["All", "Programming", "Design", "Business", "Data Science", "Marketing"].map((tab, i) => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm card-hover group"
            >
              {/* Course Thumbnail */}
              <div className={`relative h-44 bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
                <span className="text-6xl">{course.emoji}</span>
                {/* Badge */}
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${course.badgeColor}`}>
                  {course.badge}
                </span>
                {/* Discount */}
                <span className="absolute top-3 right-3 text-xs font-bold bg-white/90 text-slate-700 px-2 py-1 rounded-full">
                  {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                </span>
              </div>

              {/* Course Info */}
              <div className="p-5">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {course.tags.map((tag) => (
                    <span key={tag} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>

                <p className="text-slate-500 text-sm mb-3">by {course.instructor}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-amber-500">{course.rating}</span>
                  <StarRating rating={course.rating} />
                  <span className="text-xs text-slate-400">({course.reviews.toLocaleString()})</span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </span>
                  <span>•</span>
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>{course.students.toLocaleString()} students</span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">${course.price}</span>
                    <span className="text-sm text-slate-400 line-through ml-2">${course.originalPrice}</span>
                  </div>
                  <button className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 border-2 border-indigo-200 hover:border-indigo-400 px-8 py-3 rounded-xl transition-colors"
          >
            View All 500+ Courses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
