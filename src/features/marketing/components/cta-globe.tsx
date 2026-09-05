/**
 * Small matte studio globe for the closing CTA — CSS-only, no WebGL.
 */

export function CtaGlobe({ className = "" }: { className?: string }) {
  return (
    <div
      className={`cta-globe ${className}`}
      aria-hidden="true"
    >
      <span className="cta-globe__glow" />
      <span className="cta-globe__sphere">
        <span className="cta-globe__sheen" />
        <span className="cta-globe__rim" />
      </span>
    </div>
  );
}
