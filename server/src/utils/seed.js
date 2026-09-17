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
    learningOutcomes: [
      "Take accurate body measurements for men's garments",
      "Draft and cut patterns for pants, shirts, kurta, and pajama",
      "Stitch a complete garment from the first cut to the final seam",
      "Apply professional finishing techniques for a clean, wearable result",
      "Choose the right fabric for a given garment and use case",
      "Fit and adjust a finished garment to the wearer's body",
    ],
    whoItsFor: [
      "Complete beginners with no prior tailoring experience",
      "Anyone who wants to turn stitching into a practical, paid skill",
      "Students who prefer a structured, step-by-step course over trial and error",
    ],
    prerequisites: [
      "No prior tailoring experience required",
      "Access to a sewing machine is recommended for practice, but not required to follow the lessons",
    ],
    faqs: [
      {
        question: "Is a sewing machine required to join?",
        answer:
          "You don't need one to enroll. Having access to a sewing machine helps you practice alongside the lessons, but it isn't required to follow the curriculum.",
      },
      {
        question: "Can I switch between online and offline classes?",
        answer:
          "The institute teaches both. If you'd like to move from online to in-person classes at the Relief Road location (or the other way around), reach out through the Contact page.",
      },
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
    learningOutcomes: [
      "Take accurate body measurements for women's garments",
      "Draft and cut patterns for salwar suits, plazo, tops, and Anarkali designs",
      "Stitch a complete garment from the first cut to the final seam",
      "Apply designer-level finishing techniques",
      "Adapt a base pattern into different fits and design variations",
      "Fit and adjust a finished garment to the wearer's body",
    ],
    whoItsFor: [
      "Complete beginners with no prior tailoring experience",
      "Anyone who wants to turn stitching into a practical, paid skill",
      "Students who prefer a structured, step-by-step course over trial and error",
    ],
    prerequisites: [
      "No prior tailoring experience required",
      "Access to a sewing machine is recommended for practice, but not required to follow the lessons",
    ],
    faqs: [
      {
        question: "Is a sewing machine required to join?",
        answer:
          "You don't need one to enroll. Having access to a sewing machine helps you practice alongside the lessons, but it isn't required to follow the curriculum.",
      },
      {
        question: "Can I switch between online and offline classes?",
        answer:
          "The institute teaches both. If you'd like to move from online to in-person classes at the Relief Road location (or the other way around), reach out through the Contact page.",
      },
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

  // Confirmed by the institute: 7383249007 (10-digit). Override with INSTITUTE_PHONE in
  // server/.env if this ever changes — never hardcode a number that hasn't been confirmed.
  const phone = process.env.INSTITUTE_PHONE || "7383249007";
  if (phone.replace(/\D/g, "").length !== 10) {
    throw new Error(`INSTITUTE_PHONE "${phone}" is not a valid 10-digit number.`);
  }

  await SiteSettings.findOneAndUpdate(
    {},
    {
      phone,
      whatsappNumber: process.env.INSTITUTE_WHATSAPP || phone,
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
