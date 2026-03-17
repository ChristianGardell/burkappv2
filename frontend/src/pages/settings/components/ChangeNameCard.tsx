import { Users } from "lucide-react";
import { useState } from "react";

import changeGroupName from "@/api/owner/change-group-name";
import ErrorDisplay from "@/components/errorDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useApiCall from "@/hooks/useApiCall";
import type { GroupNameChangeRequest } from "@/types";

import { makeBlur } from "../../../lib/utils";

export function ChangeNameCard() {
  const [groupNameCandidate, setGroupNameCandidate] = useState("");
  const { execute: executeChangeGroupName, error: changeNameError } =
    useApiCall<GroupNameChangeRequest>(3000);

  const handleGroupNameChange = async () => {
    const request: GroupNameChangeRequest = {
      name: groupNameCandidate,
    };
    const result = await executeChangeGroupName(() => changeGroupName(request));
    if (result) {
      setGroupNameCandidate("");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        makeBlur();
        handleGroupNameChange();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 gap-4 flex flex-col">
        <div className="flex items-center gap-3 text-white">
          <Users className="w-5 h-5" />
          <h2 className="font-bold">Change Group Name</h2>
        </div>

        <div className="space-y-2">
          {changeNameError && <ErrorDisplay error={changeNameError} />}
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"></label>
          <Input
            type="text"
            placeholder="Group Name"
            value={groupNameCandidate}
            inputMode="text"
            maxLength={100}
            onChange={(e) => setGroupNameCandidate(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold"
        >
          Set Group Name
        </Button>
      </div>
    </form>
  );
}
