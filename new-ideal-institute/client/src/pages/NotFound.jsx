import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-institute flex min-h-[60vh] flex-col items-center justify-center text-center py-24">
      <h1 className="font-display text-6xl text-thread-gold">404</h1>
      <p className="mt-4 text-fabric-500">This page doesn't exist.</p>
      <Link to="/" className="mt-8 rounded-full bg-thread-gold px-6 py-3 text-sm font-semibold text-ink-900">
        Back to Home
      </Link>
    </div>
  );
}
