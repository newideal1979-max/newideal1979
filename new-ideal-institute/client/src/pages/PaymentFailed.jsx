import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

export default function PaymentFailed() {
  const [params] = useSearchParams();
  const settings = useSiteSettings();
  const course = params.get("course");

  return (
    <div className="container-institute flex min-h-[60vh] flex-col items-center justify-center text-center py-24">
      <XCircle className="text-red-400" size={56} />
      <h1 className="mt-6 font-display text-3xl text-fabric-100">Payment didn't go through</h1>
      <p className="mt-3 max-w-md text-fabric-500">
        No amount was enrolled without a verified payment. You can try again, or reach out if the issue continues.
      </p>
      <div className="mt-8 flex gap-4">
        {course && (
          <Link to={`/courses/${course}?enroll=1`} className="rounded-full bg-thread-gold px-6 py-3 text-sm font-semibold text-ink-900">
            Retry Payment
          </Link>
        )}
        <a href={`mailto:${settings.email}`} className="rounded-full border border-white/15 px-6 py-3 text-sm text-fabric-100">
          Contact Support
        </a>
      </div>
    </div>
  );
}
