import { HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { item } from '../../../../shared/custom_dtypes/items';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../success-msg/success-msg.component';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';
import { of, switchMap } from 'rxjs';
import { ImagesService } from '../../../../shared/services/images/images.service';
import { AddItemsToSaleComponent } from '../add-items-to-sale/add-items-to-sale.component';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.css',
})
export class AddSaleComponent {
  constructor(
    private customerService: CustomersService,
    private taskService: TaskManagementService,
    private itemsService: ItemsService,
    private imageService: ImagesService,
    private sessionWrapper: sessionWrapper,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<AddSaleComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any

  ) {
    this.addSalesForm = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      received_amount: ['', [Validators.required]],
      note: ['', [Validators.required]],
    });
    console.log(data)
    this.customerList = data.customerList
  }
  public customerList: customer[];
  public beatId: number = 0;
  public location: string = '';
  public itemsAdded: item[] = []
  public itemListColumns = ['sl_no', 'item_name', 'item_price', 'quantity'];


  public file: File | null = null;
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;

  public addSalesForm: FormGroup;


  ngOnInit() {
  }

  addSales() {
    let body: any = {
      customer_id: this.addSalesForm.value.customer_id,
      discount: this.addSalesForm.value.discount,
      received_amount: this.addSalesForm.value.received_amount,
      note: this.addSalesForm.value.note,
      beat_id: this.data.beatId,
      item_details: this.itemsAdded
    }
    this.taskService
      .addSale(body)
      .pipe(
        switchMap((response: any) => {
          console.log('this is response', response);
          if (this.file && response['created']) {
            this.fileName = this.file.name;
            this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
            this.outputBoxVisible = true;
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('sale_invoice_id', response['sale_invoice_id']);
            return this.imageService.uploadImage(formData);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        (data: any) => {
          this.matDialog.open(SuccessMsgComponent, {
            data: { msg: 'Sale added successfully' },
          });
          this.matDialogRef.close({result: true})
        },
        (error: any) => {
          this.matDialog.open(ErrorMsgComponent, {
            data: { msg: 'Failed to add sale' },
          });
        }
      );
  }


  addItems() {
    let dialogRef = this.matDialog.open(AddItemsToSaleComponent, {data: this.itemsAdded})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data?.length > 0) {
          console.log(data)
          this.itemsAdded = data
        }
      },
    )
  }

  subtractItem(item: any) {
    if (item.quantity > 0) {
      item.quantity -= 0;
    }
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
}
