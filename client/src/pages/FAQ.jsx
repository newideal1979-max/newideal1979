const faqs = [
  ["Who can join the course?", "Anyone interested in learning professional tailoring, regardless of prior experience."],
  ["Are the courses available online?", "Yes — both courses are available online, alongside the institute's offline classes."],
  ["Are offline classes still available?", "Yes, offline classes continue at the Relief Road location in Ahmedabad."],
  ["How long is the course?", "Each course runs for 4 months."],
  ["What is the course fee?", "₹10,000 for either course."],
  ["Do I need previous tailoring experience?", "No — the curriculum starts from foundational skills."],
  ["Are men's and women's courses separate?", "Yes, each has its own curriculum and course material."],
  ["How do I enroll?", "Create an account, choose a course, and complete payment through the course page."],
  ["How does online learning work?", "You get access to a structured video curriculum and your own progress dashboard."],
  ["Can I learn from outside Ahmedabad?", "Yes — the online course is built for students anywhere."],
  ["What happens after payment?", "Your enrollment activates immediately and you're taken to your dashboard."],
  ["How can I contact the institute?", "Through the Contact page, by phone, email, or WhatsApp."],
];

export default function FAQ() {
  return (
    <div className="container-institute py-16 lg:py-24">
      <h1 className="font-display text-4xl text-fabric-100">Frequently Asked Questions</h1>
      <div className="mt-10 max-w-2xl divide-y divide-white/8 border-y border-white/8">
        {faqs.map(([q, a]) => (
          <details key={q} className="py-5">
            <summary className="cursor-pointer text-fabric-100">{q}</summary>
            <p className="mt-2 text-sm leading-relaxed text-fabric-500">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
