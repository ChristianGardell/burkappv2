import { Trash2 } from "lucide-react";
import { useState } from "react";

import ErrorDisplay from "@/components/errorDisplay";
import { Button } from "@/components/ui/button";
import { useDeleteAccount } from "@/features/users/hooks";

export function DeleteAccountCard() {
  const [isConfirming, setIsConfirming] = useState(false);
  const { mutate: deleteAccount, error: deleteAccountError } =
    useDeleteAccount();
  const deleteAccountErrorMessage = deleteAccountError?.message || "";
  const handleDelete = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        window.location.href = "/goodbye"; // Redirect to a goodbye page or homepage after deletion
      },
    });
  };

  return (
    <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-900/30 rounded-lg">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <ErrorDisplay error={deleteAccountErrorMessage} />
          <h2 className="text-white font-semibold flex items-center">
            Delete Account
          </h2>
          <p className="text-sm text-slate-400">
            This action cannot be undone.
          </p>
        </div>
      </div>

      {!isConfirming ? (
        <Button
          onClick={() => setIsConfirming(true)}
          variant="destructive"
          className="w-full bg-red-900/50 hover:bg-red-900/80 text-red-200 hover:text-white border-none"
        >
          Delete My Account
        </Button>
      ) : (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-sm text-red-400 font-medium text-center">
            Are you absolutely sure? All your data will be permanently removed.
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
                handleDelete();
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
