"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ACCOUNT_CHANGED_EVENT,
  getStoredUser,
  type AccountUser,
} from "@/lib/account";
import { getUserBookings } from "@/lib/payload/bookings";

type BookingRow = {
  id: number | string;
  house: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  paymentMethod: "gcash" | "cash" | string;
  status: string;
  createdAt: string;
};

export default function MyBookingsPage() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initializeUser = () => {
      const storedUser = getStoredUser();
      setUser(storedUser);
      setIsHydrated(true);
      setIsLoading(Boolean(storedUser));
    };

    if (typeof window === "undefined") {
      return;
    }

    const rafId = window.requestAnimationFrame
      ? window.requestAnimationFrame(initializeUser)
      : setTimeout(initializeUser, 0);

    const handleAccountChanged = () => {
      initializeUser();
    };

    window.addEventListener(ACCOUNT_CHANGED_EVENT, handleAccountChanged);

    return () => {
      window.removeEventListener(ACCOUNT_CHANGED_EVENT, handleAccountChanged);
      if (typeof window !== "undefined") {
        if (typeof window.cancelAnimationFrame === "function") {
          window.cancelAnimationFrame(rafId as number);
        } else {
          clearTimeout(rafId as number);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const currentUser = user;
    let isActive = true;

    async function loadBookings() {
      setIsLoading(true);

      try {
        const response = await getUserBookings(
          currentUser.email,
          currentUser.token,
        );
        const docs = response?.docs ?? [];

        const nextBookings = docs.map((booking) => {
          const transientHouse =
            typeof booking.transientHouse === "object" && booking.transientHouse
              ? booking.transientHouse
              : null;

          return {
            id: booking.id ?? booking.bookingReference,
            house: transientHouse?.name || "Transient house",
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests,
            total: booking.totalAmount,
            paymentMethod: booking.paymentMethod || "cash",
            status: booking.status || "Pending confirmation",
            createdAt: booking.createdAt || new Date().toISOString(),
          } satisfies BookingRow;
        });

        if (isActive) {
          setBookings(nextBookings);
          setIsLoading(false);
        }
      } catch {
        if (isActive) {
          setBookings([]);
          setIsLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      isActive = false;
    };
  }, [user]);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Loading your bookings...
        </h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Log in to see your bookings
        </h1>
        <p className="mt-4 text-slate-500">
          Your reservation history will appear here after you log in.
        </p>
        <Button href="/login" className="mt-8">
          Log in
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#007aff]">
            Welcome back, {user.name}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            My bookings
          </h1>
          <p className="mt-2 text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {isLoading ? (
          <div className="rounded-[26px] border border-slate-200 bg-white/60 p-10 text-center text-slate-500">
            Loading your bookings...
          </div>
        ) : bookings.length ? (
          bookings.map((booking) => (
            <article
              key={String(booking.id)}
              className="rounded-[26px] border border-white/80 bg-white/75 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    {booking.id}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {booking.house}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {booking.checkIn} to {booking.checkOut} · {booking.guests}{" "}
                    guests
                  </p>
                </div>
                <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  {booking.status}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-slate-200/70 pt-4 text-sm text-slate-600">
                <span>
                  Total:{" "}
                  <strong className="text-slate-900">
                    ₱{booking.total.toLocaleString()}
                  </strong>
                </span>
                <span>
                  Payment:{" "}
                  <strong className="text-slate-900">
                    {booking.paymentMethod === "gcash" ? "GCash" : "Cash"}
                  </strong>
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[26px] border border-dashed border-slate-300 bg-white/60 p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Find a comfortable stay and your reservation will appear here.
            </p>
            <Link
              href="/transient-houses"
              className="mt-6 inline-flex text-sm font-medium text-[#007aff] hover:underline"
            >
              Browse transient houses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
