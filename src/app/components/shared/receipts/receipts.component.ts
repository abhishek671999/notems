import { HttpParams } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { getSales, sale } from '../../../shared/custom_dtypes/sales';
import { SalesMoreInfoComponent } from '../dialog-box/sales-more-info/sales-more-info.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { customer } from '../../../shared/custom_dtypes/customers';
import { teamMember } from '../../../shared/custom_dtypes/team';
import { TaskManagementService } from '../../../shared/services/taskmanagement/task-management.service';
import { TeamManagementService } from '../../../shared/services/team-management/team-management.service';
import { meAPIUtility } from '../../../shared/site-variables';
import { CustomersService } from '../../../shared/services/customer/customers.service';
import { MatDialog } from '@angular/material/dialog';
import { EditSalesInfoComponent } from '../dialog-box/edit-sales-info/edit-sales-info.component';
import { UpdatePendingAmountComponent } from '../bottom-sheet/update-pending-amount/update-pending-amount.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LocalityService } from '../../../shared/services/locality/locality.service';
import { locality } from '../../../shared/custom_dtypes/locality';
import {MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AddSaleComponent } from '../dialog-box/add-sale/add-sale.component';
import { dateUtils } from '../../../shared/utils/date_utils';
import { AddLocalityComponent } from '../bottom-sheet/add-locality/add-locality.component';
import { AddCustomerComponent } from '../dialog-box/add-customer/add-customer.component';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.css'
})
export class ReceiptsComponent {
  constructor(
    private taskService: TaskManagementService,
    private teamMembersService: TeamManagementService,
    private localityService: LocalityService,
    private meUtility: meAPIUtility,
    private customerService: CustomersService,
    private matdialog: MatDialog,
    private matbottomSheet: MatBottomSheet,
    private dateUtils: dateUtils
  ) { }

  ngAfterViewInit(){
    this.saleInvoiceDatasource.sort = this.sort
    this.saleInvoiceDatasource.paginator = this.paginator;
  }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);

  isOrgManager: boolean = false

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
  public selectedLocality = ''
  public selectedCustomer = ''
  public selectedFromDate = ''
  public selectedToDate = ''
  public selectedRepresentative = ''
  public selectByModifiedDate = false

  public totalAmount = 0
  public discount = 0
  public totalAmountReceived = 0
  public collectedAmount = 0
  
  public saleInvoiceDatasource = new MatTableDataSource()
  public saleInvoiceTableColumns: string[] = ['sl_no', 'customer', 'invoice_number', 'total_amount', 'discount', 'received_amount', 'pending_amount', 'collected_amount', 'locality', 'recorded_by', 'recorded_at', 'last_modified_at', 'last_modified_by', 'more']
  public teamMembers: teamMember[] = []
  public localities: locality[] = []

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

  public allCustomerList: customer[] = []
  public customerList: customer[] = []
  public visibleCustomerList: customer[] = []
  public organizationId!: number

  
  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        let role = data['role'].toLowerCase()
        if(['manager', 'team member'].includes(role) && data['team_type'] == 'sales'){
          if(!this.saleInvoiceTableColumns.includes('edit_receipt')) this.saleInvoiceTableColumns.push('edit_receipt')
        }else if (role == 'manager' && !data['team_type']){
          this.isOrgManager = true
          if(!this.saleInvoiceTableColumns.includes('edit_sale')) this.saleInvoiceTableColumns.push('edit_sale')
        }
        this.organizationId = data['organization_id']
        this.fetchCustomer()
        this.fetchSalesAnalytics()
        this.fetchTeamMembers()
        this.fetchLocalities()
      }
    )
  }

  fetchTeamMembers(){
    let httpParams = new HttpParams()
    this.teamMembersService.getUsers(httpParams).subscribe(
      (data: any) => {
        this.teamMembers = data['users']
      },
    )
  }

  fetchSalesAnalytics() {
    let body: getSales = {
      time_frame: this.selectedTimeFrame,
    }
    if (this.selectedCustomer) body.customer_id = Number(this.selectedCustomer)
    if (this.selectedCustomerType) body.type = Number(this.selectedCustomerType)
    if (this.selectedRepresentative) body.recorded_by = Number(this.selectedRepresentative)
    if (this.selectedLocality) body.locality_id = Number(this.selectedLocality)
    if (this.selectByModifiedDate) body.get_modified_records = this.selectByModifiedDate
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
          this.saleInvoiceDatasource.data = data['sale_invoices']
          this.length = data['total_count']
          this.totalAmount = data['total_amount']
          this.discount = data['total_discount']
          this.totalAmountReceived = data['total_amount_received']
          this.collectedAmount = data['collected_amount']
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
    if(this.selectedLocality) httpParams = httpParams.append('locality_id', this.selectedLocality)
    if (this.selectedCustomerType) {
      httpParams = httpParams.append('type', this.selectedCustomerType)
    }
    this.customerService.getCustomer(httpParams).subscribe((data: any) => {
      this.customerList = data['customers'];
      this.visibleCustomerList = this.customerList
      if(!this.selectedLocality) this.allCustomerList = this.customerList
    });
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

  openEditSalesWindow(row: sale){
    let matdialog = this.matdialog.open(EditSalesInfoComponent,  {data: {sale: row, customerList: this.allCustomerList, staffList: this.teamMembers}})
    matdialog.afterClosed().subscribe(
      (data: any) => {
        if(data?.result){
          this.ngOnInit()
        }
      }
    )
  }

  openAddSaleWindow(){
    let matdialog = this.matdialog.open(AddSaleComponent, {data: {customerList: this.allCustomerList, staffList: this.teamMembers}})
    matdialog.afterClosed().subscribe(
      (data: any) => {
        if(data?.result){
          this.ngOnInit()
        }
      }
    )
  }

  openReceiptModificationLogs(row: sale){
    this.matdialog.open(SalesMoreInfoComponent, {data: row})
  }

  onKey(event: Event) { 
    let searchText: string = (event.target as HTMLInputElement).value
    this.visibleCustomerList = this.search(searchText);
  }

  search(value: any) { 
    let filter = value.toLowerCase();
    return this.customerList.filter((customer: customer) => customer.customer_name?.toLowerCase().startsWith(filter));
  }

  fetchLocalities(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.organizationId))
    this.localityService.getLocalities(httpParams).subscribe(
      (data: any) => {
        data['localities'].forEach((locality: locality)=> {
          locality.is_edit = false
        });
        this.localities = data['localities']
      }
    )
  }

  clearFilters(){
    this.selectedTimeFrame = this.timeFrames[0].actualValue
    this.selectedCustomerType = ''
    this.selectedLocality = ''
    this.selectedCustomer = ''
    this.selectedFromDate = ''
    this.selectedToDate = ''
    this.selectedRepresentative = ''
    this.selectByModifiedDate = false
    this.fetchSalesAnalytics()
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

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchSalesAnalytics();
  }

    addLocality(){
    let bottomSheetRef = this.matbottomSheet.open(AddLocalityComponent)
    bottomSheetRef.afterDismissed().subscribe(
      (data: any) => {
        this.ngOnInit()
      }
    )
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
