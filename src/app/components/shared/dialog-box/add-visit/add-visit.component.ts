import { HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { addTask, getTasks } from '../../../../shared/custom_dtypes/tasks';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../success-msg/success-msg.component';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';
import { beat } from '../../../../shared/custom_dtypes/beats';

@Component({
  selector: 'app-add-visit',
  templateUrl: './add-visit.component.html',
  styleUrl: './add-visit.component.css'
})
export class AddVisitComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskManagementService,
    private customerService: CustomersService,
    private formBuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private matdialog: MatDialog,
    private matdialogRef: MatDialogRef<AddVisitComponent>
  ) {
    this.newTask = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      note: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]]
    })

    this.beatId = this.data.beatId
   }

  private beatId: number;

  public beatInfo: beat | undefined;
  public newTask: FormGroup;
  public customerList: customer[] = []
  public location: string = ''
  public availableStatus = [
    'New outlet',
    'Follow up call', 
    'Product Demo' ,
    'Regular visit' ,
    'Payment issue' ,
    'Product complaint', 
    'Filter complaint']

  ngOnInit() {
    this.fetchCustomers()
    this.fetchBeatInfo()
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

  addTask() {
    let body: addTask = {
      "customer_id": this.newTask.value.customer_id,
      "beat_id": this.beatId,
      "title": this.newTask.value.title,
      "note": this.newTask.value.note,
      "description": this.newTask.value.description,
      "location": this.location,
      "status": this.newTask.value.status
    }
    this.taskService.addTask(body).subscribe(
      (data: any) => {
        this.matdialog.open(SuccessMsgComponent, { data: { msg: 'Task added successfully' } })
        this.matdialogRef.close({result: true})
      },
      (error: any) => {
        this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Failed to add task'}})
      }
    )
  }

  fetchBeatInfo(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('beat_id', this.beatId)
    this.taskService.getDailyBeats(httpParams).subscribe(
      (data: any) => {
        this.beatInfo = data['beats'].length > 0? data['beats'][0] : []
      },
      (error: any) => {
        alert('Failed to fetch beat info')
      }
    )
  }


  fetchLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location = `${position.coords.latitude},${position.coords.longitude}`
      })
    } else {
      alert('Failed to fetch location')
     }
  }

}
