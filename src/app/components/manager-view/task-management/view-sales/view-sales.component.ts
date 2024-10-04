import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { MatDialog } from '@angular/material/dialog';
import { SalesMoreInfoComponent } from '../../../shared/dialog-box/sales-more-info/sales-more-info.component';
import { sale } from '../../../../shared/custom_dtypes/sales';
import { beat } from '../../../../shared/custom_dtypes/beats';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SharedModulesModule } from '../../../shared/shared-modules/shared-modules.module';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrl: './view-sales.component.css',
})
export class ViewSalesComponent {

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService,
    private customerService: CustomersService,
    private sessionWrapper: sessionWrapper,
    private matdialog: MatDialog,
    private dateUtils: dateUtils
  ) { }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  private _liveAnnouncer = inject(LiveAnnouncer);

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
  public selectedCustomer = ''
  public selectedFromDate = ''
  public selectedToDate = ''
  public customerList: customer[] = []
  public visibleCustomerList: customer[] = []

  public beatId: number = 0;
  public salesSource = new MatTableDataSource()
  public selectedDate = new Date()
  public salesSourceColumns = ['sl_no', 'customer', 'invoice_number', 'total_amount', 'discount', 'received_amount', 'pending_amount', 'recorded_by', 'recorded_at', 'note', 'more']
  public beatInfo: beat | undefined

  length = 50;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [50, 100, 150];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  public totalAmount = 0
  public discount = 0
  public totalAmountReceived = 0

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.beatId = params['beat_id']
      this.fetchSales()
    })
    this.fetchCustomers()
  }

  ngAfterViewInit(){
    this.salesSource.sort = this.sort
    this.salesSource.paginator = this.paginator;
  }

  fetchCustomers(){
    let httpParams = new HttpParams()
      httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
      this.customerService.getCustomer(httpParams).subscribe(
        (data: any) => {
          this.customerList = data['customers']
          this.visibleCustomerList = this.customerList
        },
        (error: any) => console.log(error)
      )
  }

  fetchSales() {
    let body: any = {
      beat_id: this.beatId,
      offset: this.pageIndex * this.pageSize,
      count: this.pageIndex * this.pageSize + this.pageSize
    }
    if(this.selectedDate) body['date'] = this.dateUtils.getStandardizedDateFormate(new Date(this.selectedDate))
    this.taskService.getSales(body).subscribe(
      (data: any) => {
        this.salesSource.data = data['sale_invoices']
        this.totalAmount = data['total_amount']
        this.discount = data['total_discount']
        this.totalAmountReceived = data['total_amount_received']
        this.length = data['total_count']
      },
      (error: any) => console.log(error)
    )
  }

  openMoreInfoWindow(row: sale){
    this.matdialog.open(SalesMoreInfoComponent, { data: row} )
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchSales();
  } 

  onKey(event: Event) { 
    let searchText: string = (event.target as HTMLInputElement).value
    this.visibleCustomerList = this.search(searchText);
  }

  search(value: any) { 
    let filter = value.toLowerCase();
    return this.customerList.filter((customer: customer) => customer.customer_name?.toLowerCase().startsWith(filter));
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
