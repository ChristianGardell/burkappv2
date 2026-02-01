import { Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname === "/admin";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-slate-950 font-libre text-slate-200">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-white/5 z-50 px-4 md:px-8">
        <div className="max-w-md mx-auto h-full flex items-center justify-between">
          {/* Left: Logout Button */}
          <div className="flex items-center">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Center: Phone Number */}
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <span>{user?.phone_number}</span>
          </div>

          {/* Right: Admin Button */}
          <div className="flex items-center">
            {user?.admin && (
              <Button
                onClick={() => navigate(isAdminPage ? "/home" : "/admin")}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 px-4 py-2 rounded-lg font-semibold"
              >
                {isAdminPage ? "Home" : "Admin"}
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
