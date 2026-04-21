import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SectionHeader({ icon, title, viewAllTo }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {viewAllTo && (
        <Link to={viewAllTo}>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary gap-1 hover:scale-105 transition-transform"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
