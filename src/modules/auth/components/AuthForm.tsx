"use client";

import Link from "next/link";
import { Button, TextField } from "@/shared/components";
import { ROUTES, signInWithCallback, signUpWithCallback } from "@/shared/routes";
import { useAuthForm } from "../hooks/useAuthForm";
import {
  AUTH_CONTENT,
  AUTH_DIVIDER,
  AUTH_GOOGLE_CTA,
  AUTH_GUEST_CTA,
  AUTH_GUEST_TEXT,
} from "../content/authContent";
import type { AuthMode } from "../types/auth-form";

export interface AuthFormProps {
  mode: AuthMode;
  callbackUrl?: string;
  errorMessage?: string;
}

export function AuthForm({ mode, callbackUrl, errorMessage }: AuthFormProps) {
  const copy = AUTH_CONTENT[mode];
  const isSignUp = mode === "sign-up";
  const { register, handleSubmit, errors, isSubmitting, formError, signInWithGoogle } =
    useAuthForm({ mode, callbackUrl, initialError: errorMessage });

  const toggleHref = isSignUp
    ? signInWithCallback(callbackUrl ?? ROUTES.account.root)
    : signUpWithCallback(callbackUrl ?? ROUTES.account.root);

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <h1 className="mb-2 font-display text-3xl font-medium tracking-tight text-ink">
        {copy.title}
      </h1>
      <p className="mb-[26px] text-[15.5px] leading-relaxed text-ink-muted">{copy.blurb}</p>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={signInWithGoogle}
        icon={
          // Static Google brand mark — not an app UI color, so it's
          // deliberately not a design-token reference.
          <span
            aria-hidden
            className="block h-[19px] w-[19px] rounded-pill"
            style={{
              background:
                "conic-gradient(from -45deg, #EA4335 0 25%, #FBBC05 0 50%, #34A853 0 75%, #4285F4 0)",
            }}
          />
        }
      >
        {AUTH_GOOGLE_CTA}
      </Button>

      <div className="my-[22px] flex items-center gap-[14px]">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-subtle">
          {AUTH_DIVIDER}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-[14px]">
        {isSignUp && (
          <TextField
            label="Name"
            placeholder="Rosa Feld"
            error={errors.name?.message}
            {...register("name")}
          />
        )}
        <TextField
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {formError && (
          <p role="alert" className="text-sm text-clay">
            {formError}
          </p>
        )}

        <Button type="submit" variant="primary" fullWidth disabled={isSubmitting} className="mt-1">
          {copy.cta}
        </Button>
      </form>

      <p className="mt-[22px] text-center text-sm text-ink-subtle">
        {copy.switchText}{" "}
        <Link href={toggleHref} className="font-bold text-gold underline underline-offset-[3px]">
          {copy.switchCta}
        </Link>
      </p>
      <p className="mt-[18px] text-center text-[13px] leading-relaxed text-ink-subtle">
        {AUTH_GUEST_TEXT}{" "}
        <Link
          href={callbackUrl ?? ROUTES.menu}
          className="text-ink-muted underline underline-offset-[3px]"
        >
          {AUTH_GUEST_CTA}
        </Link>
      </p>
    </div>
  );
}
