import "dotenv/config";
import { connectDB } from "../config/db.js";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import CurriculumModule from "../models/Curriculum.js";
import SiteSettings from "../models/SiteSettings.js";

// Per the content rule: only real, provided information is seeded. No fake students,
// payments, or testimonials — those start empty and fill up from real activity.

const coursesData = [
  {
    name: "Men's Professional Tailoring",
    slug: "mens-professional-tailoring",
    subtitle: "Master the complete art of men's cutting and stitching.",
    description:
      "A complete 4-month program covering men's garment cutting, stitching, and finishing — from fundamentals to professional-level construction.",
    category: "mens",
    price: 10000,
    duration: "4 Months",
    mode: "Online + Offline",
    badge: "Most Popular",
    features: [
      "Pant Cutting & Stitching",
      "Shirt Pattern Making",
      "Kurta Construction",
      "Pajama Techniques",
      "Professional Measurements",
      "Fabric Selection",
      "Advanced Finishing",
      "Custom Fitting",
    ],
    status: "published",
    order: 1,
  },
  {
    name: "Women's Designer Tailoring",
    slug: "womens-designer-tailoring",
    subtitle: "From basics to designer fashion — master women's tailoring.",
    description:
      "A complete 4-month program covering women's garment cutting, stitching, and designer finishing — from fundamentals to fashion-ready construction.",
    category: "womens",
    price: 10000,
    duration: "4 Months",
    mode: "Online + Offline",
    badge: "Bestseller",
    features: [
      "Salwar Suit Stitching",
      "Plazo & Wide Leg",
      "Measurement Techniques",
      "Designer Finishing",
      "Anarkali Design",
      "Top Construction",
      "Pattern Making",
      "Fashion Stitching",
    ],
    status: "published",
    order: 2,
  },
];

const levelTitles = [
  { level: 1, title: "Foundation Skills", description: "Understanding tools, fabrics, and the basics of stitching." },
  { level: 2, title: "Pattern Making", description: "Drafting and adapting patterns for real garments." },
  { level: 3, title: "Professional Cutting", description: "Precision cutting techniques for finished garments." },
  { level: 4, title: "Finishing & Career", description: "Final finishing, quality checks, and career readiness." },
];

async function seed() {
  await connectDB();

  for (const courseData of coursesData) {
    const course = await Course.findOneAndUpdate(
      { slug: courseData.slug },
      courseData,
      { upsert: true, new: true }
    );
    console.log(`[seed] upserted course: ${course.name}`);

    for (const lvl of levelTitles) {
      await CurriculumModule.findOneAndUpdate(
        { course: course._id, level: lvl.level },
        { course: course._id, ...lvl },
        { upsert: true }
      );
    }
    console.log(`[seed]   upserted 4 curriculum levels for ${course.name}`);
  }

  // The phone number supplied in the project brief ("738324007") is only 9 digits —
  // one short of a valid Indian mobile number. Rather than guess the missing digit,
  // this seed script REQUIRES the correct 10-digit number in server/.env before seeding.
  if (!process.env.INSTITUTE_PHONE || process.env.INSTITUTE_PHONE.length !== 10) {
    throw new Error(
      "Set INSTITUTE_PHONE in server/.env to the correct 10-digit institute phone number. " +
        "The brief's number (738324007) is 9 digits and can't be seeded as-is — confirm the " +
        "real number with the institute before running this script."
    );
  }

  await SiteSettings.findOneAndUpdate(
    {},
    {
      phone: process.env.INSTITUTE_PHONE,
      whatsappNumber: process.env.INSTITUTE_WHATSAPP || process.env.INSTITUTE_PHONE,
      email: "newideal1979@gmail.com",
    },
    { upsert: true }
  );
  console.log("[seed] site settings ensured");

  await mongoose.disconnect();
  console.log("[seed] done");
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
