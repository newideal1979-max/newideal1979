import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Check, Clock, MonitorSmartphone, ShieldCheck } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { loadRazorpayScript } from "../utils/loadRazorpay";

export default function CourseDetails() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/courses/${slug}`).then(({ data }) => setCourse(data.data)).catch(() => setError("Course not found."));
  }, [slug]);

  useEffect(() => {
    if (course && firebaseUser) {
      api.get(`/enrollments/me/${course._id}`).then(({ data }) => setEnrollment(data.data));
    }
  }, [course, firebaseUser]);

  const startEnrollment = useCallback(async () => {
    if (!course) return;

    if (!firebaseUser) {
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${slug}?enroll=1`)}`);
      return;
    }

    setError(null);
    setPaying(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Payment gateway failed to load. Check your connection.");

      const { data } = await api.post("/payments/create-order", { courseId: course._id });
      const order = data.data;

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "New Ideal Cutting and Stitching Institute",
        description: order.courseName,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await api.post("/payments/verify", response);
            navigate(`/payment-success?course=${slug}`);
          } catch {
            navigate(`/payment-failed?course=${slug}`);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
        theme: { color: "#C89B3C" },
      });
      rzp.on("payment.failed", () => navigate(`/payment-failed?course=${slug}`));
      rzp.open();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Something went wrong starting checkout.");
      setPaying(false);
    }
  }, [course, firebaseUser, navigate, slug]);

  useEffect(() => {
    if (course && firebaseUser && params.get("enroll") === "1" && !enrollment) {
      startEnrollment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, firebaseUser, enrollment]);

  if (error && !course) return <div className="container-institute py-24 text-fabric-500">{error}</div>;
  if (!course) return <div className="container-institute py-24 text-fabric-500">Loading course…</div>;

  return (
    <div className="container-institute grid gap-12 py-16 lg:grid-cols-[1fr_360px] lg:py-24">
      <div>
        <h1 className="font-display text-4xl text-fabric-100">{course.name}</h1>
        <p className="mt-3 text-lg text-fabric-500">{course.subtitle}</p>
        <p className="mt-8 max-w-2xl leading-relaxed text-fabric-300">{course.description}</p>

        {course.learningOutcomes?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-fabric-100">What you'll be able to do</h2>
            <ul className="mt-4 space-y-3">
              {course.learningOutcomes.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm text-fabric-300">
                  <Check size={15} className="mt-0.5 shrink-0 text-thread-gold" /> {o}
                </li>
              ))}
            </ul>
          </div>
        )}

        {course.features?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-fabric-100">What's covered</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-fabric-300">
                  <Check size={15} className="mt-0.5 shrink-0 text-thread-gold" /> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(course.whoItsFor?.length > 0 || course.prerequisites?.length > 0) && (
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {course.whoItsFor?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-fabric-100">Who this is for</h2>
                <ul className="mt-4 space-y-2.5">
                  {course.whoItsFor.map((w) => (
                    <li key={w} className="text-sm text-fabric-500">{w}</li>
                  ))}
                </ul>
              </div>
            )}
            {course.prerequisites?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-fabric-100">Before you start</h2>
                <ul className="mt-4 space-y-2.5">
                  {course.prerequisites.map((p) => (
                    <li key={p} className="text-sm text-fabric-500">{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {course.faqs?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-fabric-100">Frequently asked</h2>
            <div className="mt-4 divide-y divide-white/8 border-y border-white/8">
              {course.faqs.map((f, i) => (
                <details key={i} className="py-4">
                  <summary className="cursor-pointer text-fabric-100">{f.question}</summary>
                  <p className="mt-2 text-sm text-fabric-500">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* sticky enrollment card */}
      <aside className="h-fit rounded-2xl border border-white/8 bg-ink-800 p-7 lg:sticky lg:top-28">
        <div className="font-display text-3xl text-thread-gold">₹{course.price?.toLocaleString("en-IN")}</div>
        <div className="mt-4 space-y-2.5 text-sm text-fabric-500">
          <p className="flex items-center gap-2"><Clock size={14} /> {course.duration}</p>
          <p className="flex items-center gap-2"><MonitorSmartphone size={14} /> {course.mode}</p>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {enrollment ? (
          <>
            <p className="mt-6 text-sm text-thread-gold">You're already enrolled.</p>
            <button
              onClick={() => navigate("/my-courses")}
              className="mt-3 w-full rounded-full bg-thread-gold py-3 text-sm font-semibold text-ink-900"
            >
              Continue Learning
            </button>
          </>
        ) : (
          <button
            onClick={startEnrollment}
            disabled={paying}
            className="mt-6 w-full rounded-full bg-thread-gold py-3 text-sm font-semibold text-ink-900 shadow-gold disabled:opacity-60"
          >
            {paying ? "Opening secure checkout…" : `Enroll Now — ₹${course.price?.toLocaleString("en-IN")}`}
          </button>
        )}

        <p className="mt-4 flex items-center gap-2 text-xs text-fabric-500">
          <ShieldCheck size={14} className="text-thread-gold" /> Secured by Razorpay. Verified server-side.
        </p>
      </aside>
    </div>
  );
}
