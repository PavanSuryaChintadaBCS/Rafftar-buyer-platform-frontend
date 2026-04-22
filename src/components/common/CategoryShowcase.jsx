import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getProductImage } from "@/data/images";

const CategoryCard = React.memo(({ id, name, count, index }) => {
  const style = useMemo(
    () => ({ animationDelay: `${index * 80}ms` }),
    [index]
  );

  return (
    <Link
      to={`/category/${id}`}
      className="group relative rounded-xl overflow-hidden h-40 animate-fade-in"
      style={style}
    >
      <img
        src={getProductImage(id)}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-primary-foreground text-sm font-bold">
          {name}
        </p>
        <p className="text-primary-foreground/70 text-xs">
          {count} products
        </p>
      </div>
    </Link>
  );
});

CategoryCard.displayName = "CategoryCard";

const CategoryShowcase = React.memo(({ categoryHighlights }) => (
  <section className="py-6">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {categoryHighlights.map((item, i) => (
        <CategoryCard
          key={item.id}
          id={item.id}
          name={item.name}
          count={item.count}
          index={i}
        />
      ))}
    </div>
  </section>
));

CategoryShowcase.displayName = "CategoryShowcase";

export { CategoryShowcase, CategoryCard };

