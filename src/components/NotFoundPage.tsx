import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageProvider";

export function NotFoundPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const t = isAr
    ? {
        code: "404",
        title: "الصفحة غير موجودة",
        body: "يبدو أن الرابط الذي تبحث عنه غير صحيح أو تمّت إزالته. لا بأس، إليك بعض الوجهات المفيدة:",
        home: "العودة للرئيسية",
        explore: "استكشف المشاريع",
        comments: "كتاب الزوار",
        hint: "تلميح: اضغط",
        kbd: "Ctrl + K",
        toSearch: "للبحث السريع.",
      }
    : {
        code: "404",
        title: "Page not found",
        body: "The link you followed seems broken or the page has moved. No worries — here are some useful destinations:",
        home: "Back to home",
        explore: "Explore projects",
        comments: "Guestbook",
        hint: "Tip: press",
        kbd: "Ctrl + K",
        toSearch: "for quick search.",
      };

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-24"
    >
      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.6), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.55), transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="select-none bg-gradient-to-br from-foreground via-foreground/70 to-foreground/30 bg-clip-text font-bold leading-none text-transparent"
          style={{ fontSize: "clamp(7rem, 22vw, 14rem)" }}
        >
          {t.code}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {t.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mx-auto mt-4 max-w-md text-sm text-muted-foreground sm:text-base"
        >
          {t.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            {t.home}
          </Link>
          <Link
            to="/explore"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background/60 px-6 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-foreground/5"
          >
            {t.explore}
          </Link>
          <Link
            to="/comments"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background/60 px-6 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-foreground/5"
          >
            {t.comments}
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-xs text-muted-foreground"
        >
          {t.hint}{" "}
          <kbd className="mx-1 rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
            {t.kbd}
          </kbd>{" "}
          {t.toSearch}
        </motion.p>
      </div>
    </div>
  );
}
