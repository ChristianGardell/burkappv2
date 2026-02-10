/* A custom React hook to handle API calls with loading and error states
This return both data and error, making this not have to declared as states in each component */

import { useState } from "react";

function useApiCall<T>(clearErrorAfterMs?: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const execute = async (apiCall: () => Promise<T> | undefined) => {
    setLoading(true);
    setError("");
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Request failed";
      setError(errorMsg);
      if (clearErrorAfterMs) {
        setTimeout(() => setError(""), clearErrorAfterMs);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, execute };
}

export default useApiCall;

/* Usage example: Import and use the hook in a component 

const { data: competitorData, error, loading, execute } = useApiCall<CompetitorOut[]>();

Then call execute with the API function when needed:
execute(() => fetchCompetitors());
*/
