import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


export function addSalesDiscountValidation(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
      const receivedAmount = form.get("received_amount")?.value;
      const discount = form.get("discount")?.value;
      const amount = form.get('amount')?.value

      if (receivedAmount && discount && amount) {
          console.log('received amoumt', receivedAmount, 'discount', discount, 'amount', amount)
          return discount <= (amount - receivedAmount) ? null : {incorrectDiscount:true};
      }

      return null;
  }
}


export function addSalesReceievedAmountValidation(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {

      const receivedAmount = form.get("received_amount")?.value;
      const sellingPrice = form.get('selling_price')?.value

      if (receivedAmount && sellingPrice) {
        if(typeof(receivedAmount)==='number' && receivedAmount < 0){
          return  {lessThanZero:true}
        }
        return receivedAmount <= sellingPrice ? null : {incorrectReceivedAmount:true};
      }

      return null;
  }
}

export function salesNewReceievedAmountValidation(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {

      const receivedAmount = form.get("received_amount")?.value;
      const sellingPrice = form.get('selling_price')?.value
      const newReceivedAmount = form.get('new_received_amount')?.value
      const discount = form.get('discount')?.value

      console.log('Received amount: ', receivedAmount, 'selling price: ', sellingPrice, 'new received amount: ', newReceivedAmount, 'discount: ', discount)
      if(typeof(receivedAmount)==='number' && newReceivedAmount < 0){
        return  {lessThanZero:true}
      }
      else if (typeof(receivedAmount)==='number' && typeof(sellingPrice)==='number' && typeof(newReceivedAmount)==='number') {
      console.log(receivedAmount + newReceivedAmount, sellingPrice)
          return receivedAmount + newReceivedAmount <= sellingPrice ? null : {incorrectReceivedAmount:true};
      }

      return null;
  }
}

export function salesSellingPriceValidation(): ValidatorFn {
  return (form: AbstractControl) : ValidationErrors | null => {

    const sellingPrice = form.get('selling_price')?.value;
    const amount = form.get('amount')?.value; 
    console.log('selling price', sellingPrice, 'amount', amount)

    if(sellingPrice && amount){
      return sellingPrice <= amount? null : {incorrectSellingAmount: true}
    }
    return null
  }
}