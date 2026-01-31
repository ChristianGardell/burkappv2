import { Button } from "@/components/ui/button";
import { LogIn, Smartphone, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserResponse, UserLogin } from "../types";
import checkUser from "../api/check-user-exist";
import loginUser from "../api/log-in";
import { useForm } from "react-hook-form";

export default function Login() {
  const navigate = useNavigate();
  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>();

  const onSubmit = async (data: UserLogin) => {
    try {
      const userExists = await checkUser(data);
      if (userExists) {
        try {
        const loggedInUser: UserResponse = await loginUser(data);
        navigate("/", { state: { user: loggedInUser } });

        } catch (error) {
          console.error("Login failed. Please check your PIN and try again.");
        }

      } else {
        navigate("/signup", { state: { formData: data } });
      }
    } catch (error) {
      console.error("API failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-slate-950 font-libre text-slate-200">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter">
              BurkApp{" "}
            </h1>
            <div className="min-h-10 text-sm text-rose-400">
              {errors.phone_number?.message && (
                <p>{errors.phone_number.message}</p>
              )}
              {errors.pin?.message && <p>{errors.pin.message}</p>}
            </div>
          </div>

          {/* Login Form Card */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/50 w-full border border-slate-800 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <Smartphone className="w-5 h-5" />
                    </div>

                    <input
                      {...register("phone_number", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      type="tel"
                      placeholder="070 123 45 67"
                      inputMode="numeric"
                      maxLength={10}
                      className="w-full h-14 bg-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-transparent focus:border-emerald-500/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                    6-Digit PIN
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      {...register("pin", {
                        required: "PIN is required",
                        pattern: {
                          value: /^\d{6}$/,
                          message: "PIN must be 6 digits",
                        },
                      })}
                      type="password"
                      inputMode="numeric"
                      placeholder="******"
                      maxLength={6}
                      className="w-full h-14 bg-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-transparent focus:border-emerald-500/50 transition-all font-medium tracking-widest"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 text-lg font-bold gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
