import { Component, Inject } from '@angular/core';
import { addCustomer } from '../../../../shared/custom_dtypes/customers';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sessionWrapper } from '../../../../shared/site-variables';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { LocalityService } from '../../../../shared/services/locality/locality.service';
import { HttpParams } from '@angular/common/http';
import { locality } from '../../../../shared/custom_dtypes/locality';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {

  constructor(
    private customerService: CustomersService,
    private localityService: LocalityService,
    private formbuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<AddCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.newCustomerForm = this.formbuilder.group({
      outlet_name: ['', [Validators.required]],
      contact_persons_details: this.formbuilder.array([this.formbuilder.group({
        'contact_person_name': ['', [Validators.required]],
        'email_or_phone': ['', [Validators.required]]
      })]),
      type: ['', [Validators.required] ],
      locality_id: ['', [Validators.required]],
      note: [''],
      gst_no: [''],
      address: [''],
    })
  }
  public newCustomerForm: FormGroup;

  public clientType = [
    { typeId: 2, typeName: 'B2B' },
    { typeId: 1, typeName: 'B2C' }
  ]

  localityList: locality[] = []

  ngOnInit(){
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

  contactPersonsFormArray(): FormArray{
    return this.newCustomerForm.get('contact_persons_details') as FormArray;
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

  addCustomer() {
    let body: addCustomer = {
      "type": this.data.type, // 1 refers to customer, 2 refers to prospects
      "outlet_name": this.newCustomerForm.value.outlet_name,
      "contact_persons_details": this.newCustomerForm.value.contact_persons_details,
      "locality_id": this.newCustomerForm.value.locality_id,
      "note": this.newCustomerForm.value.note,
      "gst_no": this.newCustomerForm.value.gst_no,
      "address": this.newCustomerForm.value.address,
      "organization_id": Number(this.sessionWrapper.getItem('organization_id'))
    }
    this.customerService.addCustomer(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg: `${this.getTypeString()} added successfully` } })
        this.matDialogRef.close()
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, {data: {msg: error.error.description}})
      }
    )
  }

  getTypeString() {
    return {
      '1': 'Customer',
      '2': 'Prospect'
    }[Number(this.data.type)]
  }


}
