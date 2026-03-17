import { Loader2, Code, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import validateGroup from "@/api/unprotected/validate-group";

import useApiCall from "@/hooks/useApiCall";
import type { GroupResponse, ValidateGroupRequest } from "@/types";
import AuthLayout from "../AuthLayout";

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

  const currentError = validateError ?? errors.invite_code?.message ?? null;

  return (
    <AuthLayout error={currentError}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
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
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Continue Progress
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-xs">
        <Link
          to="/login"
          className="text-sm font-semibold text-slate-500 hover:text-white transition-colors"
        >
          Already have an account?{" "}
          <span className="text-emerald-500">Log in</span>
        </Link>
      </div>
    </AuthLayout>
  );
}
