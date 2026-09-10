import mongoose from "mongoose";

// Singleton document — there is only ever one SiteSettings row. This is what lets the
// institute update phone/address/hours/hero copy from the admin panel with zero code changes.
const siteSettingsSchema = new mongoose.Schema(
  {
    instituteName: { type: String, default: "New Ideal Cutting and Stitching Institute" },
    founder: { type: String, default: "Ilyas Mansuri" },
    currentDirector: { type: String, default: "Tosifahmed Mansuri" },
    foundedYear: { type: Number, default: 1979 },

    phone: { type: String, required: true }, // single source of truth for calls + WhatsApp
    email: { type: String, default: "newideal1979@gmail.com" },
    address: {
      line1: { type: String, default: "422 4th Floor, Relief Shopping Center" },
      line2: { type: String, default: "Nr GPO, S.V. College Road, Relief Road" },
      city: { type: String, default: "Ahmedabad" },
      pincode: { type: String, default: "380001" },
    },
    classTimings: {
      morning: { type: String, default: "10 AM – 1 PM" },
      evening: { type: String, default: "2 PM – 6 PM" },
    },
    whatsappNumber: { type: String }, // 10-digit, no country code — see whatsapp util
    googleMapsUrl: { type: String },

    studentsTrainedOverride: { type: Number }, // if unset, computed live from Enrollment count

    heroHeading: { type: String, default: "Master the Art of Cutting & Stitching" },
    heroDescription: {
      type: String,
      default:
        "Learn professional men's and women's tailoring from an institute carrying a legacy since 1979 — now available online from anywhere in the world.",
    },
    aboutText: { type: String },
    footerText: { type: String },
    socialLinks: {
      instagram: String,
      facebook: String,
      youtube: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
