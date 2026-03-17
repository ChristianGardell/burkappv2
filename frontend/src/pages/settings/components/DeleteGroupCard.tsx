import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function DeleteGroupCard() {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-900/30 rounded-lg">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-white font-semibold">Delete Group</h2>
          <p className="text-sm text-slate-400">
            Permanently remove this group.
          </p>
        </div>
      </div>

      {!isConfirming ? (
        <Button
          onClick={() => setIsConfirming(true)}
          variant="destructive"
          className="w-full bg-red-900/50 hover:bg-red-900/80 text-red-200 hover:text-white border-none"
        >
          Delete Group
        </Button>
      ) : (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-sm text-red-400 font-medium text-center">
            Are you sure? This will delete the group and remove all its users
            permanently.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsConfirming(false)}
              variant="outline"
              className="flex-1 bg-transparent border-red-900/50 text-slate-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // TODO: Add frontend API logic for deletion
                console.log("Delete group triggered");
              }}
              variant="destructive"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
