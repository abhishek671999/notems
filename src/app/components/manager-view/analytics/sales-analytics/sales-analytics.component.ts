import { Component } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { sessionWrapper } from '../../../../shared/site-variables';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { teamMember } from '../../../../shared/custom_dtypes/team';
import { getSales } from '../../../../shared/custom_dtypes/sales';

@Component({
  selector: 'app-sales-analytics',
  templateUrl: './sales-analytics.component.html',
  styleUrl: './sales-analytics.component.css'
})
export class SalesAnalyticsComponent {
  constructor(
    private taskService: TaskManagementService,
    private teamMembersService: TeamManagementService,
    private sessionWrapper: sessionWrapper,
    private customerService: CustomersService
  ) { }

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

  public totalAmount = 0
  public discount = 0
  public totalAmountReceived = 0
  
  public saleInvoiceDatasource: [] = []
  public saleInvoiceTableColumns: string[] = ['sl_no', 'customer', 'total_amount', 'discount', 'received_amount', 'recorded_by']
  public teamMembers: teamMember[] = []

  length = 50;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [5, 20, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  public clientType = [
    { typeId: 2, typeName: 'B2B' },
    { typeId: 1, typeName: 'B2C' }
  ]
  public customerList: customer[] = []

  
  ngOnInit() {
    this.fetchCustomer()
    this.fetchSalesAnalytics()
    this.fetchTeamMembers()
    
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

  fetchSalesAnalytics() {
    let body: getSales = {
      time_frame: this.selectedTimeFrame,
      offset: this.pageIndex * this.pageSize,
      count: this.pageIndex * this.pageSize + this.pageSize
    }
    if (this.selectedCustomer) body.customer_id = Number(this.selectedCustomer)
    if (this.selectedCustomerType) body.type = Number(this.selectedCustomerType)
    if (this.selectedRepresentative) body.recorded_by = Number(this.selectedRepresentative)
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
      this.taskService.getSales(body).subscribe(
        (data: any) => {
          this.saleInvoiceDatasource = data['sale_invoices']
          this.length = data['total_count']
          this.totalAmount = data['total_amount']
          this.discount = data['total_discount']
          this.totalAmountReceived = data['total_amount_received']
        },
        (error: any) => {
          console.log(error)
        }
      )
    }
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

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchSalesAnalytics();
  }
}
