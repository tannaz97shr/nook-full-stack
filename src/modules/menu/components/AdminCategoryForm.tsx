"use client";

import { Button, Checkbox, Modal, TextField } from "@/shared/components";
import { useAdminCategoryForm } from "../hooks/useAdminCategoryForm";
import { CANCEL_LABEL, CATEGORY_FORM_LABELS, CATEGORY_FORM_TITLE, SAVE_LABEL } from "../content/adminMenuContent";
import type { Category } from "../types";

export interface AdminCategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  category?: Category;
}

export function AdminCategoryForm({ open, onClose, onSaved, category }: AdminCategoryFormProps) {
  const { register, handleSubmit, errors, isSubmitting, formError } = useAdminCategoryForm({
    category,
    onSuccess: onSaved,
  });

  return (
    <Modal open={open} onClose={onClose} labelledBy="admin-category-form-title">
      <form onSubmit={handleSubmit} noValidate className="grid gap-4 p-5 sm:p-6">
        <h2 id="admin-category-form-title" className="font-display text-xl text-ink">
          {category ? CATEGORY_FORM_TITLE.edit : CATEGORY_FORM_TITLE.create}
        </h2>

        <TextField label={CATEGORY_FORM_LABELS.name} error={errors.name?.message} {...register("name")} />
        <TextField
          label={CATEGORY_FORM_LABELS.description}
          error={errors.description?.message}
          {...register("description")}
        />
        <Checkbox label={CATEGORY_FORM_LABELS.isActive} {...register("isActive")} />

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
