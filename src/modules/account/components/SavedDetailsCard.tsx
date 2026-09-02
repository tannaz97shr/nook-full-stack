import { TextField } from "@/shared/components";
import type { User } from "@/modules/auth/types";
import {
  EMAIL_FIELD_LABEL,
  NAME_FIELD_LABEL,
  PHONE_FIELD_LABEL,
  PHONE_NOT_PROVIDED_LABEL,
  SAVED_DETAILS_BLURB,
  SAVED_DETAILS_HEADING,
} from "../content/accountContent";

export interface SavedDetailsCardProps {
  user: User;
}

export function SavedDetailsCard({ user }: SavedDetailsCardProps) {
  return (
    <div className="max-w-md rounded-xl border border-border bg-surface p-6">
      <h2 className="font-display text-xl text-ink">{SAVED_DETAILS_HEADING}</h2>
      <p className="mt-1.5 text-[14.5px] text-ink-muted">{SAVED_DETAILS_BLURB}</p>

      <div className="mt-5 grid gap-4">
        <TextField label={NAME_FIELD_LABEL} value={user.name} readOnly />
        <TextField label={PHONE_FIELD_LABEL} value={user.phone ?? PHONE_NOT_PROVIDED_LABEL} readOnly />
        <TextField label={EMAIL_FIELD_LABEL} value={user.email} readOnly type="email" />
      </div>
    </div>
  );
}
