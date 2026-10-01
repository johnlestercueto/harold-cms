"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getActiveGcashAccount } from "@/lib/payload/gcash-accounts";
import { getStoredUser, saveUser } from "@/lib/account";
import { siteConfig } from "@/config/site";
import {
  calculateBookingPreview,
  createBooking,
  getBookingFormDefaults,
} from "@/lib/payload/bookings";
import {
  getTransientHouseBySlug,
  getTransientHouses,
} from "@/lib/payload/houses";

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedHouse = searchParams.get("house") || "";
  const selectedHouseId = Number(searchParams.get("houseId"));
  const [user] = useState<ReturnType<typeof getStoredUser>>(() =>
    getStoredUser(),
  );
  const [isAccountLoaded] = useState(true);
  const [selectedHouseData, setSelectedHouseData] = useState<Awaited<
    ReturnType<typeof getTransientHouseBySlug>
  > | null>(null);
  const [firstName = "", ...lastNameParts] = (user?.name || "").split(/\s+/);
  const lastName = lastNameParts.join(" ");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState(getBookingFormDefaults());
  const [gcashAccount, setGcashAccount] =
    useState<Awaited<ReturnType<typeof getActiveGcashAccount>>>(null);

  useEffect(() => {
    getActiveGcashAccount().then(setGcashAccount);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSelectedHouse() {
      if (!selectedHouse && !selectedHouseId) {
        setSelectedHouseData(null);
        return;
      }

      try {
        let house = null;

        if (selectedHouseId > 0) {
          const response = await getTransientHouses({
            "where[id][equals]": selectedHouseId,
            limit: 1,
          });
          house = response?.docs?.[0] ?? null;
        }

        if (!house && selectedHouse) {
          house = await getTransientHouseBySlug(selectedHouse);
        }

        if (isMounted) {
          setSelectedHouseData(house);
        }
      } catch {
        if (isMounted) {
          setSelectedHouseData(null);
        }
      }
    }

    loadSelectedHouse();

    return () => {
      isMounted = false;
    };
  }, [selectedHouse, selectedHouseId]);

  const pricePerNight = selectedHouseData?.pricePerNight ?? 0;

  const preview = useMemo(
    () =>
      calculateBookingPreview({
        pricePerNight,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        additionalFees: 0,
      }),
    [form.checkIn, form.checkOut, pricePerNight],
  );

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handlePaymentMethodChange = (paymentMethod: "gcash" | "cash") => {
    setForm((current) => ({
      ...current,
      paymentMethod,
      gcashReferenceNumber:
        paymentMethod === "cash" ? "" : current.gcashReferenceNumber,
    }));
    setMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.paymentMethod === "gcash" && !form.gcashReferenceNumber.trim()) {
      setMessage("Please enter your GCash reference number before submitting.");
      return;
    }

    const user = getStoredUser();
    if (!user) {
      setMessage("Please log in before submitting a booking request.");
      return;
    }

    if (!user.token) {
      setMessage("Please log in again to authorize your booking request.");
      return;
    }

    const phone = user.phone?.trim() || form.phone.trim();
    if (!phone) {
      setMessage("Please enter your phone number to continue your booking.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      let transientHouseId = selectedHouseId;

      if (!Number.isInteger(transientHouseId) || transientHouseId <= 0) {
        const house = await getTransientHouseBySlug(selectedHouse);
        transientHouseId = house?.id ?? 0;
      }

      if (!Number.isInteger(transientHouseId) || transientHouseId <= 0) {
        throw new Error(
          "Please select a transient house before submitting a booking request.",
        );
      }

      const result = await createBooking({
        token: user.token,
        transientHouse: transientHouseId,
        customer: {
          firstName,
          lastName,
          email: user.email.trim().toLowerCase(),
          phone,
        },
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        specialRequest: form.specialRequest.trim() || undefined,
        additionalFees: preview.additionalFees,
        paymentMethod: form.paymentMethod,
        gcashReferenceNumber:
          form.paymentMethod === "gcash"
            ? form.gcashReferenceNumber.trim()
            : undefined,
      });

      if (!result?.doc) {
        const backendMessage =
          result?.errors?.[0]?.message ||
          result?.message ||
          result?.error ||
          "Unable to create your booking request.";

        throw new Error(backendMessage);
      }

      if (!user.phone) {
        saveUser({ ...user, phone });
      }
      setMessage(
        "Booking request created. You can view it anytime in My bookings.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your booking request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAccountLoaded) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-slate-500 sm:px-6 lg:px-8">
        Checking your account...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#007aff]">
          Account required
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
          Log in before booking
        </h1>
        <p className="mt-4 text-slate-500">
          Please log in to continue with your reservation.
        </p>
        <Button href="/login" className="mt-8">
          Log in to book
        </Button>
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="mt-4 block w-full text-sm font-medium text-[#007aff] hover:underline"
        >
          Create an account
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Booking
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Reserve your stay
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Booking for</p>
              <p className="mt-2 text-slate-900">
                {user?.name || "Logged-in user"}
              </p>
              <p>{user?.email}</p>
              {user?.phone ? (
                <p>{user.phone}</p>
              ) : (
                <label className="mt-3 block text-slate-700">
                  <span className="mb-2 block font-medium">Phone number</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400"
                    required
                  />
                </label>
              )}
            </div>
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Check-in</span>
              <input
                type="date"
                value={form.checkIn}
                onChange={(event) =>
                  handleChange("checkIn", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                required
              />
            </label>
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Check-out</span>
              <input
                type="date"
                value={form.checkOut}
                onChange={(event) =>
                  handleChange("checkOut", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                required
              />
            </label>
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Guests</span>
              <input
                type="number"
                min={1}
                value={form.guests}
                onChange={(event) =>
                  handleChange("guests", Number(event.target.value))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                required
              />
            </label>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Selected stay</p>
              <p className="mt-2">
                {selectedHouseData?.name || selectedHouse || "Transient house"}
              </p>
            </div>
            <fieldset className="md:col-span-2">
              <legend className="mb-3 block text-sm font-medium text-slate-700">
                Payment method
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: "gcash" as const,
                    title: "GCash",
                    description:
                      "Pay via GCash and enter your reference number.",
                  },
                  {
                    value: "cash" as const,
                    title: "Cash",
                    description: "Pay in cash upon arrival.",
                  },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${form.paymentMethod === method.value ? "border-[#007aff] bg-[#007aff]/5 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={() => handlePaymentMethodChange(method.value)}
                      className="sr-only"
                    />
                    <span className="block font-medium text-slate-900">
                      {method.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {method.description}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {form.paymentMethod === "gcash" ? (
              <label className="block text-sm text-slate-700 md:col-span-2">
                <span className="mb-2 block font-medium text-slate-900">
                  GCash reference number{" "}
                  <span className="text-rose-500">*</span>
                </span>
                <span className="mb-3 block text-xs text-slate-500">
                  Enter the reference number shown after your GCash payment.
                </span>
                <input
                  type="text"
                  value={form.gcashReferenceNumber}
                  required
                  onChange={(event) =>
                    handleChange("gcashReferenceNumber", event.target.value)
                  }
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-slate-400"
                />
              </label>
            ) : null}
            <label className="block text-sm text-slate-700 md:col-span-2">
              <span className="mb-2 block font-medium">Special request</span>
              <textarea
                value={form.specialRequest}
                onChange={(event) =>
                  handleChange("specialRequest", event.target.value)
                }
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
              />
            </label>
          </div>

          {message ? (
            <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}

          <div className="mt-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full justify-center disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit booking request"}
            </Button>
          </div>
        </form>

        <aside className="rounded-[30px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Booking summary
          </h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Stay</span>
              <span className="font-medium text-slate-900">
                {selectedHouseData?.name || selectedHouse || "Selected house"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Nights</span>
              <span className="font-medium text-slate-900">
                {preview.nights}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">
                ₱{preview.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Additional fees</span>
              <span className="font-medium text-slate-900">
                ₱{preview.additionalFees.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-4 text-base">
              <span>Total</span>
              <span className="font-semibold text-slate-900">
                ₱{preview.total.toLocaleString()}
              </span>
            </div>
          </div>
          {form.paymentMethod === "gcash" ? (
            <div className="mt-8 rounded-2xl border border-[#007aff]/20 bg-[#007aff]/5 p-4 text-sm text-slate-700">
              <p className="font-medium text-slate-900">
                GCash payment instructions
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {gcashAccount?.instructions ||
                  "Send your payment to the GCash account below, then enter the reference number from your completed transaction."}
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Account name</dt>
                  <dd className="font-medium text-slate-900">
                    {gcashAccount?.accountName || siteConfig.gcashAccountName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">GCash number</dt>
                  <dd className="font-medium text-slate-900">
                    {gcashAccount?.accountNumber ||
                      siteConfig.gcashAccountNumber}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-slate-500">
          Loading booking form...
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
