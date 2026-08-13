import { useState, useCallback } from "react";
import { getStores, createRating, updateRating } from "../services/stores.api";

export const useStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const storeList = await getStores();
      setStores(storeList);
    } catch (err) {
      setError(err.message || "Failed to load stores.");
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const rateStore = async (storeId, rating, isUpdate = false) => {
    setLoading(true);
    setError("");
    try {
      if (isUpdate) {
        await updateRating(storeId, rating);
      } else {
        await createRating(storeId, rating);
      }
      await fetchStores(); // Refresh store list after rating submission/update
    } catch (err) {
      setError(err.message || "Failed to submit rating.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    stores,
    loading,
    error,
    setError,
    fetchStores,
    rateStore,
  };
};
