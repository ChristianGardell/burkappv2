import { useState } from "react";

import ErrorDisplay from "@/components/errorDisplay";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useAllUsers } from "@/features/users/hooks";
import UserCard from "@/pages/admin/components/UserCard";
import type { UserResponse } from "@/types";

export default function Admin() {
  const { user } = useAuth();

  const {
    data: dbUsers = [],
    isLoading: loadingAllUsers,
    error: usersErrorObj,
  } = useAllUsers();
  const getAllUsersError = usersErrorObj?.message || "";

  const [searchTerm, setSearchTerm] = useState("");

  const baseUsers = dbUsers
    .filter((u: UserResponse) => u.admin === false || u.id === user?.id)
    .sort((a: UserResponse, b: UserResponse) => a.name.localeCompare(b.name));

  const searchedUsers = baseUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone_number.includes(searchTerm),
  );

  if (loadingAllUsers) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {getAllUsersError && <ErrorDisplay error={getAllUsersError} />}

      <div className="grid gap-4">
        {searchedUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {searchedUsers.length === 0 && (
        <div className="text-center text-slate-500 py-12">No users found.</div>
      )}
    </div>
  );
}
