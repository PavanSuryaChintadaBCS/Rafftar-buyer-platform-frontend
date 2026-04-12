import { Search, ShoppingCart, User, Package, LogOut, LogIn, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useBuyer } from "@/contexts/BuyerContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [query, setQuery] = useState("");
  const { itemCount } = useCart();
  const { buyer, login, logout, toggleKYC, setBuyerType } = useBuyer();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-primary">Build</span>
            <span className="text-foreground">Mart</span>
          </h1>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cement, steel, tiles, suppliers..."
            className="pl-10 bg-secondary/50 border-none focus-visible:ring-primary/30"
          />
        </form>

        <div className="flex items-center gap-1">
          {buyer.isLoggedIn && (
            <Link to="/orders">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Package className="h-5 w-5" />
              </Button>
            </Link>
          )}
          {buyer.isLoggedIn && (
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">{buyer.isLoggedIn ? buyer.name.split(" ")[0] : "Login"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {buyer.isLoggedIn ? (
                  <div>
                    <p className="font-medium">{buyer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {buyer.type === "rafftar" ? "⚡ Rafftar Buyer" : "Standard Buyer"}
                      {buyer.isKYCVerified ? " · KYC ✓" : " · KYC Pending"}
                    </p>
                  </div>
                ) : "Guest User"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {buyer.isLoggedIn && (
                <>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <Package className="h-4 w-4 mr-2" /> My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/kyc")}>
                    {buyer.isKYCVerified ? "✓ KYC Verified" : "Complete KYC →"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleKYC}>
                    {buyer.isKYCVerified ? "Simulate: Remove KYC" : "Simulate: Verify KYC"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBuyerType(buyer.type === "rafftar" ? "standard" : "rafftar")}>
                    {buyer.type === "rafftar" ? "Switch to Standard" : "Switch to Rafftar ⚡"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate("/"); }}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </>
              )}
              {!buyer.isLoggedIn && (
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  <LogIn className="h-4 w-4 mr-2" /> Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
