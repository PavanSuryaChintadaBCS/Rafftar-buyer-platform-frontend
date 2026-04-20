import { categories } from "@/data/mock";
import { Link } from "react-router-dom";
import { getProductImage } from "@/data/images";
const CategoryGrid = () => {
  return <section className="py-8"><h2 className="text-2xl font-bold mb-6">Browse Categories</h2><div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">{categories.map((cat, i) => <Link
    key={cat.id}
    to={`/category/${cat.id}`}
    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-300 group"
    style={{ animationDelay: `${i * 50}ms` }}
  ><div className="h-12 w-12 rounded-full overflow-hidden bg-secondary/30 group-hover:scale-110 transition-transform duration-300"><img
    src={getProductImage(cat.id)}
    alt={cat.name}
    loading="lazy"
    className="h-full w-full object-cover"
  /></div><span className="text-xs font-medium text-center text-foreground leading-tight">{cat.name}</span></Link>)}</div></section>;
};
export default CategoryGrid;
