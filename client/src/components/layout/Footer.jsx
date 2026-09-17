import { Link } from "react-router-dom";
import { Scissors, Phone, Mail, MapPin } from "lucide-react";
import { useSiteSettings } from "../../contexts/SiteSettingsContext";
import { buildTelLink } from "../../lib/siteConfig";

export default function Footer() {
  const settings = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="container-institute grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-thread-gold/40 text-thread-gold">
              <Scissors size={16} />
            </span>
            <span className="font-display text-fabric-100">New Ideal</span>
          </div>
          <p className="mt-4 text-sm text-fabric-500">Since {settings.foundedYear}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-fabric-500">
            Practical tailoring education, taught the way it's been taught since {settings.foundedYear} —
            now open to students anywhere.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-fabric-100">Navigate</h4>
          <ul className="mt-4 space-y-3 text-sm text-fabric-500">
            <li><Link to="/" className="hover:text-fabric-100">Home</Link></li>
            <li><Link to="/about" className="hover:text-fabric-100">About</Link></li>
            <li><Link to="/courses" className="hover:text-fabric-100">Courses</Link></li>
            <li><Link to="/curriculum" className="hover:text-fabric-100">Curriculum</Link></li>
            <li><Link to="/contact" className="hover:text-fabric-100">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-fabric-100">Support</h4>
          <ul className="mt-4 space-y-3 text-sm text-fabric-500">
            <li><Link to="/faq" className="hover:text-fabric-100">FAQ</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-fabric-100">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-fabric-100">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="hover:text-fabric-100">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-fabric-100">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-fabric-500">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-thread-gold" />
              <span>{settings.address?.line1}, {settings.address?.line2}, {settings.address?.city} — {settings.address?.pincode}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-thread-gold" />
              <a href={`mailto:${settings.email}`} className="hover:text-fabric-100">{settings.email}</a>
            </li>
            {settings.phone && (
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-thread-gold" />
                <a href={buildTelLink(settings.phone)} className="hover:text-fabric-100">{settings.phone}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <p className="container-institute text-center text-xs text-fabric-500">
          © {year} New Ideal Cutting and Stitching Institute. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
