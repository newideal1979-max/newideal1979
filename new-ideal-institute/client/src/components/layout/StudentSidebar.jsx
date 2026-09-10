import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, Receipt, UserRound, HelpCircle, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/my-courses", label: "My Courses", icon: BookOpen },
  { to: "/orders", label: "Payments", icon: Receipt },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/faq", label: "Help", icon: HelpCircle },
];

export default function StudentSidebar() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const content = (
    <nav className="flex flex-col gap-1">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
              isActive ? "bg-thread-gold/10 text-thread-gold" : "text-fabric-300 hover:text-fabric-100"
            }`
          }
        >
          <Icon size={16} /> {label}
        </NavLink>
      ))}
      <button onClick={logout} className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-fabric-500 hover:text-fabric-100">
        <LogOut size={16} /> Logout
      </button>
    </nav>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="mb-4 flex items-center gap-2 text-sm text-fabric-100 lg:hidden">
        <Menu size={18} /> Menu
      </button>

      <aside className="hidden lg:block">{content}</aside>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink-900 lg:hidden">
          <div className="flex items-center justify-between px-5 py-5">
            <span className="font-display text-fabric-100">Dashboard</span>
            <button onClick={() => setOpen(false)} className="text-fabric-100"><X size={22} /></button>
          </div>
          <div className="px-5">{content}</div>
        </div>
      )}
    </>
  );
}
