/**
 * Form component for adding/editing expenses
 */

import React, { useState, useEffect } from "react";
import { ExpenseFormData, Category, CategoryFormData } from "../types";
import { TextField, SelectBox, Button, LoadingSpinner, Modal } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { fetchCategories, createCategory } from "../services/api";
import { CategoryForm } from "./CategoryForm";

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
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];

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
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (data: CategoryFormData) => {
    await createCategory(data);
    setIsCategoryModalOpen(false);
    await loadCategories();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryName = e.target.value;
    const selectedCategory = categories.find(c => c.name === categoryName);
    
    handleChange("category", categoryName);
    if (selectedCategory) {
      handleChange("category_id", selectedCategory.id.toString());
    }
  };

  if (isLoadingCategories) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={formStyle} noValidate>
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
            onChange={handleCategoryChange}
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
        max={today}
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

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Add New Category"
      >
        <CategoryForm
          onSubmit={handleCategorySubmit}
          onCancel={() => setIsCategoryModalOpen(false)}
        />
      </Modal>
    </>
  );
}
