import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { ProtectedRoute, AdminRoute } from "./components/layout/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Curriculum from "./pages/Curriculum";
import HowItWorks from "./pages/HowItWorks";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import CourseLearning from "./pages/student/CourseLearning";
import Profile from "./pages/student/Profile";
import Orders from "./pages/student/Orders";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCurriculum from "./pages/admin/AdminCurriculum";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteSettingsProvider>
          <Routes>
            {/* Public site */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetails />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />

              {/* Student area */}
              <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Course learning page uses its own full-bleed layout (LMS chrome, not the marketing nav/footer) */}
            <Route path="/learn/:slug" element={<ProtectedRoute><CourseLearning /></ProtectedRoute>} />

            {/* Admin panel */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="curriculum" element={<AdminCurriculum />} />
              <Route path="enrollments" element={<AdminEnrollments />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
