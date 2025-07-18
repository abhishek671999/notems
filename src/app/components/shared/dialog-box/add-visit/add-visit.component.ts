import { Component, Inject, ViewChild } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { addTask } from '../../../../shared/custom_dtypes/tasks';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../success-msg/success-msg.component';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';
import { beat } from '../../../../shared/custom_dtypes/beats';
import { AddCustomerComponent } from '../add-customer/add-customer.component';

@Component({
  selector: 'app-add-visit',
  templateUrl: './add-visit.component.html',
  styleUrl: './add-visit.component.css'
})
export class AddVisitComponent {

  @ViewChild('addTaskButton') editTaskButton: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskManagementService,
    private formBuilder: FormBuilder,
    private matdialog: MatDialog,
    private matdialogRef: MatDialogRef<AddVisitComponent>
  ) {
    console.log(this.data.customerList)
    this.newTask = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      note: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]]
    })
    this.customerList = this.data.customerList
    this.visibleCustomerList = this.customerList
    this.beatId = this.data.beatId
   }

  private beatId: number;
  public visibleCustomerList: customer[] = []
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


  addTask() {
    this.editTaskButton._elementRef.nativeElement.disabled = true
    let body: addTask = {
      "customer_id": this.newTask.value.customer_id,
      "beat_id": this.beatId,
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
        this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Failed to add task'} } );
        this.editTaskButton._elementRef.nativeElement.disabled = false
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


  onKey(event: Event) { 
    let searchText: string = (event.target as HTMLInputElement).value
    this.visibleCustomerList = this.search(searchText);
  }


  search(value: any) { 
    let filter = value.toLowerCase();
    return this.customerList.filter((customer: customer) => customer.customer_name?.toLowerCase().startsWith(filter));
  }

    addCustomer() {
    let dialogRef = this.matdialog.open(AddCustomerComponent, {
      data: { type: 1 },
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      console.log('added')
    });
  }

}
