import { Component } from '@angular/core';
import { CustomersService } from '../../../shared/services/customer/customers.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../shared/site-variables';
import {
  addCustomer,
  customer,
  deleteCustomer,
} from '../../../shared/custom_dtypes/customers';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerComponent } from '../../manager-view/dialog-box/add-customer/add-customer.component';
import { SuccessMsgComponent } from '../dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../dialog-box/error-msg/error-msg.component';
import { EditCustomerProspectComponent } from '../../manager-view/dialog-box/edit-customer-prospect/edit-customer-prospect.component';
import { ConfirmationBoxComponent } from '../dialog-box/confirmation-box/confirmation-box.component';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { locality } from '../../../shared/custom_dtypes/locality';
import { LocalityService } from '../../../shared/services/locality/locality.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PayLumpsumComponent } from '../bottom-sheet/pay-lumpsum/pay-lumpsum.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  constructor(
    private customerService: CustomersService,
    private localityService: LocalityService,
    private sessionWrapper: sessionWrapper,
    private matDialog: MatDialog,
    private router: Router,
    private matsheet: MatBottomSheet
  ) {
    if(this.sessionWrapper.isOrgManager() || this.sessionWrapper.isTeamManager()) this.customerTableColumns.push('delete');
  }


  length = 50;
  pageSize = 30;
  pageIndex = 0;
  pageSizeOptions = [50, 100, 150];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  availableLocalityList: locality[] = []
  selectedLocality: locality | undefined

  public customerDataSource = [];
  public customerTableColumns = [
    'sl_no',
    'outlet_name',
    'type_name',
    'contact_persons_details',
    'pending_amount',
    'pay_pending_amount',
    'address',
    'locality',
    'gst_no',
    'edit',
  ];


  ngOnInit() {
    this.fetchLocality()
    this.fetchCustomers()
   
  }

  fetchLocality(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', String(this.sessionWrapper.getItem('organization_id')))
    this.localityService.getLocalities(httpParams).subscribe(
      (data: any) => {
        this.availableLocalityList = data['localities']
      },
      (error: any) => {
        alert('Failed to fetch localities')
      }
    )
  }

  fetchCustomers(){
    let httpParams = new HttpParams();
    httpParams = httpParams.append('organization_id', String(this.sessionWrapper.getItem('organization_id')));
    httpParams = httpParams.append('offset',  this.pageIndex * this.pageSize);
    httpParams = httpParams.append('count', this.pageIndex * this.pageSize + this.pageSize);
    if(this.selectedLocality) httpParams = httpParams.append('locality_id', Number(this.selectedLocality))
    this.customerService.getCustomer(httpParams).subscribe((data: any) => {
      this.customerDataSource = data['customers'];
      this.length = data['total_count']
    });
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
}
