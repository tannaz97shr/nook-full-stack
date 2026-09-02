"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/shared/routes";
import { API_ROUTES } from "@/shared/api-routes";
import { credentialsSchema, registerSchema } from "../lib/credentialsSchema";
import { AUTH_ERRORS } from "../content/authContent";
import type { AuthMode } from "../types/auth-form";

interface UseAuthFormInput {
  mode: AuthMode;
  callbackUrl?: string;
  initialError?: string;
}

interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}

function noop() {}

export function useAuthForm({ mode, callbackUrl, initialError }: UseAuthFormInput) {
  const [formError, setFormError] = useState<string | null>(initialError ?? null);
  const schema = mode === "sign-up" ? registerSchema : credentialsSchema;

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: AuthFormValues) {
    setFormError(null);

    if (mode === "sign-up") {
      const response = await fetch(API_ROUTES.auth.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        setFormError(response.status === 409 ? AUTH_ERRORS.emailTaken : AUTH_ERRORS.generic);
        return;
      }
    }

    // MUST check result?.error, not .ok/.status — v5's credentials
    // callback returns HTTP 200 even on failed login.
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setFormError(AUTH_ERRORS.invalidCredentials);
      return;
    }

    // Full page navigation, not router.push()+refresh(), so the new
    // session cookie is picked up by the server on next render.
    window.location.assign(callbackUrl ?? ROUTES.account.root);
  }

  function signInWithGoogle() {
    void signIn("google", { callbackUrl: callbackUrl ?? ROUTES.account.root });
  }

  return {
    register,
    handleSubmit: rhfHandleSubmit(onSubmit, noop),
    errors,
    isSubmitting,
    formError,
    signInWithGoogle,
  };
}
