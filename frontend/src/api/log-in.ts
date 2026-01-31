import type { UserLogin, UserResponse } from "../types";


  const loginUser = async (user: UserLogin): Promise<UserResponse> => {
    try {
      const response = await fetch(`http://localhost:8000/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user), 
      });

      if (!response.ok) {
        const error = new Error("Failed to log in user") as any;
        error.status = response.status;
        throw error;
      }


      const data = await response.json();
      console.log("Server response:", data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  export default loginUser;