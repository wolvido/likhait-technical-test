/**
 * Form component for adding/editing expenses
 */

import React, { useState, useEffect } from "react";
import { ExpenseFormData, Category } from "../types";
import { TextField, SelectBox, Button, LoadingSpinner } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { fetchCategories } from "../services/api";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const categoryGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "flex-end",
  };

  const categoryOptions = categories
    // Sort category "Other" at the end
    .sort((a, b) => {
      if (a.name === "Other") return 1;
      if (b.name === "Other") return -1;
      return 0;
    })
    .map((category) => ({
      value: category.name,
      label: category.name,
    }));
  
  const handleAddCategory = () => {
    console.log("Add category clicked");
    // Placeholder for future category management feature
  }

  if (isLoadingCategories) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />

      <div style={categoryGroupStyle}>
        <div style={{ flex: 1 }}>
          <SelectBox
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={errors.category}
            fullWidth
            required
          />
        </div>
        <Button 
          type="button" 
          variant="secondary"
          size="medium"
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </div>

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
