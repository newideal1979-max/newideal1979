import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Layers, Users, CreditCard, MessageSquare, Star, Menu, X, LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/curriculum", label: "Curriculum", icon: Layers },
  { to: "/admin/enrollments", label: "Enrollments", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
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
    <div className="flex min-h-screen bg-ink-900">
      <aside className="hidden w-64 shrink-0 border-r border-white/8 p-6 lg:block">
        <p className="font-display text-lg text-fabric-100">Admin Panel</p>
        <div className="mt-6">{nav}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink-900 p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg text-fabric-100">Admin Panel</p>
            <button onClick={() => setOpen(false)} className="text-fabric-100"><X size={22} /></button>
          </div>
          <div className="mt-6">{nav}</div>
        </div>
      )}

      <div className="flex-1 p-6 lg:p-10">
        <button onClick={() => setOpen(true)} className="mb-6 flex items-center gap-2 text-sm text-fabric-100 lg:hidden">
          <Menu size={18} /> Menu
        </button>
        <Outlet />
      </div>
    </div>
  );
}
