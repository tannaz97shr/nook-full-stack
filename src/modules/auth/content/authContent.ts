export const AUTH_CONTENT = {
  "sign-in": {
    title: "Welcome back",
    blurb: "Sign in to see past orders, reorder in two taps, and keep your points ticking.",
    cta: "Sign in",
    switchText: "New here?",
    switchCta: "Create one",
  },
  "sign-up": {
    title: "Start collecting",
    blurb: "Takes about twenty seconds. Your usual order gets saved for next time.",
    cta: "Create account",
    switchText: "Already have an account?",
    switchCta: "Sign in",
  },
} as const;

export const AUTH_QUOTE = "A point a dollar. Nine coffees in, the tenth is on us.";
export const AUTH_GOOGLE_CTA = "Continue with Google";
export const AUTH_DIVIDER = "or";
export const AUTH_GUEST_TEXT = "Ordering as a guest is fine too — you just won't collect points.";
export const AUTH_GUEST_CTA = "Skip for now";

export const AUTH_ERRORS = {
  invalidCredentials: "Incorrect email or password.",
  emailTaken: "That email's already registered.",
  generic: "Something went wrong. Please try again.",
} as const;

/**
 * Auth.js redirects to the sign-in page with ?error=<code> when a
 * server-side callback rejects a sign-in outside the client-driven
 * redirect:false flow — e.g. our auth.ts signIn() callback returning
 * false on a cross-provider email collision throws AccessDenied
 * (@auth/core/errors.js), which @auth/core always sends to pages.signIn
 * as ?error=AccessDenied, regardless of which page (sign-in or sign-up)
 * the Google button was clicked from.
 */
const AUTH_URL_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "That email is already registered with a different sign-in method.",
};

export function getAuthUrlErrorMessage(code: string | undefined): string | undefined {
  if (!code) return undefined;
  return AUTH_URL_ERROR_MESSAGES[code] ?? AUTH_ERRORS.generic;
}
