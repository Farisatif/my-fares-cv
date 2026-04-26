import { useEffect, useMemo, useState } from "react";
import { Copy, Check, Download, Upload, RotateCcw, AlertTriangle, FileJson } from "lucide-react";
import { toast } from "sonner";
import type { SiteData } from "@/components/SiteDataProvider";

/**
 * JsonForm — raw JSON editor for the entire site data.
 *
 * Acts as an "escape hatch" for the admin: any field on the page that is
 * not exposed by the typed forms can still be edited here directly. Edits
 * propagate to the parent draft via onChange, so clicking "Save all" in
 * the drawer header persists them to Lovable Cloud just like any other tab.
 *
 * Features:
 * - Live JSON validation with inline error reporting.
 * - Pretty-print + diff hint vs current saved value.
 * - Copy / download / import (.json file) helpers.
 * - Reset-to-current button to discard local edits in this tab.
 */
export function JsonForm({
  data,
  onChange,
}: {
  data: SiteData;
  onChange: (d: SiteData) => void;
}) {
  // We keep a local string buffer so the admin can type freely (including
  // syntactically-invalid intermediate states) without us clobbering it.
  const initial = useMemo(() => JSON.stringify(data, null, 2), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- initial only on mount
  const [text, setText] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Re-sync the textarea whenever the parent draft changes from OUTSIDE
  // this tab (e.g. another form mutated the draft, or a refresh happened).
  // We avoid clobbering in-progress edits: only sync if the parsed buffer
  // already matches the parent — meaning the admin hasn't started typing.
  useEffect(() => {
    try {
      const parsed = JSON.parse(text);
      if (JSON.stringify(parsed) === JSON.stringify(data)) {
        const next = JSON.stringify(data, null, 2);
        if (next !== text) setText(next);
      }
    } catch {
      // ignore — admin is mid-edit
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const apply = (next: string) => {
    setText(next);
    try {
      const parsed = JSON.parse(next) as SiteData;
      // Minimal sanity check — must be a plain object
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Root must be a JSON object");
      }
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const format = () => {
    try {
      const parsed = JSON.parse(text);
      const pretty = JSON.stringify(parsed, null, 2);
      setText(pretty);
      setError(null);
    } catch (e) {
      toast.error("Cannot format invalid JSON", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const reset = () => {
    setText(JSON.stringify(data, null, 2));
    setError(null);
    toast.success("Reverted to current data");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || "");
      apply(content);
      toast.success(`Loaded ${file.name}`);
    };
    reader.onerror = () => toast.error("Could not read file");
    reader.readAsText(file);
    // Reset value so the same file can be re-uploaded later.
    e.target.value = "";
  };

  const lineCount = text.split("\n").length;
  const charCount = text.length;

  return (
    <div className="flex flex-col gap-4 min-h-0">
      {/* Description */}
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-foreground" />
        <p className="leading-relaxed">
          Direct JSON editor for the entire site data. Changes here flow into
          the live draft instantly — click <strong className="text-foreground">Save all</strong> in the
          header to persist. Be careful: malformed structures may break the
          page until fixed.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={format}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
        >
          <FileJson className="h-3.5 w-3.5" />
          Format
        </button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
        <label className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition-colors cursor-pointer">
          <Upload className="h-3.5 w-3.5" />
          Import
          <input
            type="file"
            accept="application/json,.json"
            onChange={onUpload}
            className="hidden"
          />
        </label>
        <div className="flex-1" />
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Revert
        </button>
      </div>

      {/* Editor */}
      <div className="relative rounded-2xl border border-border bg-background overflow-hidden">
        <textarea
          value={text}
          onChange={(e) => apply(e.target.value)}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="w-full min-h-[420px] sm:min-h-[520px] p-4 sm:p-5 bg-transparent text-[12.5px] sm:text-[13px] font-mono leading-relaxed outline-none resize-y tabular-nums"
          dir="ltr"
          aria-label="Site data JSON"
        />
        {/* Status bar */}
        <div className="flex items-center justify-between gap-3 px-3 py-1.5 border-t border-border bg-secondary/40 text-[11px] font-mono text-muted-foreground">
          <span>
            {lineCount} lines · {charCount} chars
          </span>
          <span
            className={
              error
                ? "text-destructive"
                : "text-emerald-600 dark:text-emerald-400"
            }
          >
            {error ? `× ${error}` : "✓ Valid JSON"}
          </span>
        </div>
      </div>
    </div>
  );
}
