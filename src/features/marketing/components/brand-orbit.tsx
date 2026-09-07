"use client";

/**
 * The brand lockup, assembling and dispersing on a loop.
 *
 * Four phases: the letters of the name orbit the mark; they travel in and settle
 * into the wordmark, so the mark and the name read as one lockup; the lockup
 * holds; the letters leave again. Then it repeats.
 *
 * ## Why the letters are laid out by the browser, not by this file
 *
 * The obvious implementation gives every letter an absolute position and
 * computes both ends of the journey in script. That means hard-coding a kerning
 * table — and getting it wrong the moment the font, the weight or the viewport
 * changes, because the "assembled" state would be a row of letters at invented
 * offsets rather than actual text.
 *
 * Instead the wordmark is real inline text in normal flow, and *that* is the
 * rest state: at the end of the assemble phase every letter's transform is
 * `none`, so the lockup is exactly what the browser would have typeset anyway.
 * Only the orbit is computed. Each letter's natural centre is measured once
 * (and again on resize, and once more after webfonts settle) and cached, so the
 * frame loop interpolates between two known points and never reads layout.
 *
 * ## Cost
 *
 * Sixteen elements get a `transform` and an `opacity` written per frame.
 * Neither property triggers layout or paint — they are composited — and the
 * loop is suspended whenever the footer is scrolled out of view or the tab is
 * hidden, which for a footer graphic is most of the session.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";

import { siteConfig } from "@/lib/config/site";

/**
 * Phase durations. The brief: orbit for 2-3s, hold the lockup for 3-4s.
 *
 * The cycle *starts* on the held lockup rather than on the orbit. Without
 * transforms — before the loop's first frame, and with JavaScript off — the
 * letters sit where the browser typeset them, which is the assembled lockup.
 * Beginning anywhere else means the first frame snaps them somewhere new;
 * beginning here means frame one is identical to the state already on screen
 * and the first thing that happens is the letters flying out.
 */
const LOCKED_MS = 3600;
const SCATTER_MS = 950;
const ORBIT_MS = 2800;
const ASSEMBLE_MS = 1050;
const CYCLE_MS = LOCKED_MS + SCATTER_MS + ORBIT_MS + ASSEMBLE_MS;

/** Radians per second the ring turns. Slow enough to read the name. */
const SPIN = 0.3;

/**
 * Fraction of the transition each letter is offset by.
 *
 * Without this every letter arrives at once, which reads as the whole word
 * being slid into place rather than as letters finding their positions. With
 * twelve letters at 0.04 the last one starts at 44% and still has 56% of the
 * phase to travel, so nothing looks rushed.
 */
