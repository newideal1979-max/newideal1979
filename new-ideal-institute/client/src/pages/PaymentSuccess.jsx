import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  return (
    <div className="container-institute flex min-h-[60vh] flex-col items-center justify-center text-center py-24">
      <CheckCircle2 className="text-thread-gold" size={56} />
      <h1 className="mt-6 font-display text-3xl text-fabric-100">Enrollment confirmed</h1>
      <p className="mt-3 max-w-md text-fabric-500">
        Your payment was verified and your seat is secured. You can start learning right away.
      </p>
      <Link to="/dashboard" className="mt-8 rounded-full bg-thread-gold px-6 py-3 text-sm font-semibold text-ink-900">
        Start Learning
      </Link>
      {params.get("course") && <p className="mt-3 text-xs text-fabric-500">Course: {params.get("course")}</p>}
    </div>
  );
}
