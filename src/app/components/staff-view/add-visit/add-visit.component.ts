import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../shared/services/taskmanagement/task-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../../shared/services/customer/customers.service';
import { sessionWrapper } from '../../../shared/site-variables';
import { customer } from '../../../shared/custom_dtypes/customers';
import { addTask, getTasks } from '../../../shared/custom_dtypes/tasks';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../shared/dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-add-visit',
  templateUrl: './add-visit.component.html',
  styleUrl: './add-visit.component.css'
})
export class AddVisitComponent {
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService,
    private customerService: CustomersService,
    private formBuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private matdialog: MatDialog
  ) {
    this.newTask = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      note: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]]
    })
   }
  private beatId = 0
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
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
    // httpParams = httpParams.append('type', 2) //hardcode
    this.customerService.getCustomer(httpParams).subscribe(
      (data: any) => {
        this.customerList = data['customers']
      },
      (error: any) => console.log(error)
    )

    this.route.params.subscribe((params: Params) => {
      this.beatId = params['beat_id']
      let body: getTasks = {
        beat_id: this.beatId
      }
      this.taskService.getTasks(body).subscribe(
        (data: any) => {
          console.log('data', data)
        },
        (error: any) => console.log(error)
      )
    })
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
        this.ngOnInit()
      },
      (error: any) => {
        this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Failed to add task'}})
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
