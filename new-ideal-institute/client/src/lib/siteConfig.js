// Static fallback used only until /api/settings has loaded (see SiteSettingsContext).
// This is what the whole spec's "one central configuration" rule for phone numbers means:
// every WhatsApp link, tel: link, and displayed number reads from here or from the live
// SiteSettings API — never a number typed directly into a component.
export const staticSiteConfig = {
  instituteName: "New Ideal Cutting and Stitching Institute",
  foundedYear: 1979,
  founder: "Ilyas Mansuri",
  currentDirector: "Tosifahmed Mansuri",
  address: {
    line1: "422 4th Floor, Relief Shopping Center",
    line2: "Nr GPO, S.V. College Road, Relief Road",
    city: "Ahmedabad",
    pincode: "380001",
  },
  classTimings: { morning: "10 AM – 1 PM", evening: "2 PM – 6 PM" },
  email: "newideal1979@gmail.com",
  // Deliberately left null: the brief's phone number (738324007) is only 9 digits.
  // This must be set from the admin panel (SiteSettings) with the confirmed number
  // before WhatsApp/tel: links go live. See README "Known data gap" section.
  phone: null,
  whatsappNumber: null,
};

export function buildWhatsAppLink(number, message = "") {
  if (!number) return null;
  const digitsOnly = number.replace(/\D/g, "");
  const withCountryCode = digitsOnly.startsWith("91") ? digitsOnly : `91${digitsOnly}`;
  const text = encodeURIComponent(message);
  return `https://wa.me/${withCountryCode}${text ? `?text=${text}` : ""}`;
}

export function buildTelLink(number) {
  if (!number) return null;
  return `tel:+91${number.replace(/\D/g, "")}`;
}
