import { useState, useCallback } from "react";
import { getOwnerDashboard } from "../services/owner.api";

export const useOwner = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getOwnerDashboard();
      if (data) {
        setStore(data.store || null);
        setRatings(data.ratings || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
      setStore(null);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    store,
    ratings,
    loading,
    error,
    fetchDashboard,
  };
};
