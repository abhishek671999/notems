import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { CustomersService } from '../../../shared/services/customer/customers.service';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../shared/services/taskmanagement/task-management.service';
import { sessionWrapper } from '../../../shared/site-variables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from '../../../shared/services/items/items.service';
import { customer } from '../../../shared/custom_dtypes/customers';
import { item } from '../../../shared/custom_dtypes/items';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../shared/dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.css'
})
export class AddSaleComponent {

  constructor(
    private customerService: CustomersService,
    private taskService: TaskManagementService,
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private sessionWrapper: sessionWrapper,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
  ) {
    this.addSalesForm = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      received_amount: ['', [Validators.required]],
      note: ['', [Validators.required]],

    })
   };
  public customerList: customer[] = []
  public beatId: number = 0;
  public location: string = '';
  public itemListsource: item[] = []
  public itemListColumns = ['sl_no', 'item_name', 'item_price', 'quantity']

  public addSalesForm: FormGroup;

  ngOnInit() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
    // httpParams = httpParams.append('type', 2) //hardcode
    this.customerService.getCustomer(httpParams).subscribe(
      (data: any) => {
        this.customerList = data['customers']
      },
      (error: any) => console.log(error)
    )
    {
      let httpParams = new HttpParams()
      httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
      this.itemsService.getItems(httpParams).subscribe(
        (data: any) => {
          data['items'].forEach((item: item) => {
            item['quantity'] = 0
          });
          this.itemListsource = data['items']
        },
        (error: any) => {
          console.log(error)
         }
      )
    }

    this.route.params.subscribe((params: Params) => {
      this.beatId = Number(params['beat_id'])
      let httpParams = new HttpParams()
      httpParams = httpParams.append('beat_id', this.beatId)
      this.taskService.getTasks(httpParams).subscribe(
        (data: any) => {
          console.log('data', data)
        },
        (error: any) => {
          console.log(error)
          alert('Error while fetching tasks')
        }
      )
    })
  }

  
  addSales() {
    let body: any = {
      "customer_id": this.addSalesForm.value.customer_id,
      "discount": this.addSalesForm.value.discount,
      "received_amount": this.addSalesForm.value.received_amount,
      "note": this.addSalesForm.value.note,
      "beat_id": this.beatId,
      "item_details": this.itemListsource.filter((item: any) => item.quantity > 0)
    }
    this.taskService.addSale(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: {msg: 'Sale added successfully'}})
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, { data: {msg: 'Failed to add sale'}})
      }
    )
  }

  areItemsAdded() {
    return this.itemListsource.filter((item: any) => item.quantity > 0).length > 0
  }

  addItem(item: any) {
    item.quantity += 1
  }

  subtractItem(item: any) {
    if (item.quantity > 0) {
      item.quantity -= 0
    }
  }
}
