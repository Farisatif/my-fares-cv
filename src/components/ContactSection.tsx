import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { Mail, MessageCircle, Github, Linkedin, MapPin } from "lucide-react";
import { useSiteData } from "./SiteDataProvider";
import { useLang } from "./LanguageProvider";


import { PageEndCircle } from "./PageEndCircle";
import { SettingsDrawer } from "./cms/SettingsDrawer";

export function ContactSection() {
  const { data } = useSiteData();
  const { lang, t } = useLang();
  const p = data.personal;
  const loc = lang === "ar" ? p.ar : p.en;
  return (
    <section id="contact" className="pt-20 sm:pt-32 pb-4 sm:pb-6 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl animate-blob"
        style={{ background: "color-mix(in oklab, var(--primary) 70%, transparent)" }} />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full opacity-25 blur-3xl animate-blob"
        style={{ background: "color-mix(in oklab, var(--primary-glow) 60%, transparent)", animationDelay: "5s" }} />

      {/* Section-top illuminating disc — descends behind the heading */}
      <PageEndCircle />

      <div className="container mx-auto px-6 max-w-5xl relative text-center">
        <Reveal>
          <p className="relative z-10 text-[11px] sm:text-xs uppercase tracking-[0.32em] opacity-55 mb-6">
            / 06 — {t(
              data.content?.contact?.eyebrow_en ?? "Let's talk",
              data.content?.contact?.eyebrow_ar ?? "لنتحدث",
            )}
          </p>
          <h2 className="relative z-10 font-display h-display-xl pb-2 tracking-[-0.045em]">
            {t(
              data.content?.contact?.titlePrefix_en ?? "Got an idea?",
              data.content?.contact?.titlePrefix_ar ?? "لديك فكرة؟",
            )}
            <br />
            <span className="italic gradient-text-sky inline-block pb-1">
              {t(
                data.content?.contact?.titleAccent_en ?? "Let's build it.",
                data.content?.contact?.titleAccent_ar ?? "لنبنها معاً.",
              )}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-10 text-lg opacity-75 max-w-xl mx-auto">
            {t(
              data.content?.contact?.description_en ??
                "Open to freelance projects, collaborations, and full-time roles. I usually reply within a day.",
              data.content?.contact?.description_ar ??
                "متاح لمشاريع العمل الحر والتعاون والوظائف بدوام كامل. عادةً ما أرد خلال يوم.",
            )}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap justify-center gap-3 relative z-10">
            <MagneticButton href={`mailto:${p.email}`}>
              <Mail className="h-4 w-4" /> {p.email}
            </MagneticButton>
            <MagneticButton
              href={`https://wa.me/${p.whatsapp}`}
              variant="ghost"
            >
              <MessageCircle className="h-4 w-4" /> {t(
                data.content?.contact?.whatsappLabel_en ?? "WhatsApp",
                data.content?.contact?.whatsappLabel_ar ?? "واتساب",
              )}
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 text-sm opacity-70">
            <a
              href={`https://${p.github}`}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring inline-flex items-center gap-2 px-2 py-1 rounded-full hover:opacity-100 transition-opacity"
            >
              <Github className="h-4 w-4" /> {p.github}
            </a>
            <a
              href={`https://${p.linkedin}`}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring inline-flex items-center gap-2 px-2 py-1 rounded-full hover:opacity-100 transition-opacity"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <span className="inline-flex items-center gap-2 px-2 py-1">
              <MapPin className="h-4 w-4" /> {loc.location}
            </span>
          </div>
        </Reveal>
      </div>

      <div className="container mx-auto px-6 max-w-7xl mt-16 sm:mt-20 relative">
        <div
          className="rounded-2xl border backdrop-blur-md px-5 sm:px-6 py-4 flex flex-wrap gap-3 sm:gap-4 justify-between items-center text-xs"
          style={{
            borderColor: "color-mix(in oklab, currentColor 14%, transparent)",
            background: "color-mix(in oklab, var(--surface-1) 60%, transparent)",
            boxShadow:
              "inset 0 1px 0 0 color-mix(in oklab, var(--foreground) 5%, transparent), 0 12px 30px -18px color-mix(in oklab, var(--primary) 28%, transparent)",
          }}
        >
          <span className="inline-flex items-center gap-2 font-medium tracking-tight">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }}
            />
            © {new Date().getFullYear()} {p.name}
          </span>
          <span className="text-foreground/65 tracking-wide">
            {t("Built with care · Sana'a, YE", "صُنع بعناية · صنعاء، اليمن")}
          </span>
          <SettingsDrawer />
        </div>
      </div>
    </section>
  );
}
