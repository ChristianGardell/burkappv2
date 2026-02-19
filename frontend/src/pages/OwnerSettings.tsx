import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, CreditCard, UserPlus } from "lucide-react";
import useApiCall from "@/hooks/useApiCall";
import { useState, useEffect } from "react";
import type { SwishSetResponse, SwishSetRequest, UserResponse } from "@/types";

import { Button } from "@/components/ui/button";

import setGroupSwishNumber from "@/api/owner/set-group-swish-number";

export default function OwnerSettings() {
  const { user } = useAuth();
  const [swishNumberVisual, setSwishNumberVisual] = useState<string>(
    user?.group.swish_number || "Not Set",
  );
  const [inviteCodeVisual, setInviteCode] = useState<string>("");
  
  const [swishNumberCandidate, setSwishNumberCandidate] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const { error: swishError, execute: executeSetSwishNumber } =
    useApiCall<SwishSetResponse>(3000);

  const { execute: executeMakeAdmin } = useApiCall<UserResponse>(3000);

  useEffect(() => {
    if (user?.group.swish_number) {
      setSwishNumberVisual(user.group.swish_number);
      setInviteCode(user.group.invite_code);
    }
  }, [user]);

  const makeBlur = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleSwishSubmit = async () => {
    if (
      swishNumberCandidate === "" ||
      swishNumberCandidate === null ||
      swishNumberCandidate.length !== 10
    ) {
      setFormError("Swish number must be 10 digits");
      return;
    }
    const swishNumberRequest: SwishSetRequest = {
      swish_number: swishNumberCandidate,
    };
    executeSetSwishNumber(async () => {
      const response = await setGroupSwishNumber(swishNumberRequest);
      setFormError(null);
      setSwishNumberVisual(response.swish_number);
      return response;
    });
  };

  if (!user?.admin) return null;

  return (
    <div className="flex flex-col  gap-8 pb-32 px-4 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-white">Group Settings</h1>
        <p className="text-slate-400 text-sm">
          Managing: <span className="text-emerald-400">{user.group?.name},</span>
          <span className="text-slate-500 ml-1">Invite Code: </span>
          <span className="text-emerald-400">{inviteCodeVisual}</span>
        </p>
      </div>

      {/* Admin Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3 text-white">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="font-bold">Member Permissions</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              
            </label>
            <input
              type="tel"
              placeholder="Phone number"
              value={""}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold">
              Make Admin
            </Button>
            <Button
              variant="secondary"
              className="w-full py-7 rounded-2xl font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-red-900/20 hover:text-red-500 hover:border-red-900/50"
            >
              Remove Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Swish Payment Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          makeBlur();
          handleSwishSubmit();
        }}
      >
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 gap-4 flex flex-col">
          <div className="flex items-center gap-3 text-white">
            <CreditCard className="w-5 h-5" />
            <h2 className="font-bold">Payment Details</h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            </label>
            <input
              type="tel"
              placeholder="070 123 45 67"
              value={swishNumberCandidate}
              inputMode="numeric"
              maxLength={10}
              onChange={(e) => setSwishNumberCandidate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold"
          >
            Set Swish Number
          </Button>

          <p className="text-[10px] text-slate-600 ml-1 italic text-center">
            Current: {swishNumberVisual}
          </p>
        </div>
      </form>

      {(formError || swishError) && (
        <div className="text-red-500 text-xs font-medium text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
          {formError || swishError}
        </div>
      )}
    </div>
  );
}
