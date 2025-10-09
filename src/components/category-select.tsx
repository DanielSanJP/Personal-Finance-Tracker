import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Category,
} from "../constants/categories";

interface CategorySelectProps {
  /**
   * Currently selected category value
   */
  value?: string;
  /**
   * Called when category changes
   */
  onValueChange: (value: string) => void;
  /**
   * Type of categories to show
   */
  type?: "expense" | "income";
  /**
   * Whether to show the label
   */
  showLabel?: boolean;
  /**
   * Custom label text
   */
  label?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether to show icons in the dropdown
   */
  showIcons?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Array of categories that are already added (to show "Added" indicator)
   */
  existingCategories?: string[];
}

export function CategorySelect({
  value,
  onValueChange,
  type = "expense",
  showLabel = true,
  label,
  placeholder = "Select category...",
  showIcons = true,
  className,
  required = false,
  existingCategories = [],
}: CategorySelectProps) {
  const categories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const defaultLabel = type === "expense" ? "Category" : "Income Category";

  const formatCategoryDisplay = (category: Category) => {
    const isAlreadyAdded = existingCategories.includes(category.name);
    let display = "";

    if (showIcons && category.icon) {
      display = `${category.icon} ${category.name}`;
    } else {
      display = category.name;
    }

    if (isAlreadyAdded) {
      display += " (Added)";
    }

    return display;
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <Label className="text-base font-medium">
          {label || defaultLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent side="bottom" className="max-h-[300px] overflow-y-auto">
          {categories.map((category) => {
            const isAlreadyAdded = existingCategories.includes(category.name);
            return (
              <SelectItem
                key={category.id}
                value={category.name}
                disabled={isAlreadyAdded}
                className={isAlreadyAdded ? "text-gray-400" : ""}
              >
                {formatCategoryDisplay(category)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CategorySelect;
