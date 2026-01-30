
  const newUser = async (start_number: string, name: string) => {
    try {
      const response = await fetch("http://localhost:8000/admin/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_number, name }), 
      });

      if (!response.ok) throw new Error("Failed to add single competitor to db");

      const data = await response.json();
      console.log("Server response:", data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  export default newUser;