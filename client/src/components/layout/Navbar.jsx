import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Scissors } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Courses" },
  { to: "/curriculum", label: "Curriculum" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { firebaseUser, profile, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink-900/95 backdrop-blur border-b border-white/5" : "bg-transparent"
      }`}
    >
      <nav className="container-institute flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-thread-gold/40 text-thread-gold">
            <Scissors size={16} />
          </span>
          <span className="font-display leading-tight">
            <span className="block text-[15px] tracking-wide text-fabric-100">New Ideal</span>
            <span className="block text-[11px] tracking-wide text-fabric-500">Cutting & Stitching</span>
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm transition-colors ${
                  isActive ? "text-thread-gold" : "text-fabric-300 hover:text-fabric-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-4">
          {firebaseUser ? (
            <>
              <Link
                to={profile?.role === "admin" ? "/admin" : "/dashboard"}
                className="text-sm text-fabric-300 hover:text-fabric-100"
              >
                {profile?.role === "admin" ? "Admin" : "Dashboard"}
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                className="text-sm text-fabric-500 hover:text-fabric-100"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-fabric-300 hover:text-fabric-100">
              Login
            </Link>
          )}
          <Link
            to="/courses"
            className="rounded-full bg-thread-gold px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-gold transition-transform hover:scale-[1.02]"
          >
            Explore Courses
          </Link>
        </div>

        <button className="xl:hidden text-fabric-100" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={26} />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink-900 xl:hidden">
          <div className="container-institute flex h-20 items-center justify-between">
            <span className="font-display text-fabric-100">New Ideal</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-fabric-100">
              <X size={26} />
            </button>
          </div>
          <div className="container-institute flex flex-col gap-1 pt-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-4 text-lg text-fabric-100"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              {firebaseUser ? (
                <Link
                  to={profile?.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/15 py-3 text-center text-fabric-100"
                >
                  {profile?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/15 py-3 text-center text-fabric-100"
                >
                  Login
                </Link>
              )}
              <Link
                to="/courses"
                onClick={() => setOpen(false)}
                className="rounded-full bg-thread-gold py-3 text-center font-semibold text-ink-900"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
