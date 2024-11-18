import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskManagementService } from '../../../shared/services/taskmanagement/task-management.service';
import { CustomersService } from '../../../shared/services/customer/customers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { meAPIUtility } from '../../../shared/site-variables';
import { MatDialog } from '@angular/material/dialog';
import { beat } from '../../../shared/custom_dtypes/beats';
import { customer } from '../../../shared/custom_dtypes/customers';
import { HttpParams } from '@angular/common/http';
import { getTasks, task } from '../../../shared/custom_dtypes/tasks';
import { EditVisitsInfoComponent } from '../../shared/dialog-box/edit-visits-info/edit-visits-info.component';
import { AddVisitComponent } from '../../shared/dialog-box/add-visit/add-visit.component';
import { MapViewComponent } from '../../shared/dialog-box/map-view/map-view.component';
import { dateUtils } from '../../../shared/utils/date_utils';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.css'
})
export class VisitsComponent {
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService,
    private customerService: CustomersService,
    private formBuilder: FormBuilder,
    private meUtility: meAPIUtility,
    private matdialog: MatDialog,
    private router: Router,
    private dateUtils: dateUtils
  ) {
    this.newTask = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      note: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]]
    })
   }

  public beatId = 0

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

  public selectedDate = new Date()
  public visitsDataSource: task[] = []
  public visitsTableColumns: string[] = ['sl_no', 'type_name', 'customer', 'status', 'added_by', 'description', 'location', 'edit']

  public salesInvoiceTableColumns: string[] = []
  public organizationId!: number

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.beatId = params['beat_id']
      this.meUtility.getCommonData().subscribe(
        (data: any) => {
          this.organizationId = data['organization_id']
          this.fetchBeatInfo()
          this.fetchTasks()
        }
      )
    })

  }

  fetchCustomers(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.organizationId))
    this.customerService.getCustomer(httpParams).subscribe(
      (data: any) => {
        this.customerList = data['customers']
      },
      (error: any) => console.log(error)
    )
  }

  addTask() {
    let matdialogRef = this.matdialog.open(AddVisitComponent, {
      height: 'auto', width: '90%',
      data: {beatId: this.beatId, customerList: this.beatInfo?.customers}
    })
    matdialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.result) this.ngOnInit()
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

  fetchTasks(){
    let body: getTasks = {
      beat_id: this.beatId
    }
    if(this.selectedDate) body['date'] = this.dateUtils.getStandardizedDateFormate(new Date(this.selectedDate))
    this.taskService.getTasks(body).subscribe(
      (data: any) => {
        this.visitsDataSource = data['tasks']
      },
      (error: any) => console.log(error)
    )
  }

  editVisits(visit: task){
    let matdialogRef = this.matdialog.open(EditVisitsInfoComponent, {data: {visit: visit, customerList: this.beatInfo?.customers}})
    matdialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.result){
          this.ngOnInit()
        }
      }
    )
  }

  openLocationScreen(attendence: any) {
    let location = attendence.split(',');
    this.matdialog.open(MapViewComponent, {
      data: { longitude: location[1], latitude: location[0] },
    });
  }

}
