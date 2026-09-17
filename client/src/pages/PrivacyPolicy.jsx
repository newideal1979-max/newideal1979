export default function PrivacyPolicy() {
  return (
    <div className="container-institute max-w-2xl py-16 lg:py-24">
      <h1 className="font-display text-4xl text-fabric-100">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-fabric-300">
        <p>
          New Ideal Cutting and Stitching Institute collects the information you provide when you
          create an account, enroll in a course, or contact us — your name, email, phone number,
          and course activity. This is used only to run your account, deliver course access, and
          respond to inquiries.
        </p>
        <div>
          <h2 className="text-base font-semibold text-fabric-100">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Account details you provide at signup (name, email, phone)</li>
            <li>Authentication data managed by Firebase Authentication</li>
            <li>Enrollment, progress, and payment records tied to your account</li>
            <li>Inquiry form submissions</li>
          </ul>
        </div>
        <div>
          <h2 className="text-base font-semibold text-fabric-100">What we don't do</h2>
          <p className="mt-2">
            We never store your password — authentication is handled entirely by Firebase. We do
            not sell your data to third parties. Payment card details are handled by Razorpay and
            never touch our servers.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-fabric-100">Contact</h2>
          <p className="mt-2">
            For any privacy questions, reach us via the details on our{" "}
            <a href="/contact" className="text-thread-gold">Contact page</a>.
          </p>
        </div>
        <p className="text-xs text-fabric-500">
          This is a template policy. Have it reviewed by a professional before publishing, since it
          hasn't been drafted or verified by a lawyer.
        </p>
      </div>
    </div>
  );
}
