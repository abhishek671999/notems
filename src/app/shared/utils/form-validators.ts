import { AbstractControl, ValidatorFn } from '@angular/forms';

export function sixDigitValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const valid = /^\d{6}$/.test(value);
    return valid ? null : { 'sixDigit': { value } };
  };
}