/* A custom React hook to handle API calls with loading and error states
This return both data and error, making this not have to declared as states in each component */

import { useCallback, useState } from "react";

function useApiCall<T>(clearErrorAfterMs?: number) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (apiCall: () => Promise<T>): Promise<T | undefined> => {
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
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [clearErrorAfterMs],
  );

  return { data, error, loading, execute };
}

export default useApiCall;
