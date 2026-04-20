import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  const quickSearches = ["Cement", "TMT Steel", "Tiles", "Paints", "Plywood", "Electricals", "Hardware"];
  return <section className="py-12 md:py-20 text-center animate-fade-in"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 animate-scale-in"><TrendingUp className="h-3 w-3" />
        Trusted by 5,000+ builders across India
      </div><h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
        Find Construction Materials
        <br /><span className="text-primary">& Trusted Suppliers</span></h1><p className="text-muted-foreground mb-8 max-w-lg mx-auto">
        Search across thousands of products and connect directly with verified suppliers.
      </p><form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search products, suppliers, categories..."
    className="pl-12 h-12 text-base bg-card shadow-sm border-border/60 focus:shadow-md transition-shadow"
  /></div><Button type="submit" size="lg" className="h-12 px-6 hover:scale-105 transition-transform">
          Search
        </Button></form><div className="flex flex-wrap justify-center gap-2 mt-4">{quickSearches.map((term, i) => <Button
    key={term}
    variant="secondary"
    size="sm"
    className="text-xs hover:scale-105 transition-transform"
    style={{ animationDelay: `${i * 60}ms` }}
    onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
  >{term}</Button>)}</div></section>;
};
export default HeroSearch;
