import { DollarSign } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/errorDisplay";
import { makeBlur } from "../../../lib/utils";

import type { PricePerBeerSetRequest, PricePerBeerSetResponse } from "@/types";
import useApiCall from "@/hooks/useApiCall";
import setGroupPricePerBeer from "@/api/owner/set-price-per-beer";

export function ChangePricePerBeerCard({
  current_price_per_beer,
}: {
  current_price_per_beer: number;
}) {
  const [pricePerBeerCandidate, setPricePerBeerCandidate] = useState<string>();
  const [currentPricePerBeerVisual, setCurrentPricePerBeerVisual] =
    useState<string>(current_price_per_beer.toString());
  const { execute: executeChangePricePerBeer, error: changePriceError } =
    useApiCall<PricePerBeerSetResponse>(3000);

  const handlePricePerBeerChange = async () => {
    const request: PricePerBeerSetRequest = {
      price_per_beer: pricePerBeerCandidate
        ? parseInt(pricePerBeerCandidate)
        : 10,
    };
    const result = await executeChangePricePerBeer(() =>
      setGroupPricePerBeer(request),
    );
    if (result) {
      setCurrentPricePerBeerVisual(result.price_per_beer?.toString() || "");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        makeBlur();
        handlePricePerBeerChange();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 gap-4 flex flex-col">
        <div className="flex items-center gap-3 text-white">
          <DollarSign className="w-5 h-5" />
          <h2 className="font-bold">Change Price Per Beer</h2>
        </div>

        <div className="space-y-2">
          {changePriceError && <ErrorDisplay error={changePriceError} />}
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"></label>
          <input
            type="numeric"
            placeholder="Price Per Beer"
            value={pricePerBeerCandidate}
            inputMode="decimal"
            maxLength={3}
            onChange={(e) => setPricePerBeerCandidate(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold"
        >
          Set Price Per Beer
        </Button>
        <p className="text-[10px] text-emerald-400 ml-1 italic text-center">
          Current:{" "}
          {currentPricePerBeerVisual
            ? `${currentPricePerBeerVisual} SEK`
            : "Not Set"}
        </p>
      </div>
    </form>
  );
}
