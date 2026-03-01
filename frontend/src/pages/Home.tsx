import { Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import useApiCall from "@/hooks/useApiCall";
import { type UserBeerResponse } from "@/types";

import decrementBeer from "../api/user/decrement-beer";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [disableDrinkButton, setDisableDrinkButton] = useState<boolean>(false);
  const [flashCardGreen, setFlashCardGreen] = useState<boolean>(false);
  const { user, setUser } = useAuth();

  const {
    // loading: buyBeerLoading,
    error: buyBeerError,
    execute: executeBuyBeer,
  } = useApiCall<UserBeerResponse>(3000);

  const disableButton = () => {
    setDisableDrinkButton(true);
    setTimeout(() => {
      setDisableDrinkButton(false);
    }, 1500);
  };
  const sucessFlash = () => {
    setFlashCardGreen(true);
    setTimeout(() => {
      setFlashCardGreen(false);
    }, 1000);
  };

  const handleDrinkOnePress = async () => {
    if (user === null || user.beers === 0) {
      return;
    }
    const data = await executeBuyBeer(() => decrementBeer());
    if (!data) return;
    if (data) {
      setUser({ ...user, beers: data.beers });
      if (!user.admin) {
        disableButton();
      }
      sucessFlash();
    }
  };
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Main Status Card */}
      <div
        className={`rounded-3xl p-6 shadow-xl w-full aspect-square justify-center border flex flex-col items-center text-center transition-all duration-300 ${
          flashCardGreen
            ? "bg-emerald-950 border-emerald-500 shadow-emerald-500/50 scale-105"
            : "bg-slate-900 border-slate-800 shadow-slate-900/50"
        }`}
      >
        <div className="relative group cursor-default pt-2">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 active:bg-green-300" />
          <div className="min-h-8 text-sm text-rose-400">
            {buyBeerError && <p>{buyBeerError}</p>}
          </div>
          <h1 className="relative text-8xl font-black text-white tracking-tighter tabular-nums mb-1">
            {user?.beers}
          </h1>
        </div>

        <p className="text-slate-500 font-medium text-base">Beers Remaining</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button
          onClick={handleDrinkOnePress}
          disabled={disableDrinkButton || user?.beers === 0}
          className="h-24 rounded-2xl bg-white/5 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 text-slate-400 flex flex-col items-center justify-center gap-2 transition-all group"
        >
          <div className="p-3 rounded-full bg-slate-800 group-hover:bg-red-500/20 transition-colors">
            <Minus className="w-6 h-6" />
          </div>
          <span className="font-semibold">Drink One</span>
        </Button>

        <Link to="/buy" className="contents">
          <Button className="h-24 rounded-2xl bg-white/5 border border-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-500 text-slate-400 flex flex-col items-center justify-center gap-2 transition-all group">
            <div className="p-3 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="font-semibold">Buy More</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
