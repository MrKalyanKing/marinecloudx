"use client";

/**
 * Two ribbons that swim behind the page and bracket whatever section you are
 * reading.
 *
 * One enters from the left and settles its head on the *top* edge of the
 * section currently in view; the other enters from the right and settles on the
 * *bottom* edge. Between those anchors each line undulates continuously, so
 * they read as swimming rather than as pointing. The hero is excluded — it has
 * its own artwork and a second moving thing there would fight it.
 *
 * ## Why this is a canvas and not DOM
 *
 * The obvious implementation is two absolutely-positioned SVG paths whose `d`
 * attribute is rewritten each frame. That is also the version that would make
 * the page stutter: every attribute write dirties style and layout for the
 * element, and this animates sixty times a second for the whole session.
 *
 * A canvas is a single composited layer. Drawing into it touches no styles, no
 * layout and no other element on the page — the cost is confined to the
 * canvas's own pixels and never reaches the document. This is the same reason
 * the scroll-linked custom property was removed from the background layers.
 *
 * ## The rules this loop follows
 *
 * - **No DOM writes in the frame loop.** Nothing here sets a style, a class or
 *   an attribute. The only per-frame reads are `window.scrollY` and cached
 *   numbers, never `getBoundingClientRect`, which would force layout.
 * - **Section geometry is cached.** Positions are measured once when an
 *   IntersectionObserver reports a change, and stored in document coordinates;
 *   converting to viewport coordinates each frame is one subtraction.
 * - **The loop stops when it cannot be seen** — tab hidden, or the canvas
 *   scrolled out of relevance. `prefers-reduced-motion` gets a single static
 *   frame and no loop at all.
 */

import { useEffect, useRef } from "react";

/**
 * Each ribbon is a two-stop ramp rather than one flat colour.
 *
 * A single RGB value drawn at varying alpha only ever gets *paler* toward the
 * tail, which on this near-white canvas means it dissolves into the background
 * well before the taper says it should. Ramping hue as well as alpha keeps the
 * tail readable — it reads as a colour shift into the page rather than as a
 * line that gave up — and gives the head somewhere deeper to land.
 *
 * The identity stays pink and green: both stops of a ramp are the same family,
 * so neither line is mistaken for a third colour where they cross.
 */
type Ramp = readonly string[];

/** Stops per ramp. Enough that no band shows along a 600px body. */
const RAMP_STEPS = 24;

/**
 * Precomputed at module scope, not per frame.
 *
 * The loop needs an `rgba()` string for every one of ~144 segments, and
 * interpolating three channels for each of them sixty times a second is real
 * arithmetic for a result that never changes. Only the alpha varies per frame,
 * so the `r, g, b` half is baked once and concatenated.
 */
function ramp(from: [number, number, number], to: [number, number, number]): Ramp {
  return Array.from({ length: RAMP_STEPS + 1 }, (_, i) => {
    const t = i / RAMP_STEPS;
    const c = (a: number, b: number) => Math.round(a + (b - a) * t);
    return `${c(from[0], to[0])}, ${c(from[1], to[1])}, ${c(from[2], to[2])}`;
  });
}

/** Pink: soft rose at the tail into a deep, text-safe magenta at the head. */
const PINK = ramp([255, 122, 186], [206, 24, 104]);
/**
 * Green: mint at the tail into a deep emerald head. Cool enough to sit beside
 * the violet background field without clashing with it.
 */
const GREEN = ramp([64, 214, 178], [4, 138, 112]);

/**
 * Widest point of the body. It tapers from here to nothing at the tail and to
 * a rounded tip at the head — a constant width reads as a border rather than
 * as something alive.
 */
const BODY_WIDTH = 8;

/** Points along the spine. Beyond this, more stops looking smoother. */
const STEPS = 72;

/**
 * Resting angle of each body, in radians, measured from the head backwards.
 *
 * Not 0 and not exactly pi: a dead-horizontal tail reads as a rule drawn across
 * the page. The small tilt is what gives each ribbon its arc.
 */
const LEFT_DIR = 0.16;
const RIGHT_DIR = Math.PI - 0.16;

interface Anchor {
  /** Where the head is now, in viewport pixels. */
  x: number;
  y: number;
  /** Where it is heading. */
  tx: number;
  ty: number;
}

