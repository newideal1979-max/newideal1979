import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Payment from "../models/Payment.js";
import Inquiry from "../models/Inquiry.js";

export async function getDashboardStats(req, res, next) {
  try {
    const [totalStudents, activeEnrollments, totalCourses, payments, pendingInquiries] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Enrollment.countDocuments({ enrollmentStatus: "active", paymentStatus: "paid" }),
      Course.countDocuments(),
      Payment.find({ status: "paid" }),
      Inquiry.countDocuments({ status: "new" }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0) / 100; // paise -> rupees

    const courseWiseEnrollment = await Enrollment.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
      { $unwind: "$course" },
      { $project: { courseName: "$course.name", count: 1, _id: 0 } },
    ]);

    const recentEnrollments = await Enrollment.find({ paymentStatus: "paid" })
      .populate("user", "name email")
      .populate("course", "name")
      .sort({ enrolledAt: -1 })
      .limit(10);

    res.json({
      success: true,
      message: "Dashboard stats fetched.",
      data: {
        totalStudents,
        activeEnrollments,
        totalCourses,
        totalRevenue,
        pendingInquiries,
        courseWiseEnrollment,
        recentEnrollments,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await User.countDocuments();
    res.json({ success: true, message: "Users fetched.", data: { users, total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
}

export async function promoteToAdmin(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: "admin" }, { new: true });
    res.json({ success: true, message: "User promoted to admin.", data: user });
  } catch (err) {
    next(err);
  }
}

export async function listEnrollments(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Enrollment.countDocuments();
    res.json({ success: true, message: "Enrollments fetched.", data: { enrollments, total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
}

export async function listPayments(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("course", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Payment.countDocuments();
    res.json({ success: true, message: "Payments fetched.", data: { payments, total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
}
