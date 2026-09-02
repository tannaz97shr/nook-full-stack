import Image from "next/image";
import { AuthForm } from "./AuthForm";
import { AUTH_QUOTE } from "../content/authContent";
import type { AuthMode } from "../types/auth-form";

export interface AuthScreenProps {
  mode: AuthMode;
  callbackUrl?: string;
  errorMessage?: string;
}

export function AuthScreen({ mode, callbackUrl, errorMessage }: AuthScreenProps) {
  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-8 md:py-12">
      <div className="grid items-center gap-6 sm:grid-cols-2 md:gap-12">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sunken shadow-lg">
          <Image
            src="/images/marketing/coffee-closeup.jpg"
            alt="Coffee on a marble table"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-overlay" />
          <p
            className="absolute inset-x-0 bottom-0 p-6 font-display text-xl italic leading-snug md:p-8 md:text-2xl"
            // Static light color, not a design token: this sits on a photo
            // overlay and must stay legible in both light and dark app
            // theme, unlike the app's own UI text. Same exemption applied
            // to the Google brand mark in AuthForm.
            style={{ color: "#FBF7F0" }}
          >
            {AUTH_QUOTE}
          </p>
        </div>

        <AuthForm mode={mode} callbackUrl={callbackUrl} errorMessage={errorMessage} />
      </div>
    </main>
  );
}
