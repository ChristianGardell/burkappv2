import { CreditCard } from "lucide-react";
import { useState } from "react";

import ErrorDisplay from "@/components/errorDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSetSwishNumber } from "@/features/groups/hooks";
import type { SwishSetRequest } from "@/types";

import { useAuth } from "../../../context/AuthContext";
import { makeBlur } from "../../../lib/utils";

export function SwishPaymentCard({}: {}) {
  const [swishNumberCandidate, setSwishNumberCandidate] = useState<string>("");
  const { user } = useAuth();

  const { mutate: setGroupSwishNumber, error: swishErrorObj } =
    useSetSwishNumber();
  const swishError = swishErrorObj?.message || "";

  const handleSwishSubmit = () => {
    const request: SwishSetRequest = {
      swish_number: swishNumberCandidate,
    };
    setGroupSwishNumber(request);

    setSwishNumberCandidate("");
  };

  return (
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
          <h2 className="font-bold">Number To Recieve Payments</h2>
        </div>

        <div className="space-y-2">
          <ErrorDisplay error={swishError} />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"></label>
          <Input
            type="tel"
            placeholder="070 123 45 67"
            value={swishNumberCandidate}
            inputMode="numeric"
            maxLength={10}
            onChange={(e) => setSwishNumberCandidate(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold"
        >
          Set Swish Number
        </Button>

        <p className="text-[10px] text-emerald-400 ml-1 italic text-center">
          Current:{" "}
          {user?.group?.swish_number && user?.group?.swish_number.length === 10
            ? `${user?.group?.swish_number.slice(0, 3)}-${user?.group?.swish_number.slice(3, 6)}-${user?.group?.swish_number.slice(6, 8)}-${user?.group?.swish_number.slice(8, 10)}`
            : "Not Set"}
        </p>
      </div>
    </form>
  );
}
