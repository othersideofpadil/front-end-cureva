import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const MainLayout = ({ children, showSidebar = true }) => {
  const { isAdmin } = useAuth();
  const getIsLargeScreen = () =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true;
  const [collapsed, setCollapsed] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(getIsLargeScreen);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(getIsLargeScreen);

  useEffect(() => {
    const handleResize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      setMobileMenuOpen(large);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {showSidebar && isAdmin ? (
        <>
          {/* Mobile Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
            )}
          </AnimatePresence>

          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            isLargeScreen={isLargeScreen}
          />

          <motion.main
            initial={false}
            animate={{
              marginLeft: isLargeScreen ? (collapsed ? 80 : 256) : 0,
            }}
            className="min-h-screen transition-all duration-300"
          >
            {/* Mobile Menu Button - Fixed Right Top */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden fixed top-4 right-4 z-30 p-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-md"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>

            <div className="p-3 sm:p-4 md:p-6 lg:p-6">{children}</div>
          </motion.main>
        </>
      ) : (
        <>
          <Navbar />
          <main className="pt-16 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default MainLayout;
