
import type { UserResponse } from "@/types";
import {useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/errorDisplay";
import { Link } from "lucide-react";



export function ShareGroupCard() {
  const { user } = useAuth();



  const handleAction = () => {
    if (!user?.group?.invite_code) return;
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/signup/${user.group.invite_code}`;
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-3 text-white">
        <Link className="w-5 h-5" />
        <h2 className="font-bold">Share Group</h2>
      </div>



        <div className="flex flex-col gap-
        2">
          <Button
            onClick={handleAction}
            className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold"
          >
            Copy Invite Link
          </Button>
        </div>
      </div>
    
  );
}
