"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function DashboardLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-6 text-xl font-bold text-neutral-900">Tellimuste haldus</h1>

        <label htmlFor="username" className="mb-1 block text-sm font-semibold text-neutral-900">
          Kasutajanimi
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="mb-4 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500"
        />

        <label htmlFor="password" className="mb-1 block text-sm font-semibold text-neutral-900">
          Parool
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mb-4 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500"
        />

        {state?.error && <p className="mb-4 text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-60"
        >
          {pending ? "Login sisse…" : "Logi sisse"}
        </button>
      </form>
    </main>
  );
}
