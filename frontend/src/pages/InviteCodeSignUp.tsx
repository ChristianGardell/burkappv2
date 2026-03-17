import { Loader2, Code, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ErrorDisplay from "@/components/errorDisplay";
import { Button } from "@/components/ui/button";
import validateGroup from "@/api/unprotected/validate-group";

import useApiCall from "../hooks/useApiCall";
import type { GroupResponse, ValidateGroupRequest } from "../types";

export default function InviteCodeSignUp() {
  const navigate = useNavigate();

  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors },
  } = useForm<ValidateGroupRequest>();

  const {
    loading: validateLoading,
    error: validateError,
    execute: executeValidate,
  } = useApiCall<GroupResponse>(3000);

  const onSubmit = async (data: ValidateGroupRequest) => {
    const group = await executeValidate(() => validateGroup(data));
    if (group) {
      navigate(`/join/${data.invite_code}`);
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
                error={validateError ?? errors.invite_code?.message ?? null}
              />
            </div>
          </div>

          {/* Check Invite Code Card */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/50 w-full border border-slate-800 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  {/* {userExistsError && <p>{userExistsError}</p>} */}
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                    Invite Code
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <Code className="w-5 h-5" />
                    </div>

                    <input
                      {...register("invite_code", {
                        required: "Invite code is required",
                      })}
                      placeholder="cat-extraordinare-625"
                      inputMode="text"
                      maxLength={50}
                      className="w-full h-14 bg-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-transparent focus:border-emerald-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <Button
                disabled={validateLoading}
                type="submit"
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 text-lg font-bold gap-2"
              >
                {validateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                Continue signup
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