const STAGGER = 0.04;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Settle with a small overshoot — the letters arrive, they do not glide in. */
function easeOutBack(x: number): number {
  const c = 1.32;
  const p = x - 1;
  return 1 + (c + 1) * p * p * p + c * p * p;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function BrandOrbit({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const ringsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const mark = markRef.current;
    const word = wordRef.current;
    const rings = ringsRef.current;
    if (!root || !mark || !word || !rings) return;

    const letters = [...word.querySelectorAll<HTMLElement>("[data-letter]")];
    if (letters.length === 0) return;
    const n = letters.length;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** Natural centre of each letter, relative to the container's centre. */
    const base = letters.map(() => ({ x: 0, y: 0 }));
    const markBase = { x: 0, y: 0 };
    /** Radius of the letter ring, in pixels. */
    let radius = 0;

    const measure = () => {
      // Transforms must come off before reading, or every measurement would be
      // of the animated position rather than the typeset one.
      for (const el of letters) el.style.transform = "";
      mark.style.transform = "";

      const box = root.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      radius = (Math.min(box.width, box.height) / 2) * 0.72;

      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        base[i].x = r.left + r.width / 2 - cx;
        base[i].y = r.top + r.height / 2 - cy;
      });

      const mr = mark.getBoundingClientRect();
      markBase.x = mr.left + mr.width / 2 - cx;
      markBase.y = mr.top + mr.height / 2 - cy;
    };

    measure();

    // Webfonts swap after first paint and change every letter's width, so the
    // cached geometry is refreshed once they have settled.
    document.fonts?.ready.then(measure).catch(() => {});

    const ro = new ResizeObserver(measure);
    ro.observe(root);

    /* ---------------------------------------------------------------- loop */

    /**
     * Where letter `i` sits on the ring at angle `spin`.
     *
     * The ring is squashed vertically and the near half is drawn larger and
     * more opaque, so it reads as a ring seen at an angle rather than as a flat
     * circle of text.
     */
    const orbit = (i: number, spin: number) => {
      const theta = spin + (i / n) * Math.PI * 2;
      const r = radius * (1 + 0.055 * Math.sin(i * 1.7 + spin * 0.8));
      const depth = 0.5 + 0.5 * Math.sin(theta);
      return {
        x: Math.cos(theta) * r,
        y: Math.sin(theta) * r * 0.82,
        scale: 0.72 + 0.34 * depth,
        alpha: 0.42 + 0.58 * depth,
        rotate: Math.sin(theta) * 6,
      };
    };

    /** Per-letter progress through a transition, staggered along the word. */
    const letterProgress = (p: number, i: number, reverse: boolean) => {
      const idx = reverse ? n - 1 - i : i;
      const span = 1 - STAGGER * (n - 1);
      return clamp01((p - STAGGER * idx) / span);
    };

    const render = (elapsed: number) => {
      const spin = (elapsed / 1000) * SPIN;
      const c = elapsed % CYCLE_MS;

      // `settled` is 0 while orbiting and 1 while locked; `assembling` says
      // which easing and which stagger direction the transition uses.
      const scatterEnd = LOCKED_MS + SCATTER_MS;
      const orbitEnd = scatterEnd + ORBIT_MS;

      let settled = 1;
      let assembling = false;
      let p = 0;
      const locked = c < LOCKED_MS;

      if (locked) {
        settled = 1;
        p = 1;
        assembling = true;
      } else if (c < scatterEnd) {
        assembling = false;
        p = (c - LOCKED_MS) / SCATTER_MS;
        settled = 1 - p;
      } else if (c < orbitEnd) {
        assembling = false;
        settled = 0;
        p = 1;
      } else {
        assembling = true;
        p = (c - orbitEnd) / ASSEMBLE_MS;
        settled = p;
      }

      letters.forEach((el, i) => {
        // Fully assembled: clear the transform outright so the wordmark is the
        // browser's own typesetting, not a transform that rounds to near-zero.
        if (locked) {
          el.style.transform = "";
          el.style.opacity = "1";
          return;
        }

        const lp = letterProgress(p, i, !assembling);
        const e = assembling ? easeOutBack(lp) : 1 - easeInOutCubic(lp);
        const away = 1 - e;

        const o = orbit(i, spin);
        const x = (o.x - base[i].x) * away;
        const y = (o.y - base[i].y) * away;
        const scale = o.scale + (1 - o.scale) * e;
        const rotate = o.rotate * away;

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = (o.alpha + (1 - o.alpha) * e).toFixed(3);
      });

      // The mark holds the centre while the letters are out, and slides to its
      // place in the lockup as they arrive.
      const me = assembling ? easeInOutCubic(clamp01(p * 1.15)) : 1 - easeInOutCubic(clamp01(p * 1.15));
      const mAway = 1 - me;
      const mScale = 1.34 - 0.34 * me;
      mark.style.transform = `translate3d(${(-markBase.x * mAway).toFixed(2)}px, ${(-markBase.y * mAway).toFixed(2)}px, 0) scale(${mScale.toFixed(3)})`;

      rings.style.opacity = (0.85 * (1 - settled)).toFixed(3);
      rings.style.transform = `rotate(${((elapsed / 1000) * 6).toFixed(2)}deg)`;
    };

    /** The reduced-motion rendering: the lockup, already formed. */
    if (reduce) {
      for (const el of letters) {
        el.style.transform = "";
        el.style.opacity = "1";
      }
      mark.style.transform = "";
      rings.style.opacity = "0";
      return () => ro.disconnect();
    }

    let raf = 0;
    let running = false;
    let visible = false;

    /**
     * The cycle's own clock, advanced only while the loop is actually running.
     *
     * Using wall-clock time instead would mean the phase kept moving while the
     * footer was off-screen or the tab was hidden, so scrolling back to it
     * resumed at an arbitrary point in the cycle — visibly jumping. The delta is
     * capped so the first frame after a long pause advances one frame's worth
     * rather than the whole interval.
     */
    let elapsed = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = running ? requestAnimationFrame(frame) : 0;
      if (last !== 0) elapsed += Math.min(now - last, 64);
      last = now;
      render(elapsed);
    };

    const play = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // A footer graphic is off-screen for most of a visit; there is no reason to
    // animate it then.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) play();
        else pause();
      },
      { threshold: 0.05 },
    );
    io.observe(root);

    const onVisibility = () => {
      if (document.hidden) pause();
      else if (visible) play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const name = siteConfig.name;

  return (
    <div ref={rootRef} className={`brand-orbit ${className}`}>
      {/* Decorative only. The name is announced once, below, rather than as
          twelve separate letters. */}
      <span ref={ringsRef} aria-hidden="true" className="brand-orbit__rings">
        <span className="brand-orbit__ring brand-orbit__ring--inner" />
        <span className="brand-orbit__ring brand-orbit__ring--path" />
        <span className="brand-orbit__ring brand-orbit__ring--outer" />
      </span>

      <span aria-hidden="true" className="brand-orbit__lockup">
        <span ref={markRef} className="brand-orbit__mark">
          {/* Eager, unlike everything else this far down the page. The mark is
              the thing the letters orbit; if it arrives late the animation
              spends its first cycle circling an empty patch of card. It is a
              few kilobytes, and the footer's other copy of it comes from cache. */}
          <Image
            src="/brand/mark.png"
            alt=""
            width={144}
            height={144}
            sizes="72px"
            loading="eager"
            className="brand-orbit__mark-img"
          />
        </span>
        <span ref={wordRef} className="brand-orbit__word">
          {[...name].map((ch, i) => (
            <span key={`${ch}-${i}`} data-letter className="brand-orbit__letter">
              {ch}
            </span>
          ))}
        </span>
      </span>

      <span className="sr-only">{name}</span>
    </div>
  );
}
