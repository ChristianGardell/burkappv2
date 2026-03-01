import { Button } from "@/components/ui/button";
import { LogIn, Smartphone, Lock, Loader2 } from "lucide-react";
import ErrorDisplay from "@/components/errorDisplay";

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import type { UserLoginRequest, LoginResponse } from "../types";

import loginUser from "../api/unprotected/log-in";
import { useAuth } from "../context/AuthContext";
import useApiCall from "../hooks/useApiCall";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    loading: loginLoading,
    error: loginError,
    execute: executeLogin,
  } = useApiCall<LoginResponse>(3000);

  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors },
  } = useForm<UserLoginRequest>();

  const onSubmit = async (data: UserLoginRequest) => {
    const user = await executeLogin(() => loginUser(data));
    if (user) {
      login(user.access_token, user.user);
      navigate("/home", { state: { user: user.user } });
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
              <ErrorDisplay
                error={
                  loginError ??
                  errors.phone_number?.message ??
                  errors.pin?.message ??
                  null
                }
              />
            </div>
          </div>

          {/* Login Form Card */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/50 w-full border border-slate-800 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  {/* {userExistsError && <p>{userExistsError}</p>} */}
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
                disabled={loginLoading}
                type="submit"
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 text-lg font-bold gap-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                Log In
              </Button>

              <Link to="/signup" className="block w-full">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-14 rounded-2xl border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white font-bold"
                >
                  Join Existing Group
                </Button>
              </Link>
            </div>
          </form>

          <div className="pt-10 flex justify-center">
            <Link to="/create-group" className="btn-style">
              <Button
                className="bg-transparent hover:bg-transparent text-slate-600 hover:text-slate-400 text-sm font-medium underline underline-offset-4 shadow-none border-none h-auto w-auto"
                variant="ghost"
                type="button"
              >
                Start A New Group
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
