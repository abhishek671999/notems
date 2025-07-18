import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../shared/services/taskmanagement/task-management.service';
import { MatDialog } from '@angular/material/dialog';
import { AddSaleComponent } from '../../shared/dialog-box/add-sale/add-sale.component';
import { ViewMoreSalesInfoComponent } from '../../shared/dialog-box/view-more-sales-info/view-more-sales-info.component';
import { EditSalesInfoComponent } from '../../shared/dialog-box/edit-sales-info/edit-sales-info.component';
import { HttpParams } from '@angular/common/http';
import { beat } from '../../../shared/custom_dtypes/beats';
import { getSales, sale } from '../../../shared/custom_dtypes/sales';
import { dateUtils } from '../../../shared/utils/date_utils';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UpdatePendingAmountComponent } from '../../shared/bottom-sheet/update-pending-amount/update-pending-amount.component';
import { customer } from '../../../shared/custom_dtypes/customers';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { AddCustomerComponent } from '../../shared/dialog-box/add-customer/add-customer.component';
import { SalesMoreInfoComponent } from '../../shared/dialog-box/sales-more-info/sales-more-info.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService,
    private matdialog: MatDialog,
    private matbottomSheet: MatBottomSheet,
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
    
  public beatId: number = 0
  public salesInvoiceDataSource = new MatTableDataSource()
  public salesInvoiceTableColumns: string[] = ['sl_no', 'customer', 'invoice_number', 'total_amount', 'discount', 'received_amount', 'pending_amount', 'recorded_at', 'more', 'edit']

  public selectedTimeFrame = this.timeFrames[0].actualValue
  public selectedCustomer = ''
  public selectedFromDate = ''
  public selectedToDate = ''
  public customerList: customer[] = []
  public visibleCustomerList: customer[] = []
  public selectByModifiedDate = false


  public beatInfo: beat | undefined

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.beatId = Number(params['beat_id']);
      this.fetchSales()
      this.fetchBeatInfo()
    });
  }


  ngAfterViewInit(){
    this.salesInvoiceDataSource.sort = this.sort
    this.salesInvoiceDataSource.paginator = this.paginator;
  }

  fetchSales(){
    let body: getSales = {
      beat_id: this.beatId,
      time_frame: this.selectedTimeFrame,
      get_modified_records: this.selectByModifiedDate
    };
    if(this.selectedCustomer) body['customer_id'] = Number(this.selectedCustomer)
    if (this.selectedTimeFrame == 'custom') {
      if (this.selectedFromDate && this.selectedToDate) {
        body['from_date'] = this.dateUtils.getStandardizedDateFormate(new Date(this.selectedFromDate))
        body['to_date'] =  this.dateUtils.getStandardizedDateFormate(new Date(this.selectedToDate))
      }
      else {
        body = {}
      }
    }
    if (Object.keys(body).length > 0) {
      this.taskService.getSales(body).subscribe(
        (data: any) => {
          this.salesInvoiceDataSource.data = data['sale_invoices']
        },
        (error: any) => {
          console.log(error);
          alert('Error while fetching tasks');
        }
      );
    }

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

  retriveBeatCustomers(customerList: customer[]){
    this.customerList = customerList
    this.visibleCustomerList = this.customerList
  }

  viewMore(element: any) {
    this.matdialog.open(SalesMoreInfoComponent, { data: element })
  }

  editSales(element: sale) {
    let dialogRef = this.matdialog.open(EditSalesInfoComponent, { data: {sale: element, customerList: this.beatInfo?.customers} })
    dialogRef.afterClosed().subscribe(
      (data: any) => this.ngOnInit()
    )
  }

  openEditPendingAmountWindow(row: sale){
    let matdialogRef = this.matbottomSheet.open(UpdatePendingAmountComponent, { data: {sale: row,}} )
    matdialogRef.afterDismissed().subscribe(
      (data: any) => {
        if(data?.result){
          this.ngOnInit()
        }
      }
    )
  }

  onKey(event: Event) { 
    let searchText: string = (event.target as HTMLInputElement).value
    this.visibleCustomerList = this.search(searchText);
  }

  search(value: any) { 
    let filter = value.toLowerCase();
    return this.customerList.filter((customer: customer) => customer.customer_name?.toLowerCase().startsWith(filter));
  }

  addSales() {
    let dialogRef = this.matdialog.open(AddSaleComponent, {data: {beatId: this.beatId, customerList: this.beatInfo?.customers}})
    dialogRef.afterClosed().subscribe(
      (data: any) => this.ngOnInit()
    )
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
  
    addCustomer() {
    let dialogRef = this.matdialog.open(AddCustomerComponent, {
      data: { type: 1 },
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      this.ngOnInit();
    });
  }
}
