import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { editTask } from '../../../../shared/custom_dtypes/tasks';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../../shared/site-variables';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { SuccessMsgComponent } from '../success-msg/success-msg.component';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';

@Component({
  selector: 'app-edit-visits-info',
  templateUrl: './edit-visits-info.component.html',
  styleUrl: './edit-visits-info.component.css'
})
export class EditVisitsInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskManagementService,
    private customerService: CustomersService,
    private formBuilder: FormBuilder,
    private matdialogRef: MatDialogRef<EditVisitsInfoComponent>,
    private sessionWrapper: sessionWrapper,
    private matdialog: MatDialog

  ){
    console.log(data)
    this.editVisitForm = this.formBuilder.group({
      customer_id: [data.visit.customer_id, [Validators.required]],
      title: [data.visit.title, [Validators.required]],
      note: [data.visit.note, [Validators.required]],
      description: [data.visit.description, [Validators.required]],
      status: [data.visit.status_id, [Validators.required]]
    })
  }

  public editVisitForm: FormGroup;
  public customerList: customer[] = []
  public locationCoordinates: string = ''

  public availableStatus = [
    'New outlet',
    'Follow up call', 
    'Product Demo' ,
    'Regular visit' ,
    'Payment issue' ,
    'Product complaint', 
    'Filter complaint'
  ]

  ngOnInit(){
    this.fetchCustomers()
  }

  fetchLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.locationCoordinates = `${position.coords.latitude},${position.coords.longitude}`
      })
    } else {
      alert('Failed to fetch location')
     }
  }

  fetchCustomers(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
    this.customerService.getCustomer(httpParams).subscribe(
      (data: any) => {
        this.customerList = data['customers']
      },
      (error: any) => console.log(error)
    )
  }


  editTask(){
    let body: editTask = {
      task_id: this.data.visit.task_id,
      customer_id: this.editVisitForm.value.customer_id,
      beat_id: this.data.visit.beat_id,
      title: this.editVisitForm.value.title,
      note: this.editVisitForm.value.note,
      description: this.editVisitForm.value.description,
    }
    this.taskService.editTask(body).subscribe(
      (data: any) => {
        this.matdialog.open(SuccessMsgComponent, {data: {msg: 'Updated successfully'}})
        this.matdialogRef.close({result: true})
      },
      (error: any) => {
        this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Failed to update'}})
      }
    )
  }
}
