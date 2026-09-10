import SiteSettings from "../models/SiteSettings.js";
import Enrollment from "../models/Enrollment.js";

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({ phone: process.env.INSTITUTE_PHONE_FALLBACK || "0000000000" });
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
