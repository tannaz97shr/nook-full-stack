"use client";

import { Button, Checkbox, Modal, TextField } from "@/shared/components";
import { useAdminRewardForm } from "../hooks/useAdminRewardForm";
import { CANCEL_LABEL, REWARD_FORM_LABELS, REWARD_FORM_TITLE, SAVE_LABEL } from "../content/adminLoyaltyContent";
import type { RewardCatalogItem } from "../types/reward";

export interface AdminRewardFormProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  reward?: RewardCatalogItem;
}

export function AdminRewardForm({ open, onClose, onSaved, reward }: AdminRewardFormProps) {
  const { register, handleSubmit, errors, isSubmitting, formError } = useAdminRewardForm({
    reward,
    onSuccess: onSaved,
  });

  return (
    <Modal open={open} onClose={onClose} labelledBy="admin-reward-form-title">
      <form onSubmit={handleSubmit} noValidate className="grid gap-4 overflow-y-auto p-5 sm:p-6">
        <h2 id="admin-reward-form-title" className="font-display text-xl text-ink">
          {reward ? REWARD_FORM_TITLE.edit : REWARD_FORM_TITLE.create}
        </h2>

        <TextField label={REWARD_FORM_LABELS.name} error={errors.name?.message} {...register("name")} />
        <TextField
          label={REWARD_FORM_LABELS.description}
          error={errors.description?.message}
          {...register("description")}
        />
        <TextField
          label={REWARD_FORM_LABELS.pointsCost}
          type="number"
          error={errors.pointsCost?.message}
          {...register("pointsCost", { valueAsNumber: true })}
        />
        <TextField
          label={REWARD_FORM_LABELS.discountValue}
          type="number"
          step="0.01"
          error={errors.discountValue?.message}
          {...register("discountValue", { valueAsNumber: true })}
        />

        <Checkbox label={REWARD_FORM_LABELS.isActive} {...register("isActive")} />

        {formError && (
          <p role="alert" className="text-sm text-clay">
            {formError}
          </p>
        )}

        <div className="flex justify-end gap-2.5 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            {CANCEL_LABEL}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {SAVE_LABEL}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
