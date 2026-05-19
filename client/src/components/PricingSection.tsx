const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for exploring and getting started with learning.",
    color: "border-slate-200",
    buttonStyle: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    badge: null,
    highlight: false,
  },
  {
    name: "Pro",
    price: 29,
    period: "per month",
    description: "For serious learners who want unlimited access to all courses.",
    color: "border-indigo-500 ring-2 ring-indigo-500",
    buttonStyle: "bg-indigo-600 text-white hover:bg-indigo-700",
    badge: "Most Popular",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 79,
    period: "per month",
    description: "For teams and organizations that need advanced features.",
    color: "border-slate-200",
    buttonStyle: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    badge: null,
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Choose the plan that fits your learning goals. Upgrade or cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 mt-6 bg-slate-100 p-1 rounded-xl">
            <button className="px-5 py-2 bg-white text-slate-900 font-semibold text-sm rounded-lg shadow-sm">
              Monthly
            </button>
            <button className="px-5 py-2 text-slate-500 font-medium text-sm rounded-lg hover:text-slate-700 transition-colors">
              Annual
              <span className="ml-2 text-xs text-green-600 font-bold">Save 40%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative border ${plan.color} rounded-2xl p-8 flex flex-col items-center text-center ${
                plan.highlight ? "bg-indigo-50/40" : "bg-white"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-slate-900">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-slate-400 text-sm ml-1">/{plan.period}</span>
                )}
              </div>

              {/* CTA */}
              <button
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${plan.buttonStyle}`}
              >
                {plan.price === 0 ? "Get Started Free" : `Start ${plan.name} Plan`}
              </button>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <div className="text-center mt-10">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            30-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}
