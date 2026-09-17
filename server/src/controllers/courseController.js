import Course from "../models/Course.js";
import { ApiError } from "../middleware/errorHandler.js";

export async function listCourses(req, res, next) {
  try {
    const courses = await Course.find({ status: "published" }).sort({ order: 1 });
    res.json({ success: true, message: "Courses fetched.", data: courses });
  } catch (err) {
    next(err);
  }
}

export async function getCourseBySlug(req, res, next) {
  try {
    const course = await Course.findOne({ slug: req.params.slug, status: "published" });
    if (!course) throw new ApiError(404, "Course not found.");
    res.json({ success: true, message: "Course fetched.", data: course });
  } catch (err) {
    next(err);
  }
}

// --- Admin ---
export async function adminListCourses(req, res, next) {
  try {
    const courses = await Course.find().sort({ order: 1 });
    res.json({ success: true, message: "Courses fetched.", data: courses });
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req, res, next) {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, message: "Course created.", data: course });
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req, res, next) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) throw new ApiError(404, "Course not found.");
    res.json({ success: true, message: "Course updated.", data: course });
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    // Soft delete by unpublishing — financial/enrollment history references this course,
    // so we never hard-delete a course that may have real enrollments.
    const course = await Course.findByIdAndUpdate(req.params.id, { status: "draft" }, { new: true });
    if (!course) throw new ApiError(404, "Course not found.");
    res.json({ success: true, message: "Course unpublished.", data: course });
  } catch (err) {
    next(err);
  }
}
