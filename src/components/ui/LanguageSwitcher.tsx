"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { FlagGB, FlagEE } from "@/components/ui/Flags";

const LANGUAGES: { code: Locale; label: string; Flag: typeof FlagGB }[] = [
  { code: "en", label: "English", Flag: FlagGB },
  { code: "et", label: "Eesti", Flag: FlagEE },
];

type Props = {
  /** `dropdown` is the floating popover for the desktop nav; `inline` renders
   *  both options as plain pill buttons, for the already-expanded mobile menu
   *  where a nested popover would be awkward to reach and easy to mis-tap. */
  variant?: "dropdown" | "inline";
  className?: string;
};

export default function LanguageSwitcher({ variant = "dropdown", className = "" }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  useEffect(() => {
    if (variant !== "dropdown" || !open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [variant, open]);

  function switchTo(code: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: code });
  }

  if (variant === "inline") {
    return (
      <div className={`bb-lang-inline ${className}`}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`bb-lang-inline__item ${lang.code === locale ? "bb-lang-inline__item--active" : ""}`}
            onClick={() => switchTo(lang.code)}
          >
            <lang.Flag className="bb-flag" />
            <span>{lang.label}</span>
            {lang.code === locale && <Check className="bb-lang-inline__check" size={14} />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`bb-lang ${className}`} ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("switchLanguage")}
        className="bb-lang__trigger"
      >
        <current.Flag className="bb-flag" />
        <span className="bb-lang__trigger-label">{current.label}</span>
        <ChevronDown className={`bb-lang__chevron ${open ? "bb-lang__chevron--open" : ""}`} size={14} />
      </button>

      {open && (
        <div role="listbox" aria-label={t("switchLanguage")} className="bb-lang__menu">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={lang.code === locale}
              className={`bb-lang__option ${lang.code === locale ? "bb-lang__option--active" : ""}`}
              onClick={() => switchTo(lang.code)}
            >
              <lang.Flag className="bb-flag" />
              <span className="bb-lang__option-label">{lang.label}</span>
              {lang.code === locale && <Check className="bb-lang__check" size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
