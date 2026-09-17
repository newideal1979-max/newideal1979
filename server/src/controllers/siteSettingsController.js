import SiteSettings from "../models/SiteSettings.js";
import Enrollment from "../models/Enrollment.js";

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    // Same confirmed number and env var as seed.js (INSTITUTE_PHONE) — kept in sync so this
    // auto-create path (which only fires if the seed script was never run) doesn't show a
    // placeholder zero number on a live site.
    settings = await SiteSettings.create({ phone: process.env.INSTITUTE_PHONE || "7383249007" });
  }
  return settings;
}

export async function getPublicSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    const studentsTrained =
      settings.studentsTrainedOverride ??
      (await Enrollment.countDocuments({ paymentStatus: "paid" }));

    res.json({
      success: true,
      message: "Settings fetched.",
      data: { ...settings.toObject(), studentsTrained },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, message: "Settings updated.", data: settings });
  } catch (err) {
    next(err);
  }
}
