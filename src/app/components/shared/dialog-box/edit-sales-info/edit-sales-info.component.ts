import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { ImagesService } from '../../../../shared/services/images/images.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { item } from '../../../../shared/custom_dtypes/items';
import { HttpParams } from '@angular/common/http';
import { AddItemsToSaleComponent } from '../add-items-to-sale/add-items-to-sale.component';
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation-box.component';
import { deleteSaleInvoiceLineItem, updateSalesInvoiceLineItem } from '../../../../shared/custom_dtypes/tasks';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';

@Component({
  selector: 'app-edit-sales-info',
  templateUrl: './edit-sales-info.component.html',
  styleUrl: './edit-sales-info.component.css'
})
export class EditSalesInfoComponent {
  constructor(
    private customerService: CustomersService,
    private taskService: TaskManagementService,
    private itemsService: ItemsService,
    private imageService: ImagesService,
    private sessionWrapper: sessionWrapper,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data)
    this.editSalesForm = this.formBuilder.group({
      customer_id: [data.customer_id, [Validators.required]],
      discount: [data.discount, [Validators.required]],
      received_amount: [data.received_amount, [Validators.required]],
      note: [data.note, [Validators.required]],
    });
    this.itemsAdded = data.line_items
  }
  
  public customerList: customer[] = [];
  public beatId: number = 0;
  public location: string = '';
  public itemListsource: item[] = [];
  public itemListColumns = ['sl_no', 'item_name', 'item_price', 'quantity', 'delete'];

  public itemsAdded: any[];

  public file: File | null = null;
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;

  public editSalesForm: FormGroup;

  ngOnInit() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      Number(this.sessionWrapper.getItem('organization_id'))
    );
    this.customerService.getCustomer(httpParams).subscribe(
      (data: any) => {
        this.customerList = data['customers'];
      },
      (error: any) => console.log(error)
    );
    {
      let httpParams = new HttpParams();
      httpParams = httpParams.append(
        'organization_id',
        Number(this.sessionWrapper.getItem('organization_id'))
      );
      this.itemsService.getItems(httpParams).subscribe(
        (data: any) => {
          data['items'].forEach((item: item) => {
            item['quantity'] = 0;
          });
          this.itemListsource = data['items'];
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  areItemsAdded() {
    return (
      this.itemListsource.filter((item: any) => item.quantity > 0).length > 0
    );
  }


  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];
      this.onFileSelected(event);
    }
  }

  onFileSelected(event: any) {
    this.outputBoxVisible = false;
    this.progress = `0%`;
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';
    this.uploadStatus = undefined;
    this.file = event.dataTransfer?.files[0] || event.target?.files[0];
  }


  editSales() {
    
  }

  editItems() {
    let dialogRef = this.matDialog.open(AddItemsToSaleComponent, {data: this.itemsAdded})
    dialogRef.afterClosed().subscribe(
      (editData: any) => {
        if (editData?.length > 0) {
          let body: updateSalesInvoiceLineItem = {
            sale_invoice_id: Number(this.data.sale_invoice_id),
            item_details: editData
          }
          this.taskService.updateSaleInvoiceLineItem(body).subscribe(
            (data: any) => { this.itemsAdded = editData },
            (error: any) => { this.matDialog.open(ErrorMsgComponent, {data: {msg: 'Failed to add line item'}})}
          )
        }
      },
    )
  }

  deleteLineItem(lineItems: any) {
    let dialogRef = this.matDialog.open(ConfirmationBoxComponent, { data: { msg: 'Are you sure want to delete this item?' } })
    dialogRef.afterClosed().subscribe(
      (result: any) => {
        if (result) {
          let body: deleteSaleInvoiceLineItem = {
            line_item_id: lineItems.line_item_id
          }
          this.taskService.deleteSaleInvoiceLineItem(body).subscribe(
            (data: any) => {
              this.itemsAdded = this.itemsAdded.filter((addedItem: item) => addedItem.line_item_id != lineItems.line_item_id)
            }
          )
        }
      }
    )
  }
}
