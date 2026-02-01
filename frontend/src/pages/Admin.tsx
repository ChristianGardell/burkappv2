import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAllUsers from "@/api/get-all-users-admin";
import type { UserResponse } from "@/types";
import { Loader2 } from "lucide-react";
import UserCard from "@/components/UserCard";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<UserResponse[]>([]);
  const [adminFilteredUsers, setAdminFilteredUsers] = useState<UserResponse[]>(
    [],
  );
  const [searchedUsers, setSearchedUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.admin) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dbUsers = await getAllUsers();
      setAllUsers(dbUsers);
      const nonAdminOrCurrentUser = dbUsers.filter(
        (u) => u.admin === false || u.id === user?.id,
      );
      const filtered = nonAdminOrCurrentUser.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setAdminFilteredUsers(filtered);
      setSearchedUsers(filtered);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsersOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = adminFilteredUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm) ||
        u.phone_number.includes(searchTerm),
    );
    if (searchTerm === "") {
      setSearchedUsers(adminFilteredUsers);
      return;
    }
    setSearchedUsers(filtered);
  };

  if (!user?.admin) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
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

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
          {error}
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
