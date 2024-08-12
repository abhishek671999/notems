import { Component } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { FormControl, FormGroup } from '@angular/forms';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { getTasks } from '../../../../shared/custom_dtypes/tasks';
import { HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-sales-analytics',
  templateUrl: './sales-analytics.component.html',
  styleUrl: './sales-analytics.component.css'
})
export class SalesAnalyticsComponent {
  constructor(
    private taskService: TaskManagementService,
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

  public totalAmount = 0
  public discount = 0
  public totalAmountReceived = 0
  
  public saleInvoiceDatasource: [] = []
  public saleInvoiceTableColumns: string[] = ['sl_no', 'customer', 'total_amount', 'discount', 'received_amount', 'recorded_by']
  
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
    this.fetchSalesAnalytics()
    
  }

  fetchSalesAnalytics() {
    let body: getTasks = {
      time_frame: this.selectedTimeFrame,
      offset: this.pageIndex * this.pageSize,
      count: this.pageIndex * this.pageSize + this.pageSize
    }
    if (this.selectedCustomer) body.customer_id = Number(this.selectedCustomer)
    if (this.selectedCustomerType) body.type = Number(this.selectedCustomerType)
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
