"use client";

import { Button, Checkbox, Modal, SelectField, TextField } from "@/shared/components";
import { useAdminOptionGroupForm } from "../hooks/useAdminOptionGroupForm";
import {
  CANCEL_LABEL,
  OPTION_GROUP_FORM_LABELS,
  OPTION_GROUP_FORM_TITLE,
  SAVE_LABEL,
} from "../content/adminMenuContent";
import type { Option, OptionGroup } from "../types";

export interface AdminOptionGroupFormProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  group?: OptionGroup;
  groupOptions?: Option[];
}

export function AdminOptionGroupForm({ open, onClose, onSaved, group, groupOptions }: AdminOptionGroupFormProps) {
  const { register, handleSubmit, errors, isSubmitting, formError, fields, append, remove } =
    useAdminOptionGroupForm({ group, groupOptions, onSuccess: onSaved });

  return (
    <Modal open={open} onClose={onClose} labelledBy="admin-option-group-form-title">
      <form onSubmit={handleSubmit} noValidate className="grid gap-4 overflow-y-auto p-5 sm:p-6">
        <h2 id="admin-option-group-form-title" className="font-display text-xl text-ink">
          {group ? OPTION_GROUP_FORM_TITLE.edit : OPTION_GROUP_FORM_TITLE.create}
        </h2>

        <TextField label={OPTION_GROUP_FORM_LABELS.name} error={errors.name?.message} {...register("name")} />
        <SelectField label={OPTION_GROUP_FORM_LABELS.selectionType} {...register("selectionType")}>
          <option value="single">Single select</option>
          <option value="multiple">Multi select</option>
        </SelectField>
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label={OPTION_GROUP_FORM_LABELS.minSelect}
            type="number"
            error={errors.minSelect?.message}
            {...register("minSelect", { valueAsNumber: true })}
          />
          <TextField
            label={OPTION_GROUP_FORM_LABELS.maxSelect}
            type="number"
            error={errors.maxSelect?.message}
            {...register("maxSelect", { valueAsNumber: true })}
          />
        </div>
        <Checkbox label={OPTION_GROUP_FORM_LABELS.isRequired} {...register("isRequired")} />

        <div className="grid gap-2.5">
          <span className="text-[13.5px] font-semibold text-ink-muted">{OPTION_GROUP_FORM_LABELS.options}</span>
          {errors.options?.message && <span className="text-xs text-clay">{errors.options.message}</span>}
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-2.5 rounded-md border border-border p-3">
              <TextField
                label={OPTION_GROUP_FORM_LABELS.optionName}
                error={errors.options?.[index]?.name?.message}
                {...register(`options.${index}.name` as const)}
              />
              <TextField
                label={OPTION_GROUP_FORM_LABELS.priceModifier}
                type="number"
                step="0.01"
                error={errors.options?.[index]?.priceModifier?.message}
                {...register(`options.${index}.priceModifier` as const, { valueAsNumber: true })}
              />
              <div className="flex items-center justify-between gap-2.5">
                <Checkbox
                  label={OPTION_GROUP_FORM_LABELS.isAvailable}
                  {...register(`options.${index}.isAvailable` as const)}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs font-semibold text-clay underline underline-offset-[3px]"
                  >
                    {OPTION_GROUP_FORM_LABELS.removeOption}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ name: "", priceModifier: 0, isAvailable: true })}
            className="justify-self-start rounded-pill border border-border-strong px-4 py-2 text-[13px] font-semibold text-ink hover:bg-sunken"
          >
            {OPTION_GROUP_FORM_LABELS.addOption}
          </button>
        </div>

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
