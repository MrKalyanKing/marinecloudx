"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CandidateInfo {
  name: string;
  email: string;
  applicationCode: string;
}

interface JobInfo {
  title: string;
  department?: string | null;
  location?: string | null;
}

interface RoundInfo {
  title: string;
  durationMinutes: number;
}

interface BookingDetails {
  id: string;
  date: string;
  time: string;
  timezone: string;
  meetingLink?: string | null;
  googleCalendarUrl?: string;
  icsContent?: string;
}

export interface ScheduleDetailsPayload {
  alreadyBooked: boolean;
  booking?: BookingDetails | null;
  candidate: CandidateInfo;
  job: JobInfo;
  round: RoundInfo;
  availableDates: string[];
  timezone: string;
}

interface TimeSlot {
  id: string;
  startAt: string;
  endAt: string;
  timezone: string;
  formattedTime: string;
  formattedEndTime: string;
}

interface CandidateSchedulerProps {
  token: string;
  initialData: ScheduleDetailsPayload;
}

export function CandidateScheduler({ token, initialData }: CandidateSchedulerProps) {
  const initialPayload: ScheduleDetailsPayload =
    (initialData as any)?.data ?? initialData;

  const [data, setData] = useState<ScheduleDetailsPayload>(initialPayload);

  const availableDates = Array.isArray(data?.availableDates) ? data.availableDates : [];

  // Parse initial month from first available date or today
  const firstAvailable = availableDates[0];
  const initialDateObj = firstAvailable ? new Date(`${firstAvailable}T12:00:00Z`) : new Date();

  const [currentYear, setCurrentYear] = useState(initialDateObj.getUTCFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDateObj.getUTCMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState<string | null>(firstAvailable || null);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    date: string;
    time: string;
    timezone: string;
    applicationCode: string;
    googleCalendarUrl?: string;
    icsContent?: string;
    meetingLink?: string | null;
  } | null>(null);
  const [copiedMeetingLink, setCopiedMeetingLink] = useState(false);

  function handleDownloadIcs(icsData?: string, filename = "interview.ics") {
    if (icsData) {
      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      window.open(
        `/api/public/careers/interview-scheduling/${encodeURIComponent(token)}/calendar.ics`,
        "_blank",
      );
    }
  }

  function handleCopyMeetingLink(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedMeetingLink(true);
    setTimeout(() => setCopiedMeetingLink(false), 2500);
  }

  // Mobile step navigation: 1: Date, 2: Time, 3: Confirm
  const [mobileStep, setMobileStep] = useState<"date" | "time" | "confirm">("date");

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    let isMounted = true;
    async function fetchSlots() {
      setIsLoadingSlots(true);
      setBookingError(null);
      setSelectedSlot(null);

      try {
        const res = await fetch(
          `/api/public/careers/interview-scheduling/${encodeURIComponent(token)}/available-slots?date=${encodeURIComponent(selectedDate!)}`,
        );
        const json = await res.json().catch(() => null);

        if (isMounted) {
          const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
          setSlots(list);
        }
      } catch {
        if (isMounted) setSlots([]);
      } finally {
        if (isMounted) setIsLoadingSlots(false);
      }
    }

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, token]);

  // Calendar calculations
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(Date.UTC(currentYear, currentMonth, 1)),
  );

  const daysInMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0)).getUTCDate();
  const firstDayOfWeek = new Date(Date.UTC(currentYear, currentMonth, 1)).getUTCDay(); // 0 is Sunday
  // Convert Sunday (0) to 6, Monday (1) to 0, etc. for Mon-Sun grid
  const leadingBlankDays = (firstDayOfWeek + 6) % 7;

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  async function handleConfirmBooking() {
    if (!selectedSlot || isBooking) return;
    setIsBooking(true);
    setBookingError(null);

    try {
      const res = await fetch(
        `/api/public/careers/interview-scheduling/${encodeURIComponent(token)}/book`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slotId: selectedSlot.id,
            notes: notes.trim() || undefined,
            timezone: data.timezone || "Asia/Kolkata",
          }),
        },
      );

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 409) {
          setBookingError(
            "This time slot was just booked by another candidate. Please select another available time.",
          );
          // Refresh slots for this date
          setSelectedSlot(null);
          const refreshRes = await fetch(
            `/api/public/careers/interview-scheduling/${encodeURIComponent(token)}/available-slots?date=${encodeURIComponent(selectedDate!)}`,
          );
          const refreshJson = await refreshRes.json().catch(() => []);
          const refreshList = Array.isArray(refreshJson?.data)
            ? refreshJson.data
            : Array.isArray(refreshJson)
            ? refreshJson
            : [];
          setSlots(refreshList);
        } else {
          setBookingError(
            json?.error?.message ||
              json?.message ||
              "Could not schedule the interview at this time. Please try again.",
          );
        }
        return;
      }

      const bookingResult = json?.data ?? json;

      // Success
      setConfirmedBooking({
        date: bookingResult.formattedDate || selectedDate || "",
        time: bookingResult.formattedTime || `${selectedSlot.formattedTime} – ${selectedSlot.formattedEndTime}`,
        timezone: bookingResult.timezone || data?.timezone || "Asia/Kolkata",
        applicationCode: bookingResult.applicationCode || data?.candidate?.applicationCode || "",
        googleCalendarUrl: bookingResult.googleCalendarUrl,
        icsContent: bookingResult.icsContent,
        meetingLink: bookingResult.meetingLink || data?.booking?.meetingLink || null,
      });
    } catch {
      setBookingError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsBooking(false);
    }
  }

  // If already booked prior to opening the link
  if (data?.alreadyBooked && data?.booking) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-hairline-light bg-white p-6 shadow-xl sm:p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl text-teal-700">
          ✓
        </div>
        <p className="tech-label text-ink-muted">Scheduled</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Interview Already Scheduled
        </h2>
        <p className="mt-3 text-sm text-ink-muted">
          Your interview with MarineCloudX has already been confirmed.
        </p>

        <div className="mt-6 rounded-2xl border border-hairline-light bg-ink/[0.02] p-5 text-left space-y-3">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Position
            </span>
            <p className="text-sm font-semibold text-ink">{data?.job?.title || "Role"}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Round
            </span>
            <p className="text-sm font-semibold text-ink">{data?.round?.title || "Interview"}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Date &amp; Time
            </span>
            <p className="text-sm font-semibold text-teal-800">
              {data.booking.date} &bull; {data.booking.time}
            </p>
            <p className="text-xs text-ink-muted">{data.booking.timezone}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Application ID
            </span>
            <p className="font-mono text-sm text-ink">{data?.candidate?.applicationCode}</p>
          </div>
          {data.booking.meetingLink ? (
            <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
                Google Meet Video Call
              </span>
              <a
                href={data.booking.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm font-semibold text-teal-700 hover:underline break-all"
              >
                {data.booking.meetingLink}
              </a>
            </div>
          ) : null}
        </div>

        {/* Calendar & Meeting Integration Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {data.booking.meetingLink ? (
            <a
              href={data.booking.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-900"
            >
              <span>🎥</span> Join Google Meet
            </a>
          ) : null}

          {data.booking.meetingLink ? (
            <button
              type="button"
              onClick={() => handleCopyMeetingLink(data.booking!.meetingLink!)}
              className="inline-flex items-center gap-2 rounded-xl border border-hairline-light bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-sm transition hover:bg-ink/[0.03]"
            >
              {copiedMeetingLink ? "✓ Link Copied" : "Copy Meet Link"}
            </button>
          ) : null}
          {data.booking.googleCalendarUrl ? (
            <a
              href={data.booking.googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-900"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Add to Google Calendar
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => handleDownloadIcs(data.booking?.icsContent)}
            className="inline-flex items-center gap-2 rounded-xl border border-hairline-light bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-sm transition hover:bg-ink/[0.03]"
          >
            <svg className="h-4 w-4 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Calendar (.ics)
          </button>

        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/careers"
            className="inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
          >
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  // Successfully confirmed during this session
  if (confirmedBooking) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-hairline-light bg-white p-6 shadow-2xl sm:p-10 text-center animate-in fade-in duration-300">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600 shadow-inner">
          ✓
        </div>
        <p className="tech-label text-emerald-800">Confirmed</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Interview Scheduled
        </h2>
        <p className="mt-3 text-sm text-ink-muted">
          Your interview has been successfully scheduled. We look forward to meeting you!
        </p>

        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 text-left space-y-3.5">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Position
            </span>
            <p className="text-sm font-semibold text-ink">{data.job.title}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Round
            </span>
            <p className="text-sm font-semibold text-ink">{data.round.title}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Scheduled Date &amp; Time
            </span>
            <p className="text-base font-bold text-teal-900">
              {confirmedBooking.date}
            </p>
            <p className="text-sm font-medium text-teal-800">
              {confirmedBooking.time} ({confirmedBooking.timezone})
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Application ID
            </span>
            <p className="font-mono text-sm text-ink">{confirmedBooking.applicationCode}</p>
          </div>
          {confirmedBooking.meetingLink ? (
            <div className="rounded-2xl border border-teal-200 bg-white/90 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
                Google Meet Video Call
              </span>
              <a
                href={confirmedBooking.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm font-semibold text-teal-700 hover:underline break-all"
              >
                {confirmedBooking.meetingLink}
              </a>
            </div>
          ) : null}
        </div>

        {/* Calendar & Meeting Integration Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {confirmedBooking.meetingLink ? (
            <a
              href={confirmedBooking.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-900"
            >
              <span>🎥</span> Join Google Meet
            </a>
          ) : null}

          {confirmedBooking.meetingLink ? (
            <button
              type="button"
              onClick={() => handleCopyMeetingLink(confirmedBooking.meetingLink!)}
              className="inline-flex items-center gap-2 rounded-xl border border-hairline-light bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-sm transition hover:bg-ink/[0.03]"
            >
              {copiedMeetingLink ? "✓ Link Copied" : "Copy Meet Link"}
            </button>
          ) : null}
          {confirmedBooking.googleCalendarUrl ? (
            <a
              href={confirmedBooking.googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-900"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Add to Google Calendar
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => handleDownloadIcs(confirmedBooking.icsContent)}
            className="inline-flex items-center gap-2 rounded-xl border border-hairline-light bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-sm transition hover:bg-ink/[0.03]"
          >
            <svg className="h-4 w-4 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Calendar (.ics)
          </button>

        </div>

        <p className="mt-5 text-xs text-ink-muted">
          A confirmation email with the meeting invitation and details has been sent to{" "}
          <strong className="text-ink">{data.candidate.email}</strong>.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/careers"
            className="inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
          >
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  // Main Calendly-style scheduling view
  return (
    <div className="mx-auto max-w-5xl rounded-3xl border border-hairline-light bg-white shadow-2xl overflow-hidden">
      {/* Mobile Step Header */}
      <div className="flex border-b border-hairline-light bg-ink/[0.02] p-3 text-center sm:hidden text-xs font-medium">
        <button
          type="button"
          onClick={() => setMobileStep("date")}
          className={`flex-1 py-1.5 rounded-lg ${
            mobileStep === "date" ? "bg-white font-bold text-ink shadow-sm" : "text-ink-muted"
          }`}
        >
          1. Select Date
        </button>
        <button
          type="button"
          onClick={() => selectedDate && setMobileStep("time")}
          disabled={!selectedDate}
          className={`flex-1 py-1.5 rounded-lg ${
            mobileStep === "time" ? "bg-white font-bold text-ink shadow-sm" : "text-ink-muted"
          }`}
        >
          2. Select Time
        </button>
        <button
          type="button"
          onClick={() => selectedSlot && setMobileStep("confirm")}
          disabled={!selectedSlot}
          className={`flex-1 py-1.5 rounded-lg ${
            mobileStep === "confirm" ? "bg-white font-bold text-ink shadow-sm" : "text-ink-muted"
          }`}
        >
          3. Confirm
        </button>
      </div>

      <div className="grid grid-cols-1 divide-y divide-hairline-light md:grid-cols-12 md:divide-x md:divide-y-0">
        {/* Left Column: Interview Details (4 cols) */}
        <div className="p-6 md:col-span-4 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
              <p className="text-xs font-semibold tracking-wider uppercase text-ink-muted">
                MarineCloudX Careers
              </p>
            </div>

            <h1 className="mt-3 text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {data?.job?.title || "Interview Session"}
            </h1>
            <p className="mt-1 text-sm font-medium text-teal-800">{data?.round?.title || "Discussion"}</p>

            <div className="mt-6 space-y-3 border-t border-hairline-light pt-5 text-sm text-ink-muted">
              <div className="flex items-center gap-2.5 text-ink">
                <span className="text-base">⏱</span>
                <span>{data?.round?.durationMinutes || 30} minutes</span>
              </div>
              <div className="flex items-center gap-2.5 text-ink">
                <span className="text-base">💻</span>
                <span>Online Video Interview</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base">🌐</span>
                <span title="India Standard Time">
                  {data?.timezone === "Asia/Kolkata" ? "India Standard Time (IST, UTC+5:30)" : data?.timezone || "Asia/Kolkata"}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-hairline-light bg-ink/[0.02] p-4 text-xs text-ink-muted">
              <p className="font-semibold text-ink">Candidate Details</p>
              <p className="mt-1">{data?.candidate?.name || "Candidate"}</p>
              <p className="font-mono text-[11px] text-ink-muted mt-0.5">
                {data?.candidate?.applicationCode}
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs text-ink-muted hidden md:block">
            Please select a date and an available time slot to reserve your interview session.
          </p>
        </div>

        {/* Center Column: Interactive Calendar (4.5 cols) */}
        <div
          className={`p-6 md:col-span-4 md:p-8 ${
            mobileStep !== "date" ? "hidden md:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-ink">
              {monthName} {currentYear}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline-light text-sm text-ink hover:bg-ink/[0.04]"
                aria-label="Previous month"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline-light text-sm text-ink hover:bg-ink/[0.04]"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-muted mb-2">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
            {Array.from({ length: leadingBlankDays }).map((_, i) => (
              <div key={`blank-${i}`} className="h-9 w-full" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
                dayNum,
              ).padStart(2, "0")}`;
              const isAvailable = availableDates.includes(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setMobileStep("time");
                  }}
                  className={`relative flex h-10 w-full items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-ink text-white shadow-md scale-105"
                      : isAvailable
                      ? "bg-teal-50 text-teal-900 font-bold hover:bg-teal-100"
                      : "text-ink/20 cursor-not-allowed"
                  }`}
                >
                  {dayNum}
                  {isAvailable && !isSelected ? (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-teal-600" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {availableDates.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-xs text-amber-900">
              There are currently no available interview slots for this round. Please contact MarineCloudX for assistance.
            </div>
          ) : (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-muted">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span>Available interview dates</span>
            </div>
          )}
        </div>

        {/* Right Column: Available Times & Confirm (3.5 cols) */}
        <div
          className={`p-6 md:col-span-4 md:p-8 flex flex-col justify-between ${
            mobileStep === "date" ? "hidden md:flex" : "flex"
          }`}
        >
          <div>
            <h3 className="text-sm font-semibold text-ink mb-1">Available Times</h3>
            {selectedDate ? (
              <p className="text-xs text-ink-muted mb-4">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }).format(new Date(`${selectedDate}T12:00:00Z`))}
              </p>
            ) : (
              <p className="text-xs text-ink-muted mb-4">Please select a date first.</p>
            )}

            {bookingError ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                {bookingError}
              </div>
            ) : null}

            {isLoadingSlots ? (
              <div className="space-y-2 py-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 w-full animate-pulse rounded-xl bg-ink/5" />
                ))}
              </div>
            ) : !selectedDate ? (
              <div className="py-12 text-center text-xs text-ink-muted">
                Select a date from the calendar to view available interview times.
              </div>
            ) : slots.length === 0 ? (
              <div className="py-8 text-center text-xs text-ink-muted">
                No slots available on this date. Please choose another date.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setBookingError(null);
                        setMobileStep("confirm");
                      }}
                      className={`w-full rounded-xl border px-4 py-2.5 text-center text-xs font-semibold transition-all ${
                        isSelected
                          ? "border-teal-700 bg-teal-700 text-white shadow-md"
                          : "border-hairline-light bg-white text-ink hover:border-teal-600 hover:bg-teal-50/50"
                      }`}
                    >
                      {slot.formattedTime}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirmation Box */}
          {selectedSlot ? (
            <div className="mt-6 border-t border-hairline-light pt-5 space-y-3">
              <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-3.5 text-xs text-teal-950">
                <p className="font-semibold text-teal-900">Selected Appointment</p>
                <p className="mt-1 font-bold text-sm text-teal-950">
                  {selectedSlot.formattedTime} – {selectedSlot.formattedEndTime}
                </p>
                <p className="mt-0.5 text-ink-muted">
                  {new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(selectedSlot.startAt))}
                </p>
              </div>

              <div>
                <label htmlFor="notes" className="text-xs font-medium text-ink-muted">
                  Notes for Interviewer (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any topics, portfolio links or notes..."
                  className="mt-1 w-full rounded-xl border border-hairline-light p-2 text-xs text-ink placeholder:text-ink/30 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="w-full rounded-xl bg-ink py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-ink/90 disabled:opacity-50 shadow-md"
              >
                {isBooking ? "Confirming Booking…" : "Confirm Interview"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
