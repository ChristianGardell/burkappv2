import { ShieldCheck } from "lucide-react";
import React from "react";

import ErrorDisplay from "@/components/errorDisplay";
import { Button } from "@/components/ui/button";
import { useMakeUserAdmin, useRemoveUserAdmin } from "@/features/users/hooks";

export function AdminManagementCard() {
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");

  const { mutate: makeUserAdmin, error: makeErrorObj } = useMakeUserAdmin();
  const { mutate: removeUserAdmin, error: removeErrorObj } =
    useRemoveUserAdmin();
  const adminError = makeErrorObj?.message || removeErrorObj?.message || "";

  const handdleAction = async (action: "make" | "remove") => {
    const makeAdminRequest = {
      phone_number: phoneNumber,
    };

    if (action === "make") {
      makeUserAdmin(makeAdminRequest);
    } else {
      removeUserAdmin(makeAdminRequest);
    }

    setPhoneNumber("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-3 text-white">
        <ShieldCheck className="w-5 h-5" />
        <h2 className="font-bold">Member Permissions</h2>
      </div>

      <div className="space-y-4">
        {adminError ? <ErrorDisplay error={adminError} /> : null}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"></label>
          <input
            type="tel"
            placeholder="070 123 45 67"
            maxLength={10}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => handdleAction("make")}
            className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold"
          >
            Make Admin
          </Button>
          <Button
            variant="secondary"
            onClick={() => handdleAction("remove")}
            className="w-full py-7 rounded-2xl font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-red-900/20 hover:text-red-500 hover:border-red-900/50"
          >
            Remove Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
