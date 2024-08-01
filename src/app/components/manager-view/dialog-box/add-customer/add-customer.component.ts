import { Component, Inject } from '@angular/core';
import { addCustomer } from '../../../../shared/custom_dtypes/customers';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sessionWrapper } from '../../../../shared/site-variables';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {

  constructor(
    private customerService: CustomersService,
    private formbuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<AddCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.newCustomerForm = this.formbuilder.group({
      outlet_name: ['', [Validators.required]],
      contact_person: ['', [Validators.required]],
      mobile: ['', Validators.required],
      note: ['']
    })
  }
  public newCustomerForm: FormGroup;

  addCustomer() {
    let body: addCustomer = {
      "type": this.data.type, // 1 refers to customer, 2 refers to prospects
      "outlet_name": this.newCustomerForm.value.outlet_name,
      "contact_person": this.newCustomerForm.value.contact_person,
      "mobile": this.newCustomerForm.value.mobile,
      "note": this.newCustomerForm.value.note,
      "organization_id": Number(this.sessionWrapper.getItem('organization_id'))
    }
    this.customerService.addCustomer(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg: `${this.getTypeString()} added successfully` } })
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
    this.matDialogRef.close()
  }
}
