import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { sale } from '../../../../shared/custom_dtypes/sales';
import { addSalesReceievedAmountValidation, salesNewReceievedAmountValidation, salesSellingPriceValidation } from '../../../../shared/custom_validations/sales';
import { editSaleInvoiceHeader } from '../../../../shared/custom_dtypes/tasks';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';

@Component({
  selector: 'app-update-pending-amount',
  templateUrl: './update-pending-amount.component.html',
  styleUrl: './update-pending-amount.component.css'
})
export class UpdatePendingAmountComponent {


  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private formbuilder: FormBuilder,
    private taskService: TaskManagementService,
    public matbottomSheetRef: MatBottomSheetRef<UpdatePendingAmountComponent>
  ){
    this.saleData = data.sale
    this.editSalesForm = this.formbuilder.group({
      customer_id: [this.saleData.customer_id, [Validators.required]],
      invoice_number: [this.saleData.invoice_number, [Validators.required]],
      selling_price: [this.saleData.total_amount, [Validators.required]],
      received_amount: [this.saleData.received_amount, [Validators.required]],
      new_received_amount: ['', [Validators.required]],
      note: [this.saleData.note,],
      amount: [this.saleData.total_amount + this.saleData.discount]
    },{
      validators: [addSalesReceievedAmountValidation(), salesSellingPriceValidation(), salesNewReceievedAmountValidation()]
    });
  }

  public editSalesForm: FormGroup;
  public saleData: sale;

  editReceivedamount(){
    let body: editSaleInvoiceHeader = {
      invoice_id: this.saleData.invoice_id,
      invoice_number: this.saleData.invoice_number,
      customer_id: this.editSalesForm.value.customer_id,
      discount: this.editSalesForm.value.amount - this.editSalesForm.value.selling_price,
      received_amount: this.editSalesForm.value.received_amount + this.editSalesForm.value.new_received_amount,
      note: this.editSalesForm.value.note,
      beat_id: this.saleData.beat_id
    }
    this.taskService.editSaleInvoiceHeader(body).subscribe(
      (data: any) => {
        this.matbottomSheetRef.dismiss({result: true})
      }
    )
  }
}
