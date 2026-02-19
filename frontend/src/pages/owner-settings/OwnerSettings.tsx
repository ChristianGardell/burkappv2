import { SwishPaymentCard } from "./SwishPaymentCard";
import { AdminManagementCard } from "./AdminManagementCard";
import { useAuth } from "@/context/AuthContext";


export default function OwnerSettings() {
  const { user } = useAuth();

  if (!user?.admin) return null;

  return (
    <div className="flex flex-col  gap-8 pb-32 px-4 max-w-md mx-auto animate-in fade-in animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-white">Group Settings</h1>
        <p className="text-slate-400 text-sm">
          Managing:{" "}
          <span className="text-emerald-400">{user.group?.name},</span>
        </p>
        <p className="text-slate-400 text-sm">
          <span className="text-slate-500 ml-1">Invite Code: </span>
          <span className="text-emerald-400">{user.group?.invite_code}</span>
        </p>{" "}
      </div>
      {/* Admin Management Section */}

      <AdminManagementCard />

      {/* Swish Payment Section */}

      <SwishPaymentCard currentSwishNumber={user.group?.swish_number || ""} />
    </div>
  );
}
