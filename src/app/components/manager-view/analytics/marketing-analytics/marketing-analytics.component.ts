import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { PageEvent } from '@angular/material/paginator';
import { getTasks } from '../../../../shared/custom_dtypes/tasks';
import { FormControl, FormGroup } from '@angular/forms';
import { sessionWrapper } from '../../../../shared/site-variables';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { teamMember } from '../../../../shared/custom_dtypes/team';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { MapViewComponent } from '../../../shared/dialog-box/map-view/map-view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-marketing-analytics',
  templateUrl: './marketing-analytics.component.html',
  styleUrl: './marketing-analytics.component.css'
})
export class MarketingAnalyticsComponent {

  constructor(
    private teamMembersService: TeamManagementService,
    private taskService: TaskManagementService,
    private customerService: CustomersService,
    private sessionWrapper: sessionWrapper,
    private matdialog: MatDialog
  ) { }
  
  public tasksInvoiceDatasource: [] = []
  public tasksInvoiceTableColumns: string[] = ['sl_no', 'customer', 'added_by', 'created_at', 'title', 'status', 'location', 'description', 'note']


  timeFrames = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'Yesterday', actualValue: 'yesterday' },
    { displayValue: 'This week', actualValue: 'this_week' },
    { displayValue: 'This month', actualValue: 'this_month' },
    { displayValue: 'Last month', actualValue: 'last_month' },
    { displayValue: 'Last 3 months', actualValue: 'last_3_months' },
    { displayValue: 'Last 6 months', actualValue: 'last_6_months' },
    { displayValue: 'This year', actualValue: 'this_year' },
    { displayValue: 'Calendar', actualValue: 'custom' },
  ];
  
  public selectedTimeFrame = this.timeFrames[0].actualValue
  public selectedCustomerType = ''
  public selectedCustomer = ''
  public selectedFromDate = ''
  public selectedToDate = ''
  public selectedRepresentative = ''
  
  length = 50;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [5, 20, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;


  public clientType = [
    { typeId: 2, typeName: 'B2B' },
    { typeId: 1, typeName: 'B2C' }
  ]

  public customerList: customer[] = []
  public teamMembers: teamMember[] = [];


  ngOnInit() {
    this.fetchTeamMembers()
    this.fetchTasksAnalytics()
    this.fetchCustomer()
  }
  
  
  fetchTeamMembers(){
    let httpParams = new HttpParams()
    this.teamMembersService.getUsers(httpParams).subscribe(
      (data: any) => {
        this.teamMembers = data['users']
      },
      (error: any) => {
        alert('Failed to fetch team members')
      }
    )
  }

  fetchCustomer() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      String(this.sessionWrapper.getItem('organization_id'))
    );
    if (this.selectedCustomerType) {
      httpParams = httpParams.append('type', this.selectedCustomerType)
    }
    this.customerService.getCustomer(httpParams).subscribe((data: any) => {
      this.customerList = data['customers'];
    });
  }

  fetchTasksAnalytics() {
    let body: getTasks = {
      time_frame: this.selectedTimeFrame,
      offset: this.pageIndex * this.pageSize,
      count: this.pageIndex * this.pageSize + this.pageSize
    }
    if (this.selectedCustomer) body.customer_id = Number(this.selectedCustomer)
    if (this.selectedCustomerType) body.type = Number(this.selectedCustomerType)
      if (this.selectedRepresentative) body.added_by = Number(this.selectedRepresentative)
    if (this.selectedTimeFrame == 'custom') {
      if (this.selectedFromDate && this.selectedToDate) {
        body['from_date'] = this.selectedFromDate
        body['to_date'] = this.selectedToDate
      }
      else {
        body = {}
      }
    }
    
    if (Object.keys(body).length > 0) {
      this.taskService.getTasks(body).subscribe(
        (data: any) => {
          this.tasksInvoiceDatasource = data['tasks']
          this.length = data['total_count']

        },
        (alert: any) => alert('Failed to fetch tasks')
      )
    }
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchTasksAnalytics();
  } 

  openLocationScreen(attendence: any) {
    let location = attendence.split(',');
    this.matdialog.open(MapViewComponent, {
      data: { longitude: location[1], latitude: location[0] },
    });
  }
}
