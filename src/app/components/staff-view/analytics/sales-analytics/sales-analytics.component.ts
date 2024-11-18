import { Component } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { meAPIUtility } from '../../../../shared/site-variables';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { getTasks } from '../../../../shared/custom_dtypes/tasks';
import { HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { getSales, sale } from '../../../../shared/custom_dtypes/sales';
import { SalesMoreInfoComponent } from '../../../shared/dialog-box/sales-more-info/sales-more-info.component';

@Component({
  selector: 'app-sales-analytics',
  templateUrl: './sales-analytics.component.html',
  styleUrl: './sales-analytics.component.css'
})
export class SalesAnalyticsComponent {
  constructor(
    private taskService: TaskManagementService,
    private meUtility: meAPIUtility,
    private customerService: CustomersService,
    private matdialog: MatDialog
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
  public saleInvoiceTableColumns: string[] = ['sl_no', 'customer', 'invoice_number', 'total_amount', 'discount', 'received_amount', 'locality', 'recorded_by', 'more']
  
  length = 50;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [50, 100, 150];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;


  public clientType = [
    { typeId: 2, typeName: 'B2B' },
    { typeId: 1, typeName: 'B2C' }
  ]
  public customerList: customer[] = []
  public organizationId!: number
  public selectByModifiedDate = false
  
  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
        this.fetchSalesAnalytics()
        this.fetchCustomer()
      }
    )
  }

  fetchSalesAnalytics() {
    let body: getSales = {
      time_frame: this.selectedTimeFrame,
      offset: this.pageIndex * this.pageSize,
      count: this.pageIndex * this.pageSize + this.pageSize,
      get_modified_records: this.selectByModifiedDate
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
      String(this.organizationId)
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

  openMoreInfoWindow(row: sale){
    this.matdialog.open(SalesMoreInfoComponent, { data: row} )
  }
}
