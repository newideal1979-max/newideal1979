const steps = [
  { n: "01", title: "Choose Your Course", body: "Pick men's or women's tailoring based on what you want to learn." },
  { n: "02", title: "Create Your Account", body: "Sign up with your email — required before enrollment." },
  { n: "03", title: "Complete Secure Payment", body: "Pay through Razorpay; your payment is verified before anything is granted." },
  { n: "04", title: "Start Learning", body: "Get instant access to your course dashboard and curriculum." },
];

export default function HowItWorks() {
  return (
    <div className="container-institute py-16 lg:py-24">
      <h1 className="font-display text-4xl text-fabric-100">How It Works</h1>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="border-t border-thread-gold/40 pt-5">
            <span className="font-display text-2xl text-thread-gold">{s.n}</span>
            <h3 className="mt-3 text-base font-semibold text-fabric-100">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fabric-500">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
