import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout, ProtectedRoute } from "./components/layout";
import {
  LandingPage,
  Login,
  Register,
  ForgotPassword,
  Dashboard,
  BookingList,
  BookingDetail,
  CreateBooking,
  Profile,
  Notifications,
  Layanan,
  Jadwal,
  Ratings,
  AdminDashboard,
  ManageBookings,
  ManageUsers,
  ManageLayanan,
  ManageJadwal,
  ManagePayments,
  Reports,
  Settings,
} from "./pages";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Booking Routes */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BookingList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreateBooking />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BookingDetail />
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
              <Layanan />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Jadwal Fisioterapis */}
      <Route
        path="/jadwal"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Jadwal />
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
              <Ratings />
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
              <Profile />
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
              <Notifications />
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
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <ManageBookings />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <ManageUsers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/layanan"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <ManageLayanan />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jadwal"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <ManageJadwal />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <ManagePayments />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <Settings />
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
