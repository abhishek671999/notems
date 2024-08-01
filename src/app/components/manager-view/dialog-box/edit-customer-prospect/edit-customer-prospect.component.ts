import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { editCustomer } from '../../../../shared/custom_dtypes/customers';
import { sessionWrapper } from '../../../../shared/site-variables';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-edit-customer-prospect',
  templateUrl: './edit-customer-prospect.component.html',
  styleUrl: './edit-customer-prospect.component.css'
})
export class EditCustomerProspectComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomersService,
    private formBuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<EditCustomerProspectComponent>
  ) {
    this.editCustomerForm = this.formBuilder.group({
      outlet_name: [data.customer.outlet_name, [Validators.required]],
      contact_person: [data.customer.contact_person, [Validators.required]],
      mobile: [data.customer.mobile, Validators.required],
      note: [data.customer.note]
    })
   }

  public editCustomerForm: FormGroup;


  editCustomer() {
    let body: editCustomer = {
      "type": this.data.type, // 1 refers to customer, 2 refers to prospects
      "customer_id": this.data.customer.customer_id,
      "outlet_name": this.editCustomerForm.value.outlet_name,
      "contact_person": this.editCustomerForm.value.contact_person,
      "mobile": this.editCustomerForm.value.mobile,
      "note": this.editCustomerForm.value.note,
      "organization_id": Number(this.sessionWrapper.getItem('organization_id'))
    }
    this.customerService.addCustomer(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg:  `${this.getTypeString} edit successfully` } })
        this.matDialogRef.close()
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, {data: {msg: error.error.error}})
      }
    )
  }

  getTypeString() {
    return {
      '1': 'Customer',
      '2': 'Prospect'
    }[Number(this.data.type)]
  }

  close() {
    // this.matDialogRef.close()
  }

}
