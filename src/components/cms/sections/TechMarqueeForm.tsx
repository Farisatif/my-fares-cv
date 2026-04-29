import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import type { SiteData } from "@/components/SiteDataProvider";

// Available icons for tech items
const ICON_OPTIONS = [
  { value: "code", label: "Code" },
  { value: "braces", label: "Braces" },
  { value: "database", label: "Database" },
  { value: "globe", label: "Globe" },
  { value: "layers", label: "Layers" },
  { value: "cpu", label: "CPU" },
  { value: "server", label: "Server" },
  { value: "smartphone", label: "Smartphone" },
  { value: "terminal", label: "Terminal" },
  { value: "file", label: "File" },
  { value: "git", label: "Git" },
  { value: "cloud", label: "Cloud" },
  { value: "palette", label: "Palette" },
  { value: "boxes", label: "Boxes" },
  { value: "zap", label: "Zap" },
  { value: "shield", label: "Shield" },
  { value: "rocket", label: "Rocket" },
  { value: "binary", label: "Binary" },
];

interface TechItem {
  icon: string;
  text_en: string;
  text_ar: string;
}

interface Props {
  data: SiteData;
  onChange: (d: SiteData) => void;
}

export function TechMarqueeForm({ data, onChange }: Props) {
  const items: TechItem[] = (data as any).techMarquee?.items || [];
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const update = (newItems: TechItem[]) => {
    onChange({
      ...data,
      techMarquee: { items: newItems },
    } as SiteData);
  };

  const updateItem = (index: number, field: keyof TechItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    update(newItems);
  };

  const addItem = () => {
    update([
      ...items,
      { icon: "code", text_en: "New Tech", text_ar: "تقنية جديدة" },
    ]);
    setExpandedId(items.length);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    update(newItems);
    if (expandedId === index) setExpandedId(null);
  };

  const handleReorder = (newOrder: TechItem[]) => {
    update(newOrder);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Tech Marquee</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Manage the animated tech stack showcase
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add Tech
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-xl">
          No tech items yet. Click "Add Tech" to get started.
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="space-y-2"
        >
          {items.map((item, index) => (
            <Reorder.Item
              key={`${item.text_en}-${index}`}
              value={item}
              className="touch-none"
            >
              <div
                className="rounded-xl border bg-background overflow-hidden transition-colors"
                style={{
                  borderColor: expandedId === index
                    ? "color-mix(in oklab, var(--primary) 50%, var(--border))"
                    : "var(--border)",
                }}
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === index ? null : index)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <span className="font-mono text-xs text-muted-foreground w-6 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {item.text_en}
                    </div>
                    <div className="text-xs text-muted-foreground truncate" dir="rtl">
                      {item.text_ar}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-secondary">
                    {item.icon}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      expandedId === index ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Expanded form */}
                <AnimatePresence>
                  {expandedId === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 space-y-3 border-t">
                        {/* Icon selector */}
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">
                            Icon
                          </label>
                          <select
                            value={item.icon}
                            onChange={(e) => updateItem(index, "icon", e.target.value)}
                            className="w-full bg-secondary border-0 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                          >
                            {ICON_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* English text */}
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">
                            English Text
                          </label>
                          <input
                            type="text"
                            value={item.text_en}
                            onChange={(e) => updateItem(index, "text_en", e.target.value)}
                            className="w-full bg-secondary border-0 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="React"
                          />
                        </div>

                        {/* Arabic text */}
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">
                            Arabic Text
                          </label>
                          <input
                            type="text"
                            value={item.text_ar}
                            onChange={(e) => updateItem(index, "text_ar", e.target.value)}
                            dir="rtl"
                            className="w-full bg-secondary border-0 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="رياكت"
                          />
                        </div>

                        {/* Delete button */}
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      <p className="text-[10px] text-muted-foreground text-center pt-2">
        Drag items to reorder. Changes are saved when you click "Save all".
      </p>
    </div>
  );
}
