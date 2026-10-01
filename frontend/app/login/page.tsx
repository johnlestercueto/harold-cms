"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { loginAccount } from "@/lib/auth";
import { saveUser } from "@/lib/account";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const user = await loginAccount(email.trim().toLowerCase(), password);
      saveUser(user);
      router.push("/my-bookings");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="rounded-[30px] border border-white/80 bg-white/75 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#007aff]">
          Your account
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
          Log in to your stays
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Use your details to view your booking history and reservation status.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#007aff]"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#007aff]"
              required
            />
          </label>
          {message ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {message}
            </p>
          ) : null}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Logging in..." : "Continue to my bookings"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <a
            href="/signup"
            className="font-medium text-[#007aff] hover:underline"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
