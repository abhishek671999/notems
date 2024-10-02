import { Component } from '@angular/core';
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
import { PageEvent } from '@angular/material/paginator';
import { SharedModulesModule } from '../../../shared/shared-modules/shared-modules.module';
import { dateUtils } from '../../../../shared/utils/date_utils';

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

  public beatId: number = 0;
  public salesSource: sale[] = []
  public customerList: customer[] = []
  public selectedCustomer: string = ''
  public selectedDate = new Date()
  public salesSourceColumns = ['sl_no', 'customer', 'invoice_number', 'received_amount', 'discount', 'recorded_by', 'date', 'note', 'more']
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
  }

  fetchCustomers(){
    let httpParams = new HttpParams()
      httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
      this.customerService.getCustomer(httpParams).subscribe(
        (data: any) => {
          this.customerList = data['customers']
          console.log(this.customerList)
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
        this.salesSource = data['sale_invoices']
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

}
