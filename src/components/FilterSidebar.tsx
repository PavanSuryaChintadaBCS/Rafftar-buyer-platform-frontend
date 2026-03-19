import { categories } from "@/data/mock";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoriesChange: (cats: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minRating: number;
  onMinRatingChange: (r: number) => void;
}

const FilterSidebar = ({
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
}: FilterSidebarProps) => {
  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== catId));
    } else {
      onCategoriesChange([...selectedCategories, catId]);
    }
  };

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <Slider
          min={0}
          max={5000}
          step={50}
          value={[priceRange[1]]}
          onValueChange={([v]) => onPriceRangeChange([0, v])}
          className="mb-2"
        />
        <p className="text-xs text-muted-foreground">Up to ₹{priceRange[1]}</p>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Min Rating</h3>
        <div className="flex gap-2">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => onMinRatingChange(r)}
              className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                minRating === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {r === 0 ? "All" : `${r}+`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
