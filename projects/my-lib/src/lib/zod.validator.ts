import z from 'zod'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function zodFieldValidator<T extends z.ZodTypeAny>(
  schema: T,
  field: keyof z.infer<T>
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;

    if (!parent) return null;

    const formValues = parent.getRawValue?.() ?? { [field]: control.value };

    const parsed = schema.safeParse(formValues);
    if (parsed.success) return null;

    const issue = parsed.error.issues.find((i) => i.path[0] === field);
    return issue ? { zodError: issue.message } : null;
  };
}
