const steps = [
  {
    step: "01",
    icon: "🔍",
    title: "Find Your Course",
    description:
      "Browse 500+ expert-led courses across programming, design, business, and more. Use filters to find exactly what you need.",
    color: "bg-indigo-50 border-indigo-200",
    stepColor: "text-indigo-600",
  },
  {
    step: "02",
    icon: "📝",
    title: "Enroll & Start Learning",
    description:
      "Sign up, enroll in your chosen course, and start learning immediately. Access video lessons, quizzes, and assignments anytime.",
    color: "bg-purple-50 border-purple-200",
    stepColor: "text-purple-600",
  },
  {
    step: "03",
    icon: "🏋️",
    title: "Practice & Build",
    description:
      "Apply your knowledge through hands-on projects, coding exercises, and real-world assignments designed by industry experts.",
    color: "bg-pink-50 border-pink-200",
    stepColor: "text-pink-600",
  },
  {
    step: "04",
    icon: "🏆",
    title: "Earn Your Certificate",
    description:
      "Complete the course and earn a verified certificate you can share on LinkedIn, your resume, or with employers.",
    color: "bg-amber-50 border-amber-200",
    stepColor: "text-amber-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Your Learning Journey
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Getting started is simple. Follow these four steps to go from beginner to certified professional.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-transparent z-0 -translate-y-1/2" />
              )}

              <div className={`relative z-10 border ${step.color} rounded-2xl p-6 text-center`}>
                {/* Step number */}
                <span className={`text-xs font-bold ${step.stepColor} uppercase tracking-widest`}>
                  Step {step.step}
                </span>

                {/* Icon */}
                <div className="text-5xl my-4">{step.icon}</div>

                <h3 className="font-bold text-slate-900 text-lg mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base">
            Start Learning Today — It&apos;s Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
