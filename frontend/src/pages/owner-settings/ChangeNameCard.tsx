import { Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/errorDisplay";
import { makeBlur } from "../../lib/utils";

import type { GroupNameChangeRequest } from "@/types";
import useApiCall from "@/hooks/useApiCall";
import changeGroupName from "@/api/owner/change-group-name";

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
          {/* <ErrorDisplay error={swishError || formError} /> */}
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"></label>
          <input
            type="text"
            placeholder="Group Name"
            value={groupNameCandidate}
            inputMode="text"
            maxLength={100}
            onChange={(e) => setGroupNameCandidate(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold"
        >
          Set Group Name
        </Button>

        {/* <p className="text-[10px] text-emerald-400 ml-1 italic text-center">
          Current:{" "}
          {swishNumberVisual && swishNumberVisual.length === 10
            ? `${swishNumberVisual.slice(0, 3)}-${swishNumberVisual.slice(3, 6)}-${swishNumberVisual.slice(6, 8)}-${swishNumberVisual.slice(8, 10)}`
            : "Not Set"}
        </p> */}
      </div>
    </form>
  );
}
