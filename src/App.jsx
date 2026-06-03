import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout, ProtectedRoute } from "./components/layout";
import LoadingSpinner from "./components/common/LoadingSpinner";
import LandingPage from "./pages/LandingPage";

// lazy load pages buat user
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const BookingList = lazy(() => import("./pages/booking/BookingList"));
const BookingDetail = lazy(() => import("./pages/booking/BookingDetail"));
const CreateBooking = lazy(() => import("./pages/booking/CreateBooking"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Notifications = lazy(() => import("./pages/notifications/Notifications"));
const Layanan = lazy(() => import("./pages/layanan/Layanan"));
const Jadwal = lazy(() => import("./pages/jadwal/Jadwal"));
const Ratings = lazy(() => import("./pages/ratings/Ratings"));

// lazy load pages buat admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageBookings = lazy(() => import("./pages/admin/ManageBookings"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageLayanan = lazy(() => import("./pages/admin/ManageLayanan"));
const ManageJadwal = lazy(() => import("./pages/admin/ManageJadwal"));
const ManagePayments = lazy(() => import("./pages/admin/ManagePayments"));
const ManageRatings = lazy(() => import("./pages/admin/ManageRatings"));
const Reports = lazy(() => import("./pages/admin/Reports"));

const Page = ({ children }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{children}</Suspense>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <Page>
            <Login />
          </Page>
        }
      />
      <Route
        path="/register"
        element={
          <Page>
            <Register />
          </Page>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Page>
            <ForgotPassword />
          </Page>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Page>
                <Dashboard />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Booking Routes */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute disallowAdmin>
            <MainLayout>
              <Page>
                <BookingList />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={
          <ProtectedRoute disallowAdmin>
            <MainLayout>
              <Page>
                <CreateBooking />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <ProtectedRoute disallowAdmin>
            <MainLayout>
              <Page>
                <BookingDetail />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Layanan */}
      <Route
        path="/layanan"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Page>
                <Layanan />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Jadwal */}
      <Route
        path="/jadwal"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Page>
                <Jadwal />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Ratings */}
      <Route
        path="/ratings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Page>
                <Ratings />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Page>
                <Profile />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Notifications */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Page>
                <Notifications />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Page>
                <AdminDashboard />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Page>
                <ManageBookings />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings/:id"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Page>
                <BookingDetail />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Page>
                <ManageUsers />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/layanan"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Page>
                <ManageLayanan />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jadwal"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Page>
                <ManageJadwal />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Page>
                <ManagePayments />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ratings"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Page>
                <ManageRatings />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Page>
                <Reports />
              </Page>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
