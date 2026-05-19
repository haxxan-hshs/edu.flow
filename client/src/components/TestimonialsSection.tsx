const testimonials = [
  {
    name: "Aisha Patel",
    role: "Frontend Developer at Google",
    avatar: "AP",
    avatarColor: "bg-indigo-500",
    rating: 5,
    text: "EduFlow completely changed my career. I went from knowing nothing about coding to landing a job at Google in just 8 months. The React & Next.js course was incredibly well-structured and practical.",
    course: "React & Next.js Complete Guide",
  },
  {
    name: "Carlos Mendez",
    role: "Data Scientist at Amazon",
    avatar: "CM",
    avatarColor: "bg-purple-500",
    rating: 5,
    text: "The Machine Learning course on EduFlow is hands-down the best I've found online. The instructor explains complex concepts in a way that actually makes sense. Worth every penny.",
    course: "Machine Learning A-Z",
  },
  {
    name: "Priya Sharma",
    role: "UX Designer at Spotify",
    avatar: "PS",
    avatarColor: "bg-pink-500",
    rating: 5,
    text: "I took the UI/UX Design Masterclass and it gave me the confidence to switch careers. The Figma projects were real-world and my portfolio now stands out. Got hired within 3 months!",
    course: "UI/UX Design Masterclass",
  },
  {
    name: "James O'Brien",
    role: "Full-Stack Developer at Stripe",
    avatar: "JO",
    avatarColor: "bg-green-500",
    rating: 5,
    text: "The Python Bootcamp is phenomenal. I started with zero programming experience and now I'm building full applications. The community support and instructor feedback are top-notch.",
    course: "Complete Python Bootcamp",
  },
  {
    name: "Yuki Tanaka",
    role: "Backend Engineer at Netflix",
    avatar: "YT",
    avatarColor: "bg-amber-500",
    rating: 5,
    text: "EduFlow's Node.js course taught me everything I needed to build production-ready APIs. The certificate helped me get noticed by recruiters and land my dream job.",
    course: "Node.js & Express Backend",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Marketing Manager at HubSpot",
    avatar: "FA",
    avatarColor: "bg-red-500",
    rating: 5,
    text: "The Digital Marketing course was exactly what I needed to level up my career. Practical, up-to-date, and the instructor is incredibly knowledgeable. Highly recommend!",
    course: "Digital Marketing & SEO",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Student Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Real Results from Real Learners
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Join thousands of students who transformed their careers with EduFlow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-6 card-hover"
            >
              {/* Quote icon */}
              <div className="text-indigo-200 text-5xl font-serif leading-none mb-4">&ldquo;</div>

              {/* Stars */}
              <StarRating count={t.rating} />

              {/* Text */}
              <p className="text-slate-600 text-sm leading-relaxed mt-3 mb-5">{t.text}</p>

              {/* Course tag */}
              <div className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block mb-5 font-medium">
                📚 {t.course}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div className={`w-10 h-10 ${t.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-extrabold text-indigo-600">4.8/5</p>
            <p className="text-slate-500 text-sm">Average Rating</p>
          </div>
          <div className="w-px bg-slate-200 hidden sm:block" />
          <div>
            <p className="text-2xl font-extrabold text-indigo-600">98%</p>
            <p className="text-slate-500 text-sm">Satisfaction Rate</p>
          </div>
          <div className="w-px bg-slate-200 hidden sm:block" />
          <div>
            <p className="text-2xl font-extrabold text-indigo-600">35k+</p>
            <p className="text-slate-500 text-sm">Reviews Written</p>
          </div>
          <div className="w-px bg-slate-200 hidden sm:block" />
          <div>
            <p className="text-2xl font-extrabold text-indigo-600">87%</p>
            <p className="text-slate-500 text-sm">Career Advancement</p>
          </div>
        </div>
      </div>
    </section>
  );
}
