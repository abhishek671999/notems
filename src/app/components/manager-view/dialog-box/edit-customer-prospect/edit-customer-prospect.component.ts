import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { editCustomer } from '../../../../shared/custom_dtypes/customers';
import { sessionWrapper } from '../../../../shared/site-variables';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { locality } from '../../../../shared/custom_dtypes/locality';
import { HttpParams } from '@angular/common/http';
import { LocalityService } from '../../../../shared/services/locality/locality.service';

@Component({
  selector: 'app-edit-customer-prospect',
  templateUrl: './edit-customer-prospect.component.html',
  styleUrl: './edit-customer-prospect.component.css'
})
export class EditCustomerProspectComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomersService,
    private formbuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<EditCustomerProspectComponent>,
    private localityService: LocalityService
  ) {

    console.log('This is type: ', data)

    this.editCustomerForm = this.formbuilder.group({
      outlet_name: [data.customer.outlet_name, [Validators.required]],
      contact_persons_details: this.formbuilder.array([], [Validators.required]),
      type: [data.type],
      note: [data.customer.note],
      gst_no: [data.customer.gst_no],
      address: [data.customer.address],
      locality_id: [data.customer.locality_id]
    })

    data.customer.contact_persons_details.forEach((contact: any) => {
      this.contactPersonsFormArray().push(this.formbuilder.group(contact))
    })
   }

  public editCustomerForm: FormGroup;
  localityList: locality[] = []

  public clientType = [
    { typeId: 2, typeName: 'B2B' },
    { typeId: 1, typeName: 'B2C' }
  ]



  ngOnInit() {
    this.fetchLocalities()
  }

  fetchLocalities(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
    this.localityService.getLocalities(httpParams).subscribe(
      (data: any) => {
        this.localityList = data['localities']
      },
      (error: any) => {
        alert('Failed to fetch localities')
      }
    )
  }

  editCustomer() {
    let body: editCustomer = {
      "customer_id": this.data.customer.customer_id,
      "outlet_name": this.editCustomerForm.value.outlet_name,
      "contact_persons_details": this.editCustomerForm.value.contact_persons_details,
      "type": this.editCustomerForm.value.type,
      "note": this.editCustomerForm.value.note,
      "gst_no": this.editCustomerForm.value.gst_no,
      "locality_id": this.editCustomerForm.value.locality_id,
      "address": this.editCustomerForm.value.address,
      "organization_id": Number(this.sessionWrapper.getItem('organization_id'))
    }
    this.customerService.editCustomer(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg:  `${this.getTypeString()} edited successfully` } })
        this.matDialogRef.close({result: true})
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

  contactPersonsFormArray(): FormArray{
    return this.editCustomerForm.get('contact_persons_details') as FormArray;
  }

  addContactPersonsDetailsControl() {
    this.contactPersonsFormArray().push(
      this.formbuilder.group({
        'contact_person_name': ['', [Validators.required]],
        'email_or_phone': ['', [Validators.required]]
      })
    )
  }

  removeContactPersonsDetailsControl(index: number) {
    this.contactPersonsFormArray().removeAt(index)
  }


}
