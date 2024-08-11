import { Component } from '@angular/core';
import { CustomersService } from '../../../shared/services/customer/customers.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../shared/site-variables';
import {
  addCustomer,
  deleteCustomer,
} from '../../../shared/custom_dtypes/customers';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerComponent } from '../dialog-box/add-customer/add-customer.component';
import { SuccessMsgComponent } from '../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../shared/dialog-box/error-msg/error-msg.component';
import { EditCustomerProspectComponent } from '../dialog-box/edit-customer-prospect/edit-customer-prospect.component';
import { ConfirmationBoxComponent } from '../../shared/dialog-box/confirmation-box/confirmation-box.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  constructor(
    private customerService: CustomersService,
    private sessionWrapper: sessionWrapper,
    private matDialog: MatDialog
  ) {}

  public customerDataSource = [];
  public customerTableColumns = [
    'sl_no',
    'outlet_name',
    'type_name',
    'contact_persons_details',
    'address',
    'gst_no',
    'note',
    'edit',
    'delete',
  ];

  ngOnInit() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      String(this.sessionWrapper.getItem('organization_id'))
    );
    this.customerService.getCustomer(httpParams).subscribe((data: any) => {
      this.customerDataSource = data['customers'];
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
    this.matDialog.open(EditCustomerProspectComponent, {
      data: { type: 1, customer: customer },
    });
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
}
