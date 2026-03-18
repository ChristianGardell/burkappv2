import { Loader2, Lock, LogIn, Smartphone, User, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCreateGroup } from "@/features/auth/hooks";
import type { GroupCreateRequest } from "@/types";

import AuthLayout from "../AuthLayout";

export default function CreateGroup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    mutate: createGroup,
    isPending: createGroupLoading,
    error: groupErrorObj,
  } = useCreateGroup();
  const createGroupError = groupErrorObj?.message || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupCreateRequest>();

  const onSubmit = (data: GroupCreateRequest) => {
    createGroup(data, {
      onSuccess: (responseData) => {
        login(responseData.access_token, responseData.user);
        navigate("/home");
      },
    });
  };

  const currentError =
    createGroupError ??
    errors.group_name?.message ??
    errors.name?.message ??
    errors.phone_number?.message ??
    errors.pin?.message ??
    null;

  if (createGroupLoading) {
    return <Loading />;
  }

  return (
    <AuthLayout error={currentError}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
              Group Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Users className="w-5 h-5" />
              </div>
              <input
                {...register("group_name", {
                  required: "Group name is required",
                  minLength: {
                    value: 5,
                    message: "Group name must be at least 5 characters",
                  },
                })}
                type="text"
                placeholder="D Flames 4ever"
                className="w-full h-14 bg-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-transparent focus:border-emerald-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
              Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <User className="w-5 h-5" />
              </div>
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                type="text"
                placeholder="John Doe"
                className="w-full h-14 bg-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-transparent focus:border-emerald-500/50 transition-all font-medium"
              />
            </div>
          </div>
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
          disabled={createGroupLoading}
          type="submit"
          className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 text-lg font-bold gap-2"
        >
          {createGroupLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Create Group
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
