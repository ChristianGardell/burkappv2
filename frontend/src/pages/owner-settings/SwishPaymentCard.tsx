import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import useApiCall from "@/hooks/useApiCall";
import setGroupSwishNumber from "@/api/owner/set-group-swish-number";
import { useState } from "react";
import type { SwishSetRequest, SwishSetResponse } from "@/types";
import ErrorDisplay from "@/components/errorDisplay";
import { makeBlur, phoneInputValidations } from "../../lib/utils";

export function SwishPaymentCard({
  currentSwishNumber,
}: {
  currentSwishNumber: string;
}) {
  const [swishNumberVisual, setSwishNumberVisual] = useState<string>(
    currentSwishNumber || "Not Set",
  );

  const [swishNumberCandidate, setSwishNumberCandidate] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const { error: swishError, execute: executeSetSwishNumber } =
    useApiCall<SwishSetResponse>(3000);

  const handleSwishSubmit = async () => {
    if (!phoneInputValidations(swishNumberCandidate)) {
      setFormError("Swish number must be 10 digits");
      return;
    }
    const swishNumberRequest: SwishSetRequest = {
      swish_number: swishNumberCandidate,
    };
    const result = await executeSetSwishNumber(async () =>
      setGroupSwishNumber(swishNumberRequest),
    );
    if (result) {
      setFormError(null);
      setSwishNumberVisual(result.swish_number);
    }
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
          <ErrorDisplay error={swishError || formError} />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"></label>
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

        <p className="text-[10px] text-emerald-400 ml-1 italic text-center">
          Current:{" "}
          {swishNumberVisual && swishNumberVisual.length === 10
            ? `${swishNumberVisual.slice(0, 3)}-${swishNumberVisual.slice(3, 6)}-${swishNumberVisual.slice(6, 8)}-${swishNumberVisual.slice(8, 10)}`
            : "Not Set"}
        </p>
      </div>
    </form>
  );
}
