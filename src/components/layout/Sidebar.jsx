import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({
  collapsed,
  setCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  isLargeScreen,
}) => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    // Close mobile menu when navigating (mobile only)
    if (setMobileMenuOpen && !isLargeScreen) {
      setMobileMenuOpen(false);
    }
  };

  const adminLinks = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/bookings", icon: Calendar, label: "Pemesanan" },
    { path: "/admin/users", icon: Users, label: "Pengguna" },
    { path: "/admin/layanan", icon: FileText, label: "Layanan" },
    { path: "/admin/jadwal", icon: Clock, label: "Jadwal" },
    { path: "/admin/payments", icon: CreditCard, label: "Pembayaran" },
    { path: "/admin/ratings", icon: Heart, label: "Rating & Review" },
    { path: "/admin/reports", icon: BarChart3, label: "Laporan" },
  ];

  const userLinks = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/bookings", icon: Calendar, label: "Booking Saya" },
    { path: "/layanan", icon: FileText, label: "Layanan" },
    { path: "/profile", icon: Users, label: "Profil" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isLargeScreen ? (collapsed ? 80 : 256) : 256,
        x: isLargeScreen ? 0 : mobileMenuOpen ? 0 : -256,
      }}
      transition={{ type: "tween", duration: 0.22 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-slate-100 z-40"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleNavClick}
          className={`flex items-center h-16 px-4 border-b border-slate-100 transition-colors hover:bg-slate-50 ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <img
            src="/images/logo.png"
            alt="Cureva"
            className="w-10 h-10 rounded-xl shrink-0"
          />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-slate-800"
            >
              Cureva
            </motion.span>
          )}
        </Link>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/admin" || link.path === "/dashboard"}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-sky-50 text-sky-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {link.label}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 w-full transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Keluar</span>}
          </button>

          {/* Desktop: collapse/expand — Mobile/Tablet: close drawer */}
          <button
            onClick={() =>
              isLargeScreen
                ? setCollapsed(!collapsed)
                : setMobileMenuOpen(false)
            }
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-50 w-full transition-colors ${
              collapsed && isLargeScreen ? "justify-center" : ""
            }`}
          >
            {collapsed && isLargeScreen ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Tutup Sidebar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
