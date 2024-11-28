import { Component, ViewChild } from '@angular/core';
import { CustomersService } from '../../../shared/services/customer/customers.service';
import { HttpParams } from '@angular/common/http';
import { meAPIUtility } from '../../../shared/site-variables';
import {
  addCustomer,
  customer,
  deleteCustomer,
} from '../../../shared/custom_dtypes/customers';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerComponent } from '../dialog-box/add-customer/add-customer.component';
import { SuccessMsgComponent } from '../dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../dialog-box/error-msg/error-msg.component';
import { EditCustomerProspectComponent } from '../../manager-view/dialog-box/edit-customer-prospect/edit-customer-prospect.component';
import { ConfirmationBoxComponent } from '../dialog-box/confirmation-box/confirmation-box.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { locality } from '../../../shared/custom_dtypes/locality';
import { LocalityService } from '../../../shared/services/locality/locality.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PayLumpsumComponent } from '../bottom-sheet/pay-lumpsum/pay-lumpsum.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  constructor(
    private customerService: CustomersService,
    private localityService: LocalityService,
    private matDialog: MatDialog,
    private router: Router,
    private matsheet: MatBottomSheet,
    private meUtility: meAPIUtility
  ) {
    
  }


  length = 50;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [50, 100, 150];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  availableLocalityList: locality[] = []
  visibleLocalityList: locality[] = []
  selectedLocality: locality | undefined

  public customerDataSource: any;

  public customerTableColumns = [
    'sl_no',
    'locality',
    'customer_name',
    'type_name',
    'contact_persons_details',
    'pending_amount',
    'address',
    'gst_no',
    'edit',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  public organizationId!: number

  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
        let role = data['role'].toLowerCase()
        if(role == 'manager' && !this.customerTableColumns.includes('delete')) this.customerTableColumns.push('delete');
        this.fetchLocality()
        this.fetchCustomers()
      }
    )
  }


  fetchLocality(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', String(this.organizationId))
    this.localityService.getLocalities(httpParams).subscribe(
      (data: any) => {
        this.availableLocalityList = data['localities']
        this.visibleLocalityList = this.availableLocalityList
      },
      (error: any) => {
        alert('Failed to fetch localities')
      }
    )
  }

  fetchCustomers(){
    let httpParams = new HttpParams();
    httpParams = httpParams.append('organization_id', String(this.organizationId));
    if(this.selectedLocality) httpParams = httpParams.append('locality_id', Number(this.selectedLocality))
    this.customerService.getCustomer(httpParams).subscribe((data: any) => {
      this.customerDataSource = new MatTableDataSource<customer>(data['customers']);
      this.customerDataSource.paginator = this.paginator;
      this.length = data['total_count']
    });
  }

  filterCustomer(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.customerDataSource.filter = filterValue.trim().toLowerCase();
  }

  addCustomer() {
    let dialogRef = this.matDialog.open(AddCustomerComponent, {
      data: { type: 1 },
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      this.ngOnInit();
    });
  }

  editCustomer(customer: any) {
    let dialogRef = this.matDialog.open(EditCustomerProspectComponent, {
      data: { type: 1, customer: customer },
    });
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.result) this.ngOnInit()
        
      }
    )
  }

  deleteCustomer(customer: any) {
    let dialogRef = this.matDialog.open(ConfirmationBoxComponent, { data: { msg: 'Are you sure want to delete this customer?' } })
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data?.result) {
          let body: deleteCustomer = {
            customer_id: customer.customer_id,
          };
          this.customerService.deleteCustomer(body).subscribe(
            (data: any) => {
              this.matDialog.open(SuccessMsgComponent, {
                data: { msg: 'Deleted customer successfully' },
              });
              this.ngOnInit();
            },
            (error: any) => {
              this.matDialog.open(ErrorMsgComponent, {
                data: { msg: error.error.error },
              });
            }
          );
        }
      }
    )
  }

  parseCustomerContact(contact: []) {
    let contactInfoStirng = '';
    contact.forEach(
      (cust: any) =>
        (contactInfoStirng += `${cust.contact_person_name} | ${cust.email_or_phone} <br>`)
    );
    return contactInfoStirng;
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchCustomers();
  } 

  redirectToLocalities() {
    this.router.navigate(['./manager/localities'])
  }

  openPaylumpsumSheet(customer: customer){
    let matsheetRef = this.matsheet.open(PayLumpsumComponent, {data: customer})
    matsheetRef.afterDismissed().subscribe(
      (data: any) => {
        if(data?.result){
          this.ngOnInit()
        }
      }
    )
  }

  onKey(event: Event) { 
    let searchText: string = (event.target as HTMLInputElement).value
    this.visibleLocalityList = this.search(searchText);
  }


  search(value: any) { 
    let filter = value.toLowerCase();
    return this.availableLocalityList.filter((locality: locality) => locality.locality_name?.toLowerCase().startsWith(filter));
  }
}
