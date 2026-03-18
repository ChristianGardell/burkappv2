import { DollarSign } from "lucide-react";
import { useState } from "react";

import ErrorDisplay from "@/components/errorDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useSetPricePerBeer } from "@/features/groups/hooks";
import type { PricePerBeerSetRequest } from "@/types";

import { makeBlur } from "../../../lib/utils";

export function ChangePricePerBeerCard({}: {}) {
  const { user } = useAuth();
  const [pricePerBeerCandidate, setPricePerBeerCandidate] =
    useState<string>("");

  const {
    mutate: changePricePerBeer,
    error: errorObj,
    isPending,
  } = useSetPricePerBeer();

  const changePriceError = errorObj?.message || "";

  const handlePricePerBeerChange = () => {
    const request: PricePerBeerSetRequest = {
      price_per_beer: pricePerBeerCandidate
        ? parseInt(pricePerBeerCandidate)
        : 10,
    };

    changePricePerBeer(request);
    setPricePerBeerCandidate("");
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
          <Input
            type="numeric"
            placeholder="Price Per Beer"
            value={pricePerBeerCandidate || ""}
            inputMode="decimal"
            maxLength={3}
            disabled={isPending}
            onChange={(e) => setPricePerBeerCandidate(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || !pricePerBeerCandidate}
          className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Set Price Per Beer"}
        </Button>
        <p className="text-[10px] text-emerald-400 ml-1 italic text-center">
          Current:{" "}
          {user?.group.price_per_beer
            ? `${user?.group.price_per_beer} SEK`
            : "Not Set"}
        </p>
      </div>
    </form>
  );
}
