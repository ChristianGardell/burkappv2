import { Button } from "@/components/ui/button";
import { Minus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { UserResponse }  from "../types";

export default function Home() {


  const location = useLocation();
 
  const loggedInUser = location.state?.user as UserResponse;

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Status Card */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/50 w-full border border-slate-800 flex flex-col items-center text-center">
        <div className="relative group cursor-default pt-4">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h1 className="relative text-9xl font-black text-white tracking-tighter tabular-nums mb-2">
            24
          </h1>
        </div>

        <p className="text-slate-500 font-medium text-lg">Beers Remaining</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button className="h-24 rounded-2xl bg-white/5 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 text-slate-400 flex flex-col items-center justify-center gap-2 transition-all group">
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
