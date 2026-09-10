import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";
import { ApiError } from "../middleware/errorHandler.js";

export async function getMyEnrollments(req, res, next) {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id, paymentStatus: "paid" })
      .populate("course")
      .sort({ enrolledAt: -1 });
    res.json({ success: true, message: "Enrollments fetched.", data: enrollments });
  } catch (err) {
    next(err);
  }
}

export async function getEnrollmentForCourse(req, res, next) {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId,
      paymentStatus: "paid",
    });
    res.json({ success: true, message: "Checked.", data: enrollment || null });
  } catch (err) {
    next(err);
  }
}

// Marks a lesson complete and recalculates progress against the total published lesson
// count for that course — never trusts a progress % sent from the frontend.
export async function markLessonComplete(req, res, next) {
  try {
    const { courseId, lessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
      paymentStatus: "paid",
    });
    if (!enrollment) throw new ApiError(403, "You are not enrolled in this course.");

    if (!enrollment.completedLessons.some((id) => String(id) === lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    enrollment.lastAccessedLesson = lessonId;

    const totalLessons = await Lesson.countDocuments({ course: courseId, isPublished: true });
    enrollment.courseProgress = totalLessons
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

    if (enrollment.courseProgress >= 100) enrollment.enrollmentStatus = "completed";

    await enrollment.save();
    res.json({ success: true, message: "Progress updated.", data: enrollment });
  } catch (err) {
    next(err);
  }
}
