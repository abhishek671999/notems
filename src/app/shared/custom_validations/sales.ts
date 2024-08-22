import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


export function addSalesDiscountValidation(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
      const receivedAmount = form.get("received_amount")?.value;
      const discount = form.get("discount")?.value;
      const amount = form.get('amount')?.value

      if (receivedAmount && discount && amount) {
          console.log(receivedAmount, discount, amount)
          return discount < amount - receivedAmount ? null : {incorrectDiscount:true};
      }

      return null;
  }
}


export function addSalesReceievedAmountValidation(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {

      const receivedAmount = form.get("received_amount")?.value;
      const amount = form.get('amount')?.value

      if (receivedAmount && amount) {
  
          return amount > receivedAmount ? null : {incorrectReceivedAmount:true};
      }

      return null;
  }
}