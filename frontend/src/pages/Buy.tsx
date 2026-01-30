import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import swishLogo from "@/assets/swish.svg"; // Import the local SVG


export default function Buy() {
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Restock
        </h1>
      </div>

      {/* Input Card */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/50 w-full border border-slate-800 flex flex-col items-center gap-6">
        <div className="relative w-full max-w-[200px]">
          <input
            type="text"
            maxLength={2}
            pattern="\d*"
            inputMode="numeric"
            placeholder="0"
            className="w-full bg-transparent text-center text-7xl font-black text-white placeholder:text-slate-800 focus:outline-none focus:ring-0 border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-4">
        <Button className="w-full h-16 rounded-2xl bg-white/5 border border-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-500 text-slate-400 shadow-lg shadow-black/20 text-lg font-bold gap-3 transition-all group">
          <div className="p-2 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 transition-colors">
            <img src={swishLogo} alt="Swish" className="w-5 h-5" />
          </div>
          Open Swish
        </Button>

        <Link to="/" className="w-full block">
          <Button className="w-full h-12 rounded-xl text-slate-500  bg-white/5 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