export function AmbientTrails() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // Capped: this is a soft background graphic, and rasterising it at a
      // phone's full 3x costs nine times the pixels for no visible gain.
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* ------------------------------------------------ section tracking */

    /** Every section except the one containing the hero ribbon. */
    let sections: HTMLElement[] = [];

    /** Document-space geometry of the section currently in view. */
    let target: { top: number; bottom: number } | null = null;
    /** Eases to 1 when a section is engaged, to 0 over the hero. */
    let presence = 0;

    const ratios = new Map<Element, number>();

    /**
     * Document-space geometry, measured once per layout rather than per scroll.
     *
     * Scrolling does not move anything in document coordinates, so this only
     * needs recomputing when the page reflows — on mount and on resize. Reading
     * it inside the IntersectionObserver callback instead would force a layout
     * flush every time a section crossed a threshold, which is several times a
     * second while scrolling.
     */
    const geometry = new Map<Element, { top: number; bottom: number }>();

    const measure = () => {
      const scroll = window.scrollY;
      geometry.clear();
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        geometry.set(el, { top: r.top + scroll, bottom: r.bottom + scroll });
      }
    };

    const pick = () => {
      let best: Element | null = null;
      let bestRatio = 0;
      for (const [el, r] of ratios) {
        if (r > bestRatio) {
          bestRatio = r;
          best = el;
        }
      }
      target = !best || bestRatio < 0.08 ? null : (geometry.get(best) ?? null);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target, e.intersectionRatio);
        pick();
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    // Sections change height when the page reflows — images arriving, fonts
    // swapping, a breakpoint crossing — so the cached geometry is refreshed
    // when any of them resizes, not on a timer.
    const ro = new ResizeObserver(() => {
      measure();
      pick();
    });

    /**
     * (Re)binds the observers to whatever sections are on the page now.
     *
     * This is mounted by the public layout, and a layout is not remounted on
     * client navigation, so this effect runs exactly once for the whole visit.
     * Collecting the sections a single time therefore left both observers
     * watching elements React had already unmounted the moment the visitor
     * followed any link: nothing ever reported intersecting again, `presence`
     * eased to zero, and the ribbons stayed invisible for the rest of the
     * session.
     */
    const collect = () => {
      const next = [...document.querySelectorAll("main section")].filter(
        (el) => !el.querySelector(".hero-ribbon"),
      ) as HTMLElement[];

      if (next.length === sections.length && next.every((el, i) => el === sections[i])) return;

      io.disconnect();
      ro.disconnect();
      ratios.clear();
      sections = next;
      for (const s of sections) {
        io.observe(s);
        ro.observe(s);
      }
      measure();
      pick();
    };

    collect();

    // Route changes swap the contents of `main` without remounting it. Coalesced
    // to one pass per burst — React commits a subtree in many small mutations.
    let recollect = 0;
    const mo = new MutationObserver(() => {
      if (recollect) return;
      recollect = window.setTimeout(() => {
        recollect = 0;
        collect();
      }, 180);
    });
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });

    /* -------------------------------------------------- pointer tracking */

    // Starts centred so the lines have somewhere sensible to lean before the
    // pointer has ever moved, and on touch devices where it never will.
    let pointerX = width * 0.5;
    let pointerY = height * 0.5;
    let easedX = pointerX;
    let easedY = pointerY;

    const onPointer = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    };
    if (!coarse) window.addEventListener("pointermove", onPointer, { passive: true });

    /* ------------------------------------------------------------ curves */

    // Both heads live inside the frame. The first version had them entering
    // from beyond the left and right edges, which is what made them read as two
    // stray lines crossing the page rather than as creatures swimming in it.
    const left: Anchor = { x: width * 0.26, y: height * 0.42, tx: width * 0.26, ty: height * 0.42 };
    const right: Anchor = { x: width * 0.74, y: height * 0.58, tx: width * 0.74, ty: height * 0.58 };

    const points: { x: number; y: number }[] = Array.from({ length: STEPS + 1 }, () => ({
      x: 0,
      y: 0,
    }));

    /**
     * Builds one ribbon's spine into `points`.
     *
     * The head is the anchor; the body trails behind it along a direction that
     * curls with time, so the whole creature stays inside the frame instead of
     * running off the edges.
     *
     * `t` runs 0 at the tail to 1 at the head. The undulation is enveloped by
     * `sin(pi * t)`, which is what lets the head land exactly on its anchor
     * while the middle of the body wanders.
     */
    const build = (
      headX: number,
      headY: number,
      dir: number,
      length: number,
      phase: number,
      amp: number,
      freq: number,
      bend: number,
    ) => {
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        const back = 1 - t;

        // Each segment further from the head is rotated a little more, so the
        // spine follows an arc rather than a straight line.
        const curl = dir + Math.sin(phase * 0.6 + back * 1.7) * 0.55;
        let x = headX - Math.cos(curl) * length * back;
        let y = headY - Math.sin(curl) * length * back * 0.55;

        const env = Math.sin(Math.PI * t);
        y +=
          (Math.sin(back * freq + phase) * amp +
            Math.sin(back * freq * 2.31 - phase * 0.73) * amp * 0.34) *
          env;
        x += Math.cos(back * freq * 0.79 + phase * 0.5) * amp * 0.4 * env;

        // Leans toward the pointer, falling off with distance.
        const dx = (x - easedX) / 300;
        const dy = (y - easedY) / 300;
        const pull = Math.exp(-(dx * dx + dy * dy)) * bend;
        y += (easedY - y) * pull;
        x += (easedX - x) * pull * 0.45;

        points[i].x = x;
        points[i].y = y;
      }

      // One relaxation pass over the interior.
      //
      // The pointer term above is a Gaussian, so where the cursor sits close to
      // the spine it displaces neighbouring samples by different amounts and
      // leaves a visible kink at the shoulder of the bulge. Averaging each point
      // with its neighbours removes that without flattening the arc; the ends
      // are held fixed, so the head still lands exactly on its anchor.
      for (let i = 1; i < STEPS; i++) {
        points[i].x = (points[i - 1].x + points[i].x * 2 + points[i + 1].x) / 4;
        points[i].y = (points[i - 1].y + points[i].y * 2 + points[i + 1].y) / 4;
      }
    };

    /** Lays the smoothed spine down as a path, ready to stroke at any width. */
    const trace = () => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const mx = (points[i].x + points[i + 1].x) / 2;
        const my = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    };

    /**
     * Strokes the spine as a tapered, glowing body.
     *
     * Canvas has no variable-width stroke, so the body is drawn as a run of
     * short overlapping segments whose width follows a taper curve — a hair at
     * the tail, thickening into a rounded tip at the head. Round caps hide the
     * joins.
     *
     * The taper used to be `sin(pi * min(1, t * 1.15))`, which is exactly zero
     * across the last thirteen per cent of the body: the ribbon stopped short
     * and left a gap between itself and its own head. It now rises all the way
     * into the head, so body and head read as one object.
     */
    const stroke = (colors: Ramp, alpha: number) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const head = points[points.length - 1];
      const headRgb = colors[RAMP_STEPS];

      // Halo: two soft passes over one path, far cheaper than shadowBlur, and
      // the reason the line still reads over the busy background field.
      trace();
      ctx.strokeStyle = `rgba(${colors[Math.round(RAMP_STEPS * 0.7)]}, ${alpha * 0.05})`;
      ctx.lineWidth = BODY_WIDTH * 6.5;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${colors[Math.round(RAMP_STEPS * 0.8)]}, ${alpha * 0.1})`;
      ctx.lineWidth = BODY_WIDTH * 3.2;
      ctx.stroke();

      // The tapered body, deepening in colour and weight toward the head.
      for (let i = 0; i < points.length - 1; i++) {
        const t = i / (points.length - 1);
        const taper = Math.sqrt(t) * (1 - 0.22 * t * t);
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
        ctx.strokeStyle = `rgba(${colors[Math.round(t * RAMP_STEPS)]}, ${alpha * (0.26 + 0.62 * t)})`;
        ctx.lineWidth = Math.max(0.5, BODY_WIDTH * taper);
        ctx.stroke();
      }

      // The head: a bright core inside a corona that fades to nothing, so the
      // glow has no visible rim where a flat translucent disc would show one.
      const corona = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, BODY_WIDTH * 3.4);
      corona.addColorStop(0, `rgba(${headRgb}, ${alpha * 0.42})`);
      corona.addColorStop(0.45, `rgba(${headRgb}, ${alpha * 0.14})`);
      corona.addColorStop(1, `rgba(${headRgb}, 0)`);
      ctx.beginPath();
      ctx.arc(head.x, head.y, BODY_WIDTH * 3.4, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(head.x, head.y, BODY_WIDTH * 0.62, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${headRgb}, ${alpha * 0.92})`;
      ctx.fill();
    };

    /**
     * How far the body trails behind its head.
     *
     * Sized so the tail runs out just past the viewport edge. Because the taper
     * is zero there, the line fades to nothing rather than being cut off by the
     * edge — which is what made the earlier version read as a stray rule.
     */
    const bodyLength = () => Math.min(width * 0.34, 560);

    /* -------------------------------------------------------------- loop */

    let raf = 0;
    let running = false;
    const start = performance.now();

    const frame = (now: number) => {
      raf = running ? requestAnimationFrame(frame) : 0;

      const time = (now - start) / 1000;
      const scroll = window.scrollY;

      // Pointer easing — the lean lags the cursor slightly, which is what makes
      // it feel like water rather than a rubber band.
      easedX += (pointerX - easedX) * 0.045;
      easedY += (pointerY - easedY) * 0.045;

      if (target) {
        presence += (1 - presence) * 0.04;

        // The heads mark the section's start and end, inset slightly so they
        // sit just inside the band rather than exactly on the boundary, then
        // clamped to a comfortable strip of the viewport.
        //
        // Clamping matters: a tall section's top edge is often scrolled off
        // the screen or hidden behind the fixed header, and an anchor there
        // would park the head out of sight — losing the one cue that says the
        // lines are tracking anything.
        const inset = Math.min(90, (target.bottom - target.top) * 0.08);
        const top = target.top - scroll + inset;
        const bottom = target.bottom - scroll - inset;
        const lo = height * 0.16;
        const hi = height * 0.84;

        left.tx = width * 0.26;
        left.ty = Math.max(lo, Math.min(hi, top));
        right.tx = width * 0.74;
        right.ty = Math.max(lo, Math.min(hi, bottom));
      } else {
        // Over the hero, or between sections: retreat and idle. A page whose
        // `main` holds no sections at all keeps them swimming at reduced
        // strength rather than blanking the background entirely.
        presence += ((sections.length === 0 ? 0.6 : 0) - presence) * 0.05;
        left.tx = width * 0.26;
        left.ty = height * 0.4;
        right.tx = width * 0.74;
        right.ty = height * 0.62;
      }

      // Heads glide to their anchors rather than jumping when the section
      // changes. This is the whole feel of the thing.
      left.x += (left.tx - left.x) * 0.045;
      left.y += (left.ty - left.y) * 0.045;
      right.x += (right.tx - right.x) * 0.045;
      right.y += (right.ty - right.y) * 0.045;

      ctx.clearRect(0, 0, width, height);
      if (presence > 0.01) {
        const amp = height * 0.055;
        const length = bodyLength();

        // A slow wander on the resting angle, so the two arcs never settle into
        // the same shape twice.
        build(
          left.x,
          left.y,
          LEFT_DIR + Math.sin(time * 0.21) * 0.13,
          length,
          time * 0.75,
          amp,
          5.1,
          0.3,
        );
        stroke(PINK, presence);

        build(
          right.x,
          right.y,
          RIGHT_DIR + Math.sin(time * 0.17 + 1.3) * 0.13,
          length,
          time * 0.62 + 2.1,
          amp,
          4.4,
          0.26,
        );
        stroke(GREEN, presence);
      }
    };

    const play = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    /** The reduced-motion rendering: the composition without the movement. */
    const drawStatic = () => {
      presence = 1;
      ctx.clearRect(0, 0, width, height);
      const amp = height * 0.045;
      const length = bodyLength();
      build(width * 0.26, height * 0.4, LEFT_DIR, length, 0, amp, 5.1, 0);
      stroke(PINK, 0.8);
      build(width * 0.74, height * 0.62, RIGHT_DIR, length, 2.1, amp, 4.4, 0);
      stroke(GREEN, 0.8);
    };

    const onResize = () => {
      resize();
      measure();
      pick();
      if (reduce) drawStatic();
    };
    window.addEventListener("resize", onResize, { passive: true });

    if (reduce) {
      // One frame, no loop: the shapes are part of the composition, the motion
      // is what was opted out of.
      drawStatic();
    } else {
      play();
    }

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      if (recollect) clearTimeout(recollect);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      if (!coarse) window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
