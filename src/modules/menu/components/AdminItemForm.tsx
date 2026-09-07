"use client";

import { Button, Checkbox, CheckboxGroup, FileInput, Modal, SelectField, TextField } from "@/shared/components";
import { useAdminImageUpload } from "../hooks/useAdminImageUpload";
import { useAdminItemForm } from "../hooks/useAdminItemForm";
import type { MenuItemInput } from "../lib/menuItemSchema";
import {
  CANCEL_LABEL,
  DIETARY_TAG_OPTIONS,
  ITEM_FORM_LABELS,
  ITEM_FORM_TITLE,
  SAVE_LABEL,
} from "../content/adminMenuContent";
import type { Category, MenuItem, OptionGroup } from "../types";

export interface AdminItemFormProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  item?: MenuItem;
  categories: Category[];
  optionGroups: OptionGroup[];
}

/** Single-photo slot only — matches the design mock's one-thumbnail-per-item table; uploading replaces images[0]. */
export function AdminItemForm({ open, onClose, onSaved, item, categories, optionGroups }: AdminItemFormProps) {
  const { register, watch, setValue, handleSubmit, errors, isSubmitting, formError } = useAdminItemForm({
    item,
    onSuccess: onSaved,
  });
  const imageUpload = useAdminImageUpload();

  const images = watch("images");
  const dietaryTags = watch("dietaryTags");
  const optionGroupIds = watch("optionGroupIds");

  async function handleFileSelected(file: File) {
    const url = await imageUpload.upload(file);
    if (url) setValue("images", [url], { shouldValidate: true });
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="admin-item-form-title">
      <form onSubmit={handleSubmit} noValidate className="grid gap-4 overflow-y-auto p-5 sm:p-6">
        <h2 id="admin-item-form-title" className="font-display text-xl text-ink">
          {item ? ITEM_FORM_TITLE.edit : ITEM_FORM_TITLE.create}
        </h2>

        <TextField label={ITEM_FORM_LABELS.name} error={errors.name?.message} {...register("name")} />
        <TextField
          label={ITEM_FORM_LABELS.description}
          error={errors.description?.message}
          {...register("description")}
        />
        <SelectField
          label={ITEM_FORM_LABELS.category}
          error={errors.categoryId?.message}
          {...register("categoryId")}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>
        <TextField
          label={ITEM_FORM_LABELS.basePrice}
          type="number"
          step="0.01"
          error={errors.basePrice?.message}
          {...register("basePrice", { valueAsNumber: true })}
        />

        <FileInput
          label={ITEM_FORM_LABELS.photo}
          onFileSelected={handleFileSelected}
          previewUrl={images[0] ?? null}
          isUploading={imageUpload.isUploading}
          error={imageUpload.error ?? undefined}
        />

        <CheckboxGroup
          label={ITEM_FORM_LABELS.dietaryTags}
          options={DIETARY_TAG_OPTIONS}
          selected={dietaryTags}
          onChange={(next) =>
            setValue("dietaryTags", next as MenuItemInput["dietaryTags"], { shouldValidate: true })
          }
        />

        <CheckboxGroup
          label={ITEM_FORM_LABELS.optionGroups}
          options={optionGroups.map((group) => ({ value: group.id, label: group.name }))}
          selected={optionGroupIds}
          onChange={(next) => setValue("optionGroupIds", next, { shouldValidate: true })}
        />

        <Checkbox label={ITEM_FORM_LABELS.isAvailable} {...register("isAvailable")} />

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
