import { Outlet } from "react-router-dom";
import { LogOut, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-slate-950 font-libre text-slate-200">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-white/5 z-50 px-4 md:px-8">
        <div className="max-w-md mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <span> {user?.phone_number}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-slate-400 bg-white/5 px-3 py-1.5 rounded-full text-sm font-medium border border-white/5"></div>
            Log Out
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
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
