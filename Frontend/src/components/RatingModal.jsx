import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import StarRating from "./StarRating";
import Button from "./Button";

const RatingModal = ({ isOpen, onClose, store, onSubmit }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = store && store.my_rating != null && Number(store.my_rating) > 0;

  useEffect(() => {
    if (store && store.my_rating != null) {
      setSelectedRating(Number(store.my_rating));
    } else {
      setSelectedRating(0);
    }
    setError("");
  }, [store, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRating < 1 || selectedRating > 5) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await onSubmit(store.id, selectedRating, isEditing);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !store) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Rating for ${store.storename}` : `Rate ${store.storename}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2 bg-red-100 border border-red-300 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center justify-center py-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Select Rating (1 to 5 Stars)</p>
          <StarRating
            value={selectedRating}
            onChange={(val) => {
              setSelectedRating(val);
              setError("");
            }}
            size="text-3xl"
          />
          <span className="text-xs font-bold text-gray-600">
            {selectedRating > 0 ? `${selectedRating} Star${selectedRating > 1 ? "s" : ""}` : "No rating selected"}
          </span>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <Button
            type="button"
            fullWidth={true}
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={selectedRating === 0}
            fullWidth={true}
          >
            {isEditing ? "Update Rating" : "Submit Rating"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RatingModal;
