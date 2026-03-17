import { LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

import { DeleteAccountCard } from "./components/DeleteAccountCard";

export default function UserSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8 pb-32 px-4 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account</p>
      </div>

      <div className="space-y-4">
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex justify-center py-6 text-slate-300 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all group"
        >
          <LogOut className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-base">Sign Out</span>
        </Button>
      </div>

      {/* Delete Account Section */}

      {!user.owner && <DeleteAccountCard />}
    </div>
  );
}
