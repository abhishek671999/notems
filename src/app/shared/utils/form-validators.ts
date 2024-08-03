import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function sixDigitValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const valid = /^\d{6}$/.test(value);
    return valid ? null : { 'sixDigit': { value } };
  };
}

export const atLeastOne = (validator: ValidatorFn, controls: string[] | null = null) => (group: FormGroup): ValidationErrors | null => {
  if (!controls) {
    controls = Object.keys(group.controls)
  }
  const hasAtLeaseOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]))
  
  return hasAtLeaseOne ? null : {
    atLeastOne: true
  }
}