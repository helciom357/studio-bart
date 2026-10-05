import { LOGO_H, LOGO_RULE, LOGO_TAG, LOGO_W, LOGO_WORD } from "./logo-paths";

export function Logo({ className, tagline = true }: { className?: string; tagline?: boolean }) {
  const h = tagline ? LOGO_H : 735;
  return (
    <svg
      viewBox={`0 0 ${LOGO_W} ${h}`}
      className={className}
      fill="currentColor"
      fillRule="evenodd"
      role="img"
      aria-label="Studio Bartô"
    >
      <path d={LOGO_RULE} />
      <path d={LOGO_WORD} />
      {tagline && <path d={LOGO_TAG} />}
    </svg>
  );
}
