import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { editTask } from '../../../../shared/custom_dtypes/tasks';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
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
    private formBuilder: FormBuilder,
    private matdialogRef: MatDialogRef<EditVisitsInfoComponent>,
    private matdialog: MatDialog

  ){
    console.log(data)
    this.editVisitForm = this.formBuilder.group({
      customer_id: [data.visit.customer_id, [Validators.required]],
      note: [data.visit.note, [Validators.required]],
      description: [data.visit.description, [Validators.required]],
      status: [data.visit.status_id, [Validators.required]]
    })
    this.customerList = this.data.customerList
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


  fetchLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.locationCoordinates = `${position.coords.latitude},${position.coords.longitude}`
      })
    } else {
      alert('Failed to fetch location')
     }
  }

  editTask(){
    let body: editTask = {
      task_id: this.data.visit.task_id,
      customer_id: this.editVisitForm.value.customer_id,
      beat_id: this.data.visit.beat_id,
      note: this.editVisitForm.value.note,
      description: this.editVisitForm.value.description,
      status: this.editVisitForm.value.status
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
