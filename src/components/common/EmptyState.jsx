import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function EmptyState({ icon, title, subtitle, actionLabel, actionTo }) {
  return (
    <div className="text-center py-20 animate-fade-in">
      {icon && (
        <div className="mx-auto mb-4 text-muted-foreground/30">{icon}</div>
      )}
      <p className="text-lg font-medium text-muted-foreground">{title}</p>
      {subtitle && (
        <p className="text-sm text-muted-foreground/70 mt-1">{subtitle}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button className="mt-6">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
