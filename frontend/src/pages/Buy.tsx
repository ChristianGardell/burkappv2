import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import swishLogo from "@/assets/swish.svg"; // Import the local SVG
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Buy() {
  const { user } = useAuth();
  const pricePerBeer = user?.group.price_per_beer || 10;
  const [buyBeersAmount, setBuyBeersAmount] = useState<number>(0);

  const disabledSwish =
    buyBeersAmount === 0 ||
    buyBeersAmount === null ||
    !user?.group.swish_number;

  const amountToPay = buyBeersAmount * pricePerBeer;

  const handleBuyButtonClick = () => {
    const swishUrl = `https://app.swish.nu/1/p/sw/?sw=${user?.group.swish_number}&amt=${amountToPay}&cur=SEK&msg=&src=qr`;
    window.open(swishUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Restock
        </h1>
      </div>

      {/* Form */}
      <form
        className="w-full flex flex-col gap-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!disabledSwish) handleBuyButtonClick();
        }}
      >
        {/* Input Card */}
        <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/50 w-full border border-slate-800 flex flex-col items-center gap-6 cursor-text focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500/50 transition-all">
          <div className="relative w-full max-w-[200px]">
            <input
              type="text"
              maxLength={2}
              minLength={1}
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder={"0"}
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = parseInt(value, 10);
                if (!isNaN(numericValue)) {
                  setBuyBeersAmount(numericValue);
                } else {
                  setBuyBeersAmount(0);
                }
              }}
              className="w-full bg-transparent text-center text-7xl font-black text-white placeholder:text-slate-800 focus:outline-none focus:ring-0 border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
            />
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-4">
          <Button
            type="submit"
            className="w-full h-16 rounded-2xl bg-white/5 border border-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-500 text-slate-400 shadow-lg shadow-black/20 text-lg font-bold gap-3 transition-all group"
            disabled={disabledSwish}
          >
            <div className="p-2 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 transition-colors">
              <img src={swishLogo} alt="Swish" className="w-5 h-5" />
            </div>
            Open Swish
          </Button>

          <Link to="/home" className="w-full block">
            <Button
              type="button"
              className="w-full h-12 rounded-xl text-slate-500  bg-white/5 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
