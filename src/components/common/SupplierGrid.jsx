import SupplierCard from "@/components/supplier/SupplierCard";

export function SupplierGrid({
  suppliers,
  columns = "grid-cols-1 md:grid-cols-2",
  animationBase = 100,
}) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {suppliers.map((supplier, i) => (
        <div
          key={supplier.id}
          className="animate-fade-in"
          style={{ animationDelay: `${i * animationBase}ms` }}
        >
          <SupplierCard supplier={supplier} />
        </div>
      ))}
    </div>
  );
}
