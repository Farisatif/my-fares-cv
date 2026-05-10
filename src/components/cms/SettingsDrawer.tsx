import React, { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Settings2, X, Save, Lock, LogOut, KeyRound, Copy, Check,
  User, Code2, Briefcase, FolderKanban, GraduationCap, Trophy, Languages,
  MessageSquare, Shield, AlertTriangle, Sparkles, Menu, Database, WifiOff,
  FileJson, Cpu, FileText, RotateCcw, Clock, Pencil,
} from "lucide-react";
import { DotPulse } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  saveSiteSettings,
  verifySettingsPassword,
  resetAdminPassword,
  pingDatabase,
} from "@/utils/settings.functions";
import { useSiteData, type SiteData } from "@/components/SiteDataProvider";
import { PersonalForm } from "./sections/PersonalForm";
import { SkillsForm } from "./sections/SkillsForm";
import { ExperienceForm } from "./sections/ExperienceForm";
import { ProjectsForm } from "./sections/ProjectsForm";
import { EducationForm } from "./sections/EducationForm";
import { AchievementsForm } from "./sections/AchievementsForm";
import { LanguagesForm } from "./sections/LanguagesForm";
import { CommentsAdmin } from "./sections/CommentsAdmin";
import { DangerZone } from "./sections/DangerZone";
import { SecurityForm } from "./sections/SecurityForm";
import { HeroForm } from "./sections/HeroForm";
import { NavigationForm } from "./sections/NavigationForm";
import { JsonForm } from "./sections/JsonForm";
import { TechMarqueeForm } from "./sections/TechMarqueeForm";
import { ContentForm } from "./sections/ContentForm";

const LOCAL_DRAFT_KEY = "cms_draft_v1";
const MAX_LOCAL = 5;
const LOCAL_LOCK_MS = 60 * 1000;

const TAB_GROUPS = [
  {
    label: "Content",
    tabs: [
      { id: "personal",    label: "Personal",    icon: User },
      { id: "hero",        label: "Hero",        icon: Sparkles },
      { id: "navigation",  label: "Navigation",  icon: Menu },
      { id: "content",     label: "Text & Copy", icon: FileText },
      { id: "skills",      label: "Skills",      icon: Code2 },
      { id: "experience",  label: "Experience",  icon: Briefcase },
      { id: "projects",    label: "Projects",    icon: FolderKanban },
      { id: "education",   label: "Education",   icon: GraduationCap },
      { id: "achievements",label: "Achievements",icon: Trophy },
      { id: "languages",   label: "Languages",   icon: Languages },
      { id: "techMarquee", label: "Tech Stack",  icon: Cpu },
    ],
  },
  {
    label: "Moderation",
    tabs: [
      { id: "comments", label: "Comments", icon: MessageSquare },
    ],
  },
  {
    label: "Developer",
    tabs: [
      { id: "json", label: "Raw JSON", icon: FileJson },
    ],
  },
  {
    label: "Account",
    tabs: [
      { id: "security", label: "Security",    icon: Shield },
      { id: "danger",   label: "Danger Zone", icon: AlertTriangle },
    ],
  },
] as const;

type Tab =
  | "personal" | "hero" | "navigation" | "content" | "skills"
  | "experience" | "projects" | "education" | "achievements"
  | "languages" | "techMarquee" | "comments" | "json" | "security" | "danger";

type TabDef = { id: Tab; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> };

type TabGroup = { label: string; tabs: TabDef[] };

const TAB_GROUPS_TYPED: TabGroup[] = TAB_GROUPS as unknown as TabGroup[];

const TABS: TabDef[] = TAB_GROUPS_TYPED.flatMap((g) => g.tabs);

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function loadLocalDraft(): SiteData | null {
  try {
    const raw = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SiteData;
  } catch {
    return null;
  }
}

function saveLocalDraft(data: SiteData) {
  try {
    localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(data));
  } catch { /* quota */ }
}

function clearLocalDraft() {
  try { localStorage.removeItem(LOCAL_DRAFT_KEY); } catch { /* noop */ }
}

export function SettingsDrawer() {
  const { data: live, refresh } = useSiteData();
  const verifySettingsPasswordFn = useServerFn(verifySettingsPassword);
  const saveSiteSettingsFn       = useServerFn(saveSiteSettings);
  const resetAdminPasswordFn     = useServerFn(resetAdminPassword);
  const pingDatabaseFn           = useServerFn(pingDatabase);

  const [open, setOpen]       = useState(false);
  const [tab, setTab]         = useState<Tab>("personal");
  const [draft, setDraft]     = useState<SiteData>(live);
  const [saving, setSaving]   = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [dbStatus, setDbStatus]   = useState<"idle" | "checking" | "online" | "offline">("idle");
  const [dbLatency, setDbLatency] = useState<number | null>(null);

  const [password,  setPassword]  = useState("");
  const [verifying, setVerifying] = useState(false);
  const [attempts,  setAttempts]  = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [authedPw,  setAuthedPw]  = useState("");

  const [showReset,      setShowReset]      = useState(false);
  const [resetCode,      setResetCode]      = useState("");
  const [resetNew,       setResetNew]       = useState("");
  const [resetConfirm,   setResetConfirm]   = useState("");
  const [resetting,      setResetting]      = useState(false);
  const [newRecoveryCode,setNewRecoveryCode]= useState<string | null>(null);
  const [copied,         setCopied]         = useState(false);

  // Confirm-before-close dialog
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(live);
  const isLocked   = lockedUntil > Date.now();

  // ── Draft sync ───────────────────────────────────────────────────────────────
  // When drawer opens, restore localStorage draft if available (only when unlocked).
  useEffect(() => {
    if (!open) return;
    if (unlocked) {
      const local = loadLocalDraft();
      setDraft(local ?? live);
    } else {
      setDraft(live);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // When live data refreshes and we have no local edits, sync draft.
  useEffect(() => {
    if (!hasChanges) setDraft(live);
  }, [live]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist draft to localStorage while editing.
  useEffect(() => {
    if (unlocked && hasChanges) {
      saveLocalDraft(draft);
    }
  }, [draft, unlocked, hasChanges]);

  // ── Body scroll lock ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // ── DB ping on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setDbStatus("checking");
    setDbLatency(null);
    pingDatabaseFn()
      .then((res) => {
        if (cancelled) return;
        setDbStatus(res.ok ? "online" : "offline");
        setDbLatency(res.latencyMs);
      })
      .catch(() => { if (!cancelled) setDbStatus("offline"); });
    return () => { cancelled = true; };
  }, [open, pingDatabaseFn]);

  // ── Cmd/Ctrl+S to save ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || !unlocked) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (!saving) save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, unlocked, saving, draft, authedPw]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actions ──────────────────────────────────────────────────────────────────
  const tryClose = () => {
    if (unlocked && hasChanges) {
      setShowCloseConfirm(true);
    } else {
      doClose();
    }
  };

  const doClose = () => {
    setOpen(false);
    setShowCloseConfirm(false);
  };

  const unlock = async () => {
    if (isLocked) {
      toast.error("Too many attempts", { description: "Please wait a moment before trying again." });
      return;
    }
    if (!password) return;
    setVerifying(true);
    try {
      const result = await verifySettingsPasswordFn({ data: { password } });
      if (!result.ok) {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= MAX_LOCAL) {
          setLockedUntil(Date.now() + LOCAL_LOCK_MS);
          setAttempts(0);
        }
        toast.error("Access denied", { description: result.error });
        return;
      }
      setUnlocked(true);
      setAuthedPw(password);
      setPassword("");
      setAttempts(0);
      // Restore any saved draft from localStorage
      const local = loadLocalDraft();
      if (local) {
        setDraft(local);
        toast.info("Draft restored", { description: "You have unsaved changes from a previous session." });
      } else {
        setDraft(live);
      }
      const ping = await pingDatabaseFn().catch(() => null);
      if (ping?.ok) {
        setDbStatus("online");
        setDbLatency(ping.latencyMs);
        toast.success("Edit mode unlocked", {
          description: `Connected · ${ping.latencyMs}ms`,
        });
      } else {
        setDbStatus("offline");
        toast.warning("Edit mode unlocked", {
          description: "Database offline — saves may fail.",
        });
      }
    } catch (e) {
      toast.error("Access denied", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setVerifying(false);
    }
  };

  const lock = () => {
    setUnlocked(false);
    setAuthedPw("");
    setPassword("");
    clearLocalDraft();
  };

  const discard = () => {
    setDraft(live);
    clearLocalDraft();
    setShowCloseConfirm(false);
    toast("Changes discarded", { description: "Reverted to last saved version." });
  };

  const save = async () => {
    if (!authedPw) { toast.error("Locked"); return; }
    setSaving(true);
    try {
      const result = await saveSiteSettingsFn({ data: { password: authedPw, data: draft } });
      if (!result.ok) {
        toast.error("Save failed", { description: result.error });
        return;
      }
      const now = new Date();
      setSavedAt(now);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2200);
      clearLocalDraft();
      toast.success("Saved", { description: `Changes published at ${fmtTime(now)}` });
      refresh();
    } catch (e) {
      toast.error("Save failed", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setSaving(false);
    }
  };

  const submitReset = async () => {
    if (!resetCode || !resetNew) { toast.error("Fill all fields"); return; }
    if (resetNew.length < 6)     { toast.error("Password must be at least 6 characters"); return; }
    if (resetNew !== resetConfirm){ toast.error("Passwords don't match"); return; }
    setResetting(true);
    try {
      const result = await resetAdminPasswordFn({ data: { recoveryCode: resetCode, newPassword: resetNew } });
      if (!result.ok) { toast.error("Reset failed", { description: result.error }); return; }
      setNewRecoveryCode(result.newRecoveryCode);
      setResetCode(""); setResetNew(""); setResetConfirm("");
      toast.success("Password reset successfully");
    } catch (e) {
      toast.error("Reset failed", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setResetting(false);
    }
  };

  const closeReset = () => {
    setShowReset(false);
    setNewRecoveryCode(null);
    setResetCode(""); setResetNew(""); setResetConfirm("");
    setCopied(false);
  };

  const copyCode = async () => {
    if (!newRecoveryCode) return;
    try {
      await navigator.clipboard.writeText(newRecoveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Could not copy"); }
  };

  const renderTab = () => {
    switch (tab) {
      case "personal":     return <PersonalForm data={draft} onChange={setDraft} />;
      case "hero":         return <HeroForm data={draft} onChange={setDraft} />;
      case "navigation":   return <NavigationForm data={draft} onChange={setDraft} />;
      case "content":      return <ContentForm data={draft} onChange={setDraft} />;
      case "skills":       return <SkillsForm data={draft} onChange={setDraft} />;
      case "experience":   return <ExperienceForm data={draft} onChange={setDraft} />;
      case "projects":     return <ProjectsForm data={draft} onChange={setDraft} />;
      case "education":    return <EducationForm data={draft} onChange={setDraft} />;
      case "achievements": return <AchievementsForm data={draft} onChange={setDraft} />;
      case "languages":    return <LanguagesForm data={draft} onChange={setDraft} />;
      case "techMarquee":  return <TechMarqueeForm data={draft} onChange={setDraft} />;
      case "comments":     return <CommentsAdmin password={authedPw} />;
      case "json":         return <JsonForm data={draft} onChange={setDraft} />;
      case "security":     return <SecurityForm password={authedPw} />;
      case "danger":       return <DangerZone data={draft} onChange={setDraft} />;
    }
  };

  const activeTab = TABS.find((t) => t.id === tab);

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open CMS"
        data-cursor="view"
        data-cursor-label="Edit"
        className="inline-flex items-center gap-2 rounded-full border border-current/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 hover:bg-current/5 transition-all"
        style={{ borderColor: "color-mix(in oklab, currentColor 25%, transparent)" }}
      >
        <Settings2 className="h-3.5 w-3.5" />
        <span>CMS</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-6"
            onClick={tryClose}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              dir="ltr"
              style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
              className="w-full max-w-5xl rounded-t-3xl sm:rounded-3xl overflow-hidden brand-shadow flex flex-col h-[95vh] sm:h-auto sm:max-h-[92vh] border border-[var(--hairline)]"
            >
              {/* ── Header ─────────────────────────────────────────────────── */}
              <div className="sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-lg sm:text-xl tracking-tight">Site CMS</span>

                    {/* DB badge */}
                    <DbBadge status={dbStatus} latency={dbLatency} />

                    {/* Unsaved indicator */}
                    {unlocked && hasChanges && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Unsaved
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center gap-2" aria-live="polite">
                    {unlocked ? (
                      <>
                        <Pencil className="h-3 w-3" />
                        <span>Edit mode — saves to Supabase</span>
                        {savedAt && (
                          <span className="flex items-center gap-1 opacity-70">
                            <Clock className="h-3 w-3" />
                            Last saved {fmtTime(savedAt)}
                          </span>
                        )}
                        {unlocked && (
                          <span className="hidden sm:inline opacity-50">· ⌘S to save</span>
                        )}
                      </>
                    ) : (
                      <span>Read-only — enter password to edit</span>
                    )}
                  </div>
                </div>

                {/* Header actions */}
                <div className="flex items-center gap-2">
                  {unlocked && hasChanges && (
                    <button
                      onClick={discard}
                      title="Discard all unsaved changes"
                      className="inline-flex items-center justify-center gap-1.5 text-xs px-3 py-2 sm:py-1.5 rounded-full border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span className="hidden sm:inline">Discard</span>
                    </button>
                  )}
                  {unlocked && (
                    <button
                      onClick={lock}
                      className="inline-flex items-center justify-center gap-1.5 text-xs px-3 py-2 sm:py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                    >
                      <LogOut className="h-3 w-3" />
                      <span className="hidden sm:inline">Lock</span>
                    </button>
                  )}
                  {unlocked && (
                    <button
                      onClick={save}
                      disabled={saving || (!hasChanges && !justSaved)}
                      className={`inline-flex items-center justify-center gap-1.5 text-xs px-3 sm:px-4 py-2 sm:py-1.5 rounded-full transition-all disabled:opacity-40 ${
                        justSaved
                          ? "bg-emerald-600 text-white"
                          : hasChanges
                            ? "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/30"
                            : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      {saving ? (
                        <DotPulse />
                      ) : justSaved ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      {saving ? "Saving…" : justSaved ? "Saved!" : "Save"}
                    </button>
                  )}
                  <button
                    onClick={tryClose}
                    aria-label="Close"
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* ── Close confirm banner ────────────────────────────────────── */}
              <AnimatePresence>
                {showCloseConfirm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-amber-500/10 border-b border-amber-500/20"
                  >
                    <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 text-sm">
                      <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        You have unsaved changes. Discard them?
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setShowCloseConfirm(false)}
                          className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                        >
                          Keep editing
                        </button>
                        <button
                          onClick={() => { discard(); doClose(); }}
                          className="text-xs px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                        >
                          Discard & close
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Body ───────────────────────────────────────────────────── */}
              {!unlocked ? (
                showReset ? (
                  <ResetPasswordScreen
                    newRecoveryCode={newRecoveryCode}
                    copied={copied}
                    resetting={resetting}
                    resetCode={resetCode} setResetCode={setResetCode}
                    resetNew={resetNew}   setResetNew={setResetNew}
                    resetConfirm={resetConfirm} setResetConfirm={setResetConfirm}
                    onSubmit={submitReset}
                    onClose={closeReset}
                    onCopy={copyCode}
                  />
                ) : (
                  <LoginScreen
                    password={password}
                    setPassword={setPassword}
                    verifying={verifying}
                    isLocked={isLocked}
                    onUnlock={unlock}
                    onForgot={() => setShowReset(true)}
                  />
                )
              ) : (
                <div className="flex-1 flex flex-col md:flex-row min-h-0">
                  {/* Mobile tabs — horizontal scroll */}
                  <div className="md:hidden border-b border-border overflow-x-auto no-scrollbar">
                    <div className="flex gap-1 p-2 min-w-max">
                      {TABS.map((t) => {
                        const Icon = t.icon;
                        const active = tab === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 text-[13px] rounded-full whitespace-nowrap transition-colors ${
                              active
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desktop sidebar — vertical with groups */}
                  <aside className="hidden md:flex flex-col w-[200px] shrink-0 border-r border-border py-3 overflow-y-auto bg-secondary/30">
                    {TAB_GROUPS.map((group, gi) => (
                      <div key={gi} className={gi > 0 ? "mt-2 pt-2 border-t border-border/50" : ""}>
                        <p className="px-4 pb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">
                          {group.label}
                        </p>
                        {group.tabs.map((t) => {
                          const Icon = t.icon;
                          const active = tab === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setTab(t.id)}
                              className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm rounded-none transition-colors text-left group ${
                                active
                                  ? "bg-background text-foreground font-medium border-r-2 border-foreground"
                                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </aside>

                  {/* Tab content */}
                  <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 min-w-0">
                    {activeTab && (
                      <div className="mb-6 hidden md:flex items-center gap-3 pb-4 border-b border-border">
                        <div className="p-2 rounded-lg bg-secondary">
                          <activeTab.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base leading-tight">{activeTab.label}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {TAB_GROUPS.find((g) => g.tabs.some((t) => t.id === tab))?.label}
                          </p>
                        </div>
                      </div>
                    )}
                    {renderTab()}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function DbBadge({ status, latency }: { status: string; latency: number | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      title={
        status === "online"
          ? `Supabase connected${latency !== null ? ` · ${latency}ms` : ""}`
          : status === "offline"
            ? "Database unreachable"
            : "Checking connection…"
      }
      className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border ${
        status === "online"
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
          : status === "offline"
            ? "bg-destructive/10 text-destructive border-destructive/30"
            : "bg-muted text-muted-foreground border-border"
      }`}
    >
      {status === "offline" ? (
        <WifiOff className="h-2.5 w-2.5" />
      ) : status === "checking" ? (
        <DotPulse />
      ) : (
        <Database className="h-2.5 w-2.5" />
      )}
      <span>
        {status === "online"
          ? `DB · ${latency ?? "—"}ms`
          : status === "offline"
            ? "DB offline"
            : "DB…"}
      </span>
    </div>
  );
}

function LoginScreen({
  password, setPassword, verifying, isLocked, onUnlock, onForgot,
}: {
  password: string;
  setPassword: (v: string) => void;
  verifying: boolean;
  isLocked: boolean;
  onUnlock: () => void;
  onForgot: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 sm:p-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="p-4 rounded-2xl bg-secondary border border-border">
          <Lock className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Admin access required</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Enter your password to unlock edit mode and publish changes.
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <input
          ref={inputRef}
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onUnlock(); }}
          disabled={isLocked || verifying}
          autoComplete="current-password"
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition disabled:opacity-50"
        />
        <button
          onClick={onUnlock}
          disabled={isLocked || verifying || !password}
          className="w-full inline-flex items-center justify-center gap-2 text-sm px-5 py-3 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 transition font-medium"
        >
          {verifying ? <DotPulse /> : <Lock className="h-4 w-4" />}
          {isLocked ? "Too many attempts — wait" : verifying ? "Verifying…" : "Unlock CMS"}
        </button>
        <button
          onClick={onForgot}
          className="w-full text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors py-1"
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}

function ResetPasswordScreen({
  newRecoveryCode, copied, resetting,
  resetCode, setResetCode,
  resetNew, setResetNew,
  resetConfirm, setResetConfirm,
  onSubmit, onClose, onCopy,
}: {
  newRecoveryCode: string | null;
  copied: boolean;
  resetting: boolean;
  resetCode: string; setResetCode: (v: string) => void;
  resetNew: string;   setResetNew: (v: string) => void;
  resetConfirm: string; setResetConfirm: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 sm:p-12 overflow-auto">
      {newRecoveryCode ? (
        <div className="w-full max-w-sm flex flex-col items-center gap-5">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <KeyRound className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-center">
            <h2 className="font-semibold text-lg">Password reset successfully</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Save this new recovery code — <strong>it won't be shown again.</strong>
            </p>
          </div>
          <div className="w-full bg-secondary rounded-2xl p-4 font-mono text-center text-base tracking-widest break-all select-all border border-border">
            {newRecoveryCode}
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={onCopy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/70 border border-border transition"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy code"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center text-sm px-4 py-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition font-medium"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-4 rounded-2xl bg-secondary border border-border">
              <KeyRound className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Reset password</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your one-time recovery code and choose a new password.
              </p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Recovery code (XXXX-XXXX-…)"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            autoComplete="off"
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-foreground transition"
          />
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            value={resetNew}
            onChange={(e) => setResetNew(e.target.value)}
            autoComplete="new-password"
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-foreground transition"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={resetConfirm}
            onChange={(e) => setResetConfirm(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
            autoComplete="new-password"
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-foreground transition"
          />
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/70 border border-border transition"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={resetting || !resetCode || !resetNew}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm px-4 py-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 transition font-medium"
            >
              {resetting ? <DotPulse /> : <KeyRound className="h-4 w-4" />}
              {resetting ? "Resetting…" : "Reset password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
