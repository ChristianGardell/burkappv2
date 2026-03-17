import { useEffect, useState } from "react";

import Loading from "@/components/Loading";
import getAllUsers from "@/api/admin/get-all-users-admin";
import UserCard from "@/pages/admin/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import useApiCall from "@/hooks/useApiCall";
import type { UserResponse } from "@/types";

export default function Admin() {
  const { user } = useAuth();

  const [allUsers, setAllUsers] = useState<UserResponse[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<UserResponse[]>([]);

  const {
    error: getAllUsersError,
    loading: loadingAllUsers,
    execute: executeGetAllUsers,
  } = useApiCall<UserResponse[]>(3000);

  useEffect(() => {
    const loadUsers = async () => {
      const dbUsers = await executeGetAllUsers(() => getAllUsers());
      if (dbUsers) {
        const nonAdminOrCurrentUserSorted = dbUsers
          .filter((u: UserResponse) => u.admin === false || u.id === user?.id)
          .sort((a: UserResponse, b: UserResponse) =>
            a.name.localeCompare(b.name),
          );
        setSearchedUsers(nonAdminOrCurrentUserSorted);
        setAllUsers(nonAdminOrCurrentUserSorted);
      }
    };
    loadUsers();
  }, [executeGetAllUsers]);

  const filterUsersOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm) ||
        u.phone_number.includes(searchTerm),
    );
    if (searchTerm === "") {
      setSearchedUsers(allUsers);
      return;
    }
    setSearchedUsers(filtered);
  };

  if (loadingAllUsers) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <Button onClick={loadUsers}>Refresh</Button>
      </div> */}
      <input
        type="text"
        placeholder="Search users..."
        defaultValue={""}
        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        onChange={filterUsersOnSearch}
      />

      {getAllUsersError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
          {getAllUsersError}
        </div>
      )}

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
