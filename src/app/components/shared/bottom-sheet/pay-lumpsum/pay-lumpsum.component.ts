import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { customer, payCustomerPendingAmount } from '../../../../shared/custom_dtypes/customers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../../../shared/services/customer/customers.service';

@Component({
  selector: 'app-pay-lumpsum',
  templateUrl: './pay-lumpsum.component.html',
  styleUrl: './pay-lumpsum.component.css'
})
export class PayLumpsumComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: customer,
    private formbuilder: FormBuilder,
    private customerService: CustomersService,
    private matsheetRef: MatBottomSheetRef<PayLumpsumComponent>
  ){
    this.payLumpSumForm = this.formbuilder.group({
      customer_id: [data.customer_id, [Validators.required]],
      paid_amount: [data.pending_amount, [Validators.required, Validators.max(data.pending_amount)]]
    })
  }

  public payLumpSumForm: FormGroup;

  payLumpSumAmount(){
    let body: payCustomerPendingAmount = {
      customer_id: this.payLumpSumForm.value.customer_id,
      paid_amount: this.payLumpSumForm.value.paid_amount
    }
    this.customerService.paylumpsumAmount(body).subscribe(
      (data: any) => {
        this.matsheetRef.dismiss({result: true})
      },
      (error: any) => {
        console.log('Failed to update amount')
      }
    )
  }

}
