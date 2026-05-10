import type { SiteData } from "@/components/SiteDataProvider";
import { Field, TextInput, TextArea } from "../Field";
import { BiField } from "../BiField";

type ContentSection = NonNullable<SiteData["content"]>;

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 mb-4">
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function ContentForm({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const content = (data.content ?? {}) as ContentSection;
  const set = (patch: Partial<ContentSection>) =>
    onChange({ ...data, content: { ...content, ...patch } });

  const setSection = <K extends keyof ContentSection>(
    key: K,
    patch: Partial<ContentSection[K]>,
  ) =>
    set({ [key]: { ...(content[key] ?? {}), ...patch } } as Partial<ContentSection>);

  const hero = content.hero ?? {};
  const about = content.about ?? {};
  const skills = content.skills ?? {};
  const experience = content.experience ?? {};
  const achievements = content.achievements ?? {};
  const languages = content.languages ?? {};
  const contact = content.contact ?? {};
  const footer = content.footer ?? {};
  const comments = content.comments ?? {};

  return (
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground">
        Edit every UI label, section title, button text, and micro-copy across the entire site — in both English and Arabic.
      </p>

      {/* ── HERO ── */}
      <div className="space-y-3">
        <SectionHeader title="Hero Section" desc="The first thing visitors see — availability badge, CTA buttons, tagline." />
        <BiField
          label="Availability chip"
          en={hero.chip_en ?? ""}
          ar={hero.chip_ar ?? ""}
          onEn={(v) => setSection("hero", { chip_en: v })}
          onAr={(v) => setSection("hero", { chip_ar: v })}
        />
        <BiField
          label="Greeting prefix"
          en={hero.greeting_en ?? ""}
          ar={hero.greeting_ar ?? ""}
          onEn={(v) => setSection("hero", { greeting_en: v })}
          onAr={(v) => setSection("hero", { greeting_ar: v })}
        />
        <BiField
          label="Floating badge (avatar)"
          en={hero.floatingBadge_en ?? ""}
          ar={hero.floatingBadge_ar ?? ""}
          onEn={(v) => setSection("hero", { floatingBadge_en: v })}
          onAr={(v) => setSection("hero", { floatingBadge_ar: v })}
        />
        <BiField
          label="Primary CTA button"
          en={hero.ctaPrimary_en ?? ""}
          ar={hero.ctaPrimary_ar ?? ""}
          onEn={(v) => setSection("hero", { ctaPrimary_en: v })}
          onAr={(v) => setSection("hero", { ctaPrimary_ar: v })}
        />
        <BiField
          label="Secondary CTA button"
          en={hero.ctaSecondary_en ?? ""}
          ar={hero.ctaSecondary_ar ?? ""}
          onEn={(v) => setSection("hero", { ctaSecondary_en: v })}
          onAr={(v) => setSection("hero", { ctaSecondary_ar: v })}
        />
        <BiField
          label="Tagline strip"
          en={hero.tagline_en ?? ""}
          ar={hero.tagline_ar ?? ""}
          onEn={(v) => setSection("hero", { tagline_en: v })}
          onAr={(v) => setSection("hero", { tagline_ar: v })}
        />
        <BiField
          label="Scroll prompt"
          en={hero.scrollPrompt_en ?? ""}
          ar={hero.scrollPrompt_ar ?? ""}
          onEn={(v) => setSection("hero", { scrollPrompt_en: v })}
          onAr={(v) => setSection("hero", { scrollPrompt_ar: v })}
        />
      </div>

      <Divider label="About" />

      {/* ── ABOUT ── */}
      <div className="space-y-3">
        <SectionHeader title="About Section" desc="Section eyebrow, heading, and the developer bio code block." />
        <BiField
          label="Eyebrow label"
          en={about.eyebrow_en ?? ""}
          ar={about.eyebrow_ar ?? ""}
          onEn={(v) => setSection("about", { eyebrow_en: v })}
          onAr={(v) => setSection("about", { eyebrow_ar: v })}
        />
        <BiField
          label="Title prefix"
          en={about.titlePrefix_en ?? ""}
          ar={about.titlePrefix_ar ?? ""}
          onEn={(v) => setSection("about", { titlePrefix_en: v })}
          onAr={(v) => setSection("about", { titlePrefix_ar: v })}
        />
        <BiField
          label="Title accent"
          en={about.titleAccent_en ?? ""}
          ar={about.titleAccent_ar ?? ""}
          onEn={(v) => setSection("about", { titleAccent_en: v })}
          onAr={(v) => setSection("about", { titleAccent_ar: v })}
        />
        <BiField
          label="Code comment block"
          multiline
          rows={4}
          en={about.codeComment_en ?? ""}
          ar={about.codeComment_ar ?? ""}
          onEn={(v) => setSection("about", { codeComment_en: v })}
          onAr={(v) => setSection("about", { codeComment_ar: v })}
        />
      </div>

      <Divider label="Skills / Toolkit" />

      {/* ── SKILLS ── */}
      <div className="space-y-3">
        <SectionHeader title="Skills Section" desc="Eyebrow and heading for the physics skills cloud." />
        <BiField
          label="Eyebrow label"
          en={skills.eyebrow_en ?? ""}
          ar={skills.eyebrow_ar ?? ""}
          onEn={(v) => setSection("skills", { eyebrow_en: v })}
          onAr={(v) => setSection("skills", { eyebrow_ar: v })}
        />
        <BiField
          label="Title prefix"
          en={skills.titlePrefix_en ?? ""}
          ar={skills.titlePrefix_ar ?? ""}
          onEn={(v) => setSection("skills", { titlePrefix_en: v })}
          onAr={(v) => setSection("skills", { titlePrefix_ar: v })}
        />
        <BiField
          label="Title accent"
          en={skills.titleAccent_en ?? ""}
          ar={skills.titleAccent_ar ?? ""}
          onEn={(v) => setSection("skills", { titleAccent_en: v })}
          onAr={(v) => setSection("skills", { titleAccent_ar: v })}
        />
      </div>

      <Divider label="Experience" />

      {/* ── EXPERIENCE ── */}
      <div className="space-y-3">
        <SectionHeader title="Experience Section" desc="Eyebrow, heading, and subtitle paragraph for the work history." />
        <BiField
          label="Eyebrow label"
          en={experience.eyebrow_en ?? ""}
          ar={experience.eyebrow_ar ?? ""}
          onEn={(v) => setSection("experience", { eyebrow_en: v })}
          onAr={(v) => setSection("experience", { eyebrow_ar: v })}
        />
        <BiField
          label="Title prefix"
          en={experience.titlePrefix_en ?? ""}
          ar={experience.titlePrefix_ar ?? ""}
          onEn={(v) => setSection("experience", { titlePrefix_en: v })}
          onAr={(v) => setSection("experience", { titlePrefix_ar: v })}
        />
        <BiField
          label="Title accent"
          en={experience.titleAccent_en ?? ""}
          ar={experience.titleAccent_ar ?? ""}
          onEn={(v) => setSection("experience", { titleAccent_en: v })}
          onAr={(v) => setSection("experience", { titleAccent_ar: v })}
        />
        <BiField
          label="Subtitle paragraph"
          multiline
          rows={3}
          en={(experience as Record<string, string>).description_en ?? ""}
          ar={(experience as Record<string, string>).description_ar ?? ""}
          onEn={(v) => setSection("experience", { ...experience, description_en: v } as never)}
          onAr={(v) => setSection("experience", { ...experience, description_ar: v } as never)}
        />
      </div>

      <Divider label="Achievements" />

      {/* ── ACHIEVEMENTS ── */}
      <div className="space-y-3">
        <SectionHeader title="Achievements Section" desc="Eyebrow, heading, and subtitle for the milestones grid." />
        <BiField
          label="Eyebrow label"
          en={achievements.eyebrow_en ?? ""}
          ar={achievements.eyebrow_ar ?? ""}
          onEn={(v) => setSection("achievements", { eyebrow_en: v })}
          onAr={(v) => setSection("achievements", { eyebrow_ar: v })}
        />
        <BiField
          label="Title prefix"
          en={achievements.titlePrefix_en ?? ""}
          ar={achievements.titlePrefix_ar ?? ""}
          onEn={(v) => setSection("achievements", { titlePrefix_en: v })}
          onAr={(v) => setSection("achievements", { titlePrefix_ar: v })}
        />
        <BiField
          label="Title accent"
          en={achievements.titleAccent_en ?? ""}
          ar={achievements.titleAccent_ar ?? ""}
          onEn={(v) => setSection("achievements", { titleAccent_en: v })}
          onAr={(v) => setSection("achievements", { titleAccent_ar: v })}
        />
        <BiField
          label="Subtitle paragraph"
          multiline
          rows={2}
          en={(achievements as Record<string, string>).description_en ?? ""}
          ar={(achievements as Record<string, string>).description_ar ?? ""}
          onEn={(v) => setSection("achievements", { ...achievements, description_en: v } as never)}
          onAr={(v) => setSection("achievements", { ...achievements, description_ar: v } as never)}
        />
      </div>

      <Divider label="Languages Chart" />

      {/* ── LANGUAGES ── */}
      <div className="space-y-3">
        <SectionHeader title="Languages Section" desc="Eyebrow, heading, and subtitle for the coding languages gauge." />
        <BiField
          label="Eyebrow label"
          en={languages.eyebrow_en ?? ""}
          ar={languages.eyebrow_ar ?? ""}
          onEn={(v) => setSection("languages", { eyebrow_en: v })}
          onAr={(v) => setSection("languages", { eyebrow_ar: v })}
        />
        <BiField
          label="Title prefix"
          en={languages.titlePrefix_en ?? ""}
          ar={languages.titlePrefix_ar ?? ""}
          onEn={(v) => setSection("languages", { titlePrefix_en: v })}
          onAr={(v) => setSection("languages", { titlePrefix_ar: v })}
        />
        <BiField
          label="Title accent"
          en={languages.titleAccent_en ?? ""}
          ar={languages.titleAccent_ar ?? ""}
          onEn={(v) => setSection("languages", { titleAccent_en: v })}
          onAr={(v) => setSection("languages", { titleAccent_ar: v })}
        />
        <BiField
          label="Subtitle paragraph"
          multiline
          rows={2}
          en={(languages as Record<string, string>).description_en ?? ""}
          ar={(languages as Record<string, string>).description_ar ?? ""}
          onEn={(v) => setSection("languages", { ...languages, description_en: v } as never)}
          onAr={(v) => setSection("languages", { ...languages, description_ar: v } as never)}
        />
      </div>

      <Divider label="Contact" />

      {/* ── CONTACT ── */}
      <div className="space-y-3">
        <SectionHeader title="Contact Section" desc="Eyebrow, heading, description, and button labels." />
        <BiField
          label="Eyebrow label"
          en={contact.eyebrow_en ?? ""}
          ar={contact.eyebrow_ar ?? ""}
          onEn={(v) => setSection("contact", { eyebrow_en: v })}
          onAr={(v) => setSection("contact", { eyebrow_ar: v })}
        />
        <BiField
          label="Title prefix"
          en={contact.titlePrefix_en ?? ""}
          ar={contact.titlePrefix_ar ?? ""}
          onEn={(v) => setSection("contact", { titlePrefix_en: v })}
          onAr={(v) => setSection("contact", { titlePrefix_ar: v })}
        />
        <BiField
          label="Title accent"
          en={contact.titleAccent_en ?? ""}
          ar={contact.titleAccent_ar ?? ""}
          onEn={(v) => setSection("contact", { titleAccent_en: v })}
          onAr={(v) => setSection("contact", { titleAccent_ar: v })}
        />
        <BiField
          label="Description"
          multiline
          rows={3}
          en={contact.description_en ?? ""}
          ar={contact.description_ar ?? ""}
          onEn={(v) => setSection("contact", { description_en: v })}
          onAr={(v) => setSection("contact", { description_ar: v })}
        />
        <BiField
          label="WhatsApp button label"
          en={contact.whatsappLabel_en ?? ""}
          ar={contact.whatsappLabel_ar ?? ""}
          onEn={(v) => setSection("contact", { whatsappLabel_en: v })}
          onAr={(v) => setSection("contact", { whatsappLabel_ar: v })}
        />
      </div>

      <Divider label="Footer" />

      {/* ── FOOTER ── */}
      <div className="space-y-3">
        <SectionHeader title="Footer" desc="Large footer heading, subtitle, and bottom bar text." />
        <BiField
          label="Main title"
          en={footer.title_en ?? ""}
          ar={footer.title_ar ?? ""}
          onEn={(v) => setSection("footer", { title_en: v })}
          onAr={(v) => setSection("footer", { title_ar: v })}
        />
        <BiField
          label="Subtitle (accent)"
          en={footer.subtitle_en ?? ""}
          ar={footer.subtitle_ar ?? ""}
          onEn={(v) => setSection("footer", { subtitle_en: v })}
          onAr={(v) => setSection("footer", { subtitle_ar: v })}
        />
        <BiField
          label="Crafted-with label"
          en={footer.crafted_en ?? ""}
          ar={footer.crafted_ar ?? ""}
          onEn={(v) => setSection("footer", { crafted_en: v })}
          onAr={(v) => setSection("footer", { crafted_ar: v })}
        />
        <BiField
          label="Location label"
          en={footer.location_en ?? ""}
          ar={footer.location_ar ?? ""}
          onEn={(v) => setSection("footer", { location_en: v })}
          onAr={(v) => setSection("footer", { location_ar: v })}
        />
      </div>

      <Divider label="Comments / Guestbook" />

      {/* ── COMMENTS ── */}
      <div className="space-y-3">
        <SectionHeader title="Comments Page" desc="All labels, placeholders, and states for the public guestbook." />
        <BiField
          label="Eyebrow label"
          en={comments.eyebrow_en ?? ""}
          ar={comments.eyebrow_ar ?? ""}
          onEn={(v) => setSection("comments", { eyebrow_en: v })}
          onAr={(v) => setSection("comments", { eyebrow_ar: v })}
        />
        <BiField
          label="Title prefix"
          en={comments.titlePrefix_en ?? ""}
          ar={comments.titlePrefix_ar ?? ""}
          onEn={(v) => setSection("comments", { titlePrefix_en: v })}
          onAr={(v) => setSection("comments", { titlePrefix_ar: v })}
        />
        <BiField
          label="Title accent"
          en={comments.titleAccent_en ?? ""}
          ar={comments.titleAccent_ar ?? ""}
          onEn={(v) => setSection("comments", { titleAccent_en: v })}
          onAr={(v) => setSection("comments", { titleAccent_ar: v })}
        />
        <BiField
          label="Description"
          multiline
          rows={2}
          en={comments.description_en ?? ""}
          ar={comments.description_ar ?? ""}
          onEn={(v) => setSection("comments", { description_en: v })}
          onAr={(v) => setSection("comments", { description_ar: v })}
        />
        <BiField
          label="Name field label"
          en={comments.nameLabel_en ?? ""}
          ar={comments.nameLabel_ar ?? ""}
          onEn={(v) => setSection("comments", { nameLabel_en: v })}
          onAr={(v) => setSection("comments", { nameLabel_ar: v })}
        />
        <BiField
          label="Name placeholder"
          en={comments.namePlaceholder_en ?? ""}
          ar={comments.namePlaceholder_ar ?? ""}
          onEn={(v) => setSection("comments", { namePlaceholder_en: v })}
          onAr={(v) => setSection("comments", { namePlaceholder_ar: v })}
        />
        <BiField
          label="Message field label"
          en={comments.messageLabel_en ?? ""}
          ar={comments.messageLabel_ar ?? ""}
          onEn={(v) => setSection("comments", { messageLabel_en: v })}
          onAr={(v) => setSection("comments", { messageLabel_ar: v })}
        />
        <BiField
          label="Message placeholder"
          en={comments.messagePlaceholder_en ?? ""}
          ar={comments.messagePlaceholder_ar ?? ""}
          onEn={(v) => setSection("comments", { messagePlaceholder_en: v })}
          onAr={(v) => setSection("comments", { messagePlaceholder_ar: v })}
        />
        <BiField
          label="Post button label"
          en={comments.postLabel_en ?? ""}
          ar={comments.postLabel_ar ?? ""}
          onEn={(v) => setSection("comments", { postLabel_en: v })}
          onAr={(v) => setSection("comments", { postLabel_ar: v })}
        />
        <BiField
          label="Empty state message"
          en={comments.emptyState_en ?? ""}
          ar={comments.emptyState_ar ?? ""}
          onEn={(v) => setSection("comments", { emptyState_en: v })}
          onAr={(v) => setSection("comments", { emptyState_ar: v })}
        />
        <BiField
          label="Submission toast title"
          en={comments.pendingNote_en ?? ""}
          ar={comments.pendingNote_ar ?? ""}
          onEn={(v) => setSection("comments", { pendingNote_en: v })}
          onAr={(v) => setSection("comments", { pendingNote_ar: v })}
        />
        <BiField
          label="Submission toast description"
          en={comments.pendingDesc_en ?? ""}
          ar={comments.pendingDesc_ar ?? ""}
          onEn={(v) => setSection("comments", { pendingDesc_en: v })}
          onAr={(v) => setSection("comments", { pendingDesc_ar: v })}
        />
      </div>
    </div>
  );
}
