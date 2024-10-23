import { Component } from '@angular/core';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { meAPIUtility } from '../../../../shared/site-variables';
import { MatDialog } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { AddCustomerComponent } from '../../dialog-box/add-customer/add-customer.component';
import { EditCustomerProspectComponent } from '../../dialog-box/edit-customer-prospect/edit-customer-prospect.component';
import { deleteCustomer } from '../../../../shared/custom_dtypes/customers';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-prospects',
  templateUrl: './prospects.component.html',
  styleUrl: './prospects.component.css'
})
export class ProspectsComponent {
  constructor(
    private customerService: CustomersService,
    private matDialog: MatDialog,
    private meUtility: meAPIUtility
  ) {}

  public customerDataSource = [];
  public customerTableColumns = [
    'customer_name',
    'contact_person',
    'mobile',
    'note',
    'edit',
    'delete',
  ];

  private organizationId!: number;

  ngOnInit() {
    this.meUtility.getOrganization().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
        this.fetchCustomer()
      }
    )
  }

  fetchCustomer(){
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      String(this.organizationId)
    );
    httpParams = httpParams.append('type', 2);
    this.customerService.getCustomer(httpParams).subscribe((data: any) => {
      this.customerDataSource = data['customers'];
    });
  }

  addCustomer() {
    let dialogRef = this.matDialog.open(AddCustomerComponent, {data: {type: 2}});
    dialogRef.afterClosed().subscribe((data: any) => {
      this.ngOnInit();
    });
  }

  editCustomer(customer: any) {
    this.matDialog.open(EditCustomerProspectComponent, {
      data: { type: 2, customer: customer },
    });
  }

  deleteCustomer(customer: any) {
    let body: deleteCustomer  = {
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
          data: { msg: error.error.description },
        });
      }
    );
  }
}
