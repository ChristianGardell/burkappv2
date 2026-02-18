import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  BarChart3,
  Shield,
  MoreHorizontal,
  Home as HomeIcon,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const handleRefresh = () => {
    navigate(0);
  }

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

          {/* Right: Empty for balance */}
          <div className="flex items-center">
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              <RefreshCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main
        className={cn(
          "flex-1 overflow-y-auto pt-24 px-4 transition-all duration-300",
          user?.admin ? "pb-24" : "pb-12",
        )}
      >
        <div className="max-w-md mx-auto h-full">
          <Outlet />
        </div>
      </main>

      {/* Admin Bottom Navigation */}
      {user?.admin && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-t border-white/5 pb-safe z-50">
          <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 hover:bg-transparent",
                location.pathname === "/stats"
                  ? "text-emerald-400"
                  : "text-slate-400",
              )}
              onClick={() => navigate("/stats")}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-[10px] font-medium">Stats</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 hover:bg-transparent",
                location.pathname === "/admin"
                  ? "text-emerald-400"
                  : "text-slate-400",
              )}
              onClick={() => navigate("/admin")}
            >
              <Shield className="w-6 h-6" />
              <span className="text-[10px] font-medium">Admin</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 hover:bg-transparent",
                location.pathname === "/placeholder"
                  ? "text-emerald-400"
                  : "text-slate-400",
              )}
              onClick={() => navigate("/placeholder")}
            >
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-[10px] font-medium">More</span>
            </Button>

            {/* Also keeping Home accessible for admins */}
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 hover:bg-transparent",
                location.pathname === "/home"
                  ? "text-emerald-400"
                  : "text-slate-400",
              )}
              onClick={() => navigate("/home")}
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
