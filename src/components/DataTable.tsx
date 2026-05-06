import { useMemo, useState, type ReactNode } from "react";
import { Search, ArrowUpDown, Download, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/EmptyState";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  onAdd?: () => void;
  addLabel?: string;
  filters?: ReactNode;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns, data, searchKeys, searchPlaceholder = "Search…", onAdd, addLabel = "Add",
  filters, emptyMessage = "No records found",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const loading = false;

  const filtered = useMemo(() => {
    let rows = data;
    if (query && searchKeys?.length) {
      const q = query.toLowerCase();
      rows = rows.filter((r) =>
        searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey];
        const bv = (b as Record<string, unknown>)[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, query, searchKeys, sortKey, sortDir]);

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((r) => r.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
          {filters}
          {!filters && (
            <Button variant="outline" size="sm" type="button">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <span className="text-xs text-muted-foreground">{selected.size} selected</span>
          )}
          <Button variant="outline" size="sm" type="button">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          {onAdd && (
            <Button size="sm" type="button" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" /> {addLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onCheckedChange={toggleAll}
                />
              </th>
              {columns.map((col) => (
                <th key={String(col.key)} className={`px-4 py-3 ${col.className ?? ""}`}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(String(col.key))}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {col.header} <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                  </td>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-0 py-0">
                  <EmptyState title={emptyMessage} description="Try adjusting your filters or search to find what you're looking for." />
                </td>
              </tr>
            )}
            {!loading && filtered.map((row) => (
              <tr key={row.id} className="border-b transition-colors last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selected.has(row.id)}
                    onCheckedChange={() => toggleOne(row.id)}
                  />
                </td>
                {columns.map((col) => (
                  <td key={String(col.key)} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
        <span>Showing {filtered.length} of {data.length}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" type="button" disabled>Previous</Button>
          <Button variant="outline" size="sm" type="button" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
