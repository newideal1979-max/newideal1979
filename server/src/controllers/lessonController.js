import CurriculumModule from "../models/Curriculum.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import { ApiError } from "../middleware/errorHandler.js";

// Public curriculum view: module/lesson titles and durations are visible to everyone
// (so visitors can see what they'd be learning), but videoUrl is stripped unless the
// lesson is a free preview or the requester is a verified, paid enrollee.
export async function getCourseCurriculum(req, res, next) {
  try {
    const { courseId } = req.params;
    const modules = await CurriculumModule.find({ course: courseId }).sort({ level: 1 });

    let isEnrolled = false;
    if (req.user) {
      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
        paymentStatus: "paid",
      });
      isEnrolled = !!enrollment;
    }

    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ module: mod._id, isPublished: true }).sort({ order: 1 });
        return {
          ...mod.toObject(),
          lessons: lessons.map((l) => ({
            _id: l._id,
            title: l.title,
            description: l.description,
            durationMinutes: l.durationMinutes,
            isPreview: l.isPreview,
            // The actual video URL is the protected asset — gate it here, server-side.
            videoUrl: l.isPreview || isEnrolled ? l.videoUrl : null,
            locked: !(l.isPreview || isEnrolled),
          })),
        };
      })
    );

    res.json({ success: true, message: "Curriculum fetched.", data: modulesWithLessons });
  } catch (err) {
    next(err);
  }
}

// --- Admin curriculum management ---
export async function createModule(req, res, next) {
  try {
    const mod = await CurriculumModule.create(req.body);
    res.status(201).json({ success: true, message: "Module created.", data: mod });
  } catch (err) {
    next(err);
  }
}

export async function updateModule(req, res, next) {
  try {
    const mod = await CurriculumModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mod) throw new ApiError(404, "Module not found.");
    res.json({ success: true, message: "Module updated.", data: mod });
  } catch (err) {
    next(err);
  }
}

export async function deleteModule(req, res, next) {
  try {
    await Lesson.deleteMany({ module: req.params.id });
    await CurriculumModule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Module and its lessons deleted." });
  } catch (err) {
    next(err);
  }
}

export async function createLesson(req, res, next) {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json({ success: true, message: "Lesson created.", data: lesson });
  } catch (err) {
    next(err);
  }
}

export async function updateLesson(req, res, next) {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) throw new ApiError(404, "Lesson not found.");
    res.json({ success: true, message: "Lesson updated.", data: lesson });
  } catch (err) {
    next(err);
  }
}

export async function deleteLesson(req, res, next) {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lesson deleted." });
  } catch (err) {
    next(err);
  }
}
