import type { User } from "@/modules/auth/types";
import { formatMemberSince } from "../lib/formatMemberSince";
import { getInitials } from "../lib/getInitials";
import { AccountTabs } from "./AccountTabs";
import { SignOutButton } from "./SignOutButton";

export interface AccountShellProps {
  user: User;
}

export function AccountShell({ user }: AccountShellProps) {
  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-8">
      <div className="mb-8 flex flex-wrap items-center gap-[18px]">
        <div className="grid h-[62px] w-[62px] shrink-0 place-items-center rounded-pill bg-gold-soft font-display text-2xl font-medium text-gold">
          {getInitials(user.name)}
        </div>
        <div className="min-w-[180px] flex-1">
          <h1 className="font-display text-2xl text-ink">{user.name}</h1>
          <p className="mt-0.5 text-sm text-ink-subtle">{formatMemberSince(user.createdAt)}</p>
        </div>
        <SignOutButton />
      </div>

      <AccountTabs />
    </div>
  );
}
