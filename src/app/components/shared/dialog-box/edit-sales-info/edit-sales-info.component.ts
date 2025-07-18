import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { ImagesService } from '../../../../shared/services/images/images.service';
import { meAPIUtility } from '../../../../shared/site-variables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { item } from '../../../../shared/custom_dtypes/items';
import { HttpParams } from '@angular/common/http';
import { AddItemsToSaleComponent } from '../add-items-to-sale/add-items-to-sale.component';
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation-box.component';
import { deleteSaleInvoiceLineItem, editSaleInvoiceHeader, updateSalesInvoiceLineItem } from '../../../../shared/custom_dtypes/tasks';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';
import { addSalesReceievedAmountValidation, salesSellingPriceValidation } from '../../../../shared/custom_validations/sales';
import { sale } from '../../../../shared/custom_dtypes/sales';
import { catchError, of, switchMap } from 'rxjs';
import { SuccessMsgComponent } from '../success-msg/success-msg.component';
import { teamMember } from '../../../../shared/custom_dtypes/team';
import { ViewImageComponent } from '../view-image/view-image.component';
import { ImageCompressorService } from '../../../../shared/services/image-compressor/image-compressor.service';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { category } from '../../../../shared/custom_dtypes/category';

@Component({
  selector: 'app-edit-sales-info',
  templateUrl: './edit-sales-info.component.html',
  styleUrl: './edit-sales-info.component.css'
})
export class EditSalesInfoComponent {

  @ViewChild('editSaleButton') editSaleButton: any;

  constructor(
    private taskService: TaskManagementService,
    private itemsService: ItemsService,
    private imageService: ImagesService,
    private meUtility: meAPIUtility,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private imageCompressor: ImageCompressorService,
    private matDialogRef: MatDialogRef<EditSalesInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data)
    this.saleData = data.sale
    this.customerList = data.customerList
    this.visibleCustomerList = this.customerList

    this.staffList = data.staffList
    this.visibleStaffList = this.staffList

    this.editSalesForm = this.formBuilder.group({
      customer_id: [this.saleData.customer_id, [Validators.required]],
      invoice_number: [this.saleData.invoice_number, [Validators.required]],
      selling_price: [this.saleData.total_amount, [Validators.required]],
      staff_id: [this.saleData.recorded_user_id, [Validators.required]],
      received_amount: [this.saleData.received_amount, [Validators.required]],
      note: [this.saleData.note,],
      amount: [this.saleData.total_amount + this.saleData.discount]
    },{
      validators: [addSalesReceievedAmountValidation(), salesSellingPriceValidation()]
    });
    console.log(this.editSalesForm)
    this.itemsAdded = data.sale.line_items
  }
  
  public saleData: sale;
  public customerList: customer[];
  public visibleCustomerList: customer[];

  public staffList: teamMember[] = [];
  public visibleStaffList: teamMember[] = []

  public beatId: number = 0;
  public location: string = '';
  public itemListColumns = ['sl_no', 'item_name', 'item_price', 'quantity', 'delete'];

  public itemsAdded: item[] = [];

  public file: File | null = null;
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;

  public editSalesForm: FormGroup;
  public organizationId!: number

  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
      }
    )
  }



  getDiscountAmount(){
    return this.editSalesForm.value.selling_price > 0 ? `₹ ${String(this.editSalesForm.value.amount - this.editSalesForm.value.selling_price)} | `: ''
  }

  getDiscountAmountPercentage(){
    if(this.editSalesForm.value.selling_price && this.editSalesForm.value.amount){
      let discountPercentage = (((this.editSalesForm.value.amount - this.editSalesForm.value.selling_price)/ this.editSalesForm.value.amount)) * 100
      return `(${discountPercentage.toFixed(2)} %)`
    } 
    else {
      return ''
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
    this.outputBoxVisible = true;
    this.progress = `0%`;
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';
    this.uploadStatus = undefined;
    this.file = event.dataTransfer?.files[0] || event.target?.files[0];
    if(this.file){
      this.fileName = this.file.name;
      this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
    }
  }


  editSales() {
    if(this.editSaleButton) this.editSaleButton._elementRef.nativeElement.disabled = true
    let body: editSaleInvoiceHeader = {
      recorded_user_id: this.editSalesForm.value.staff_id,
      invoice_id: this.saleData.invoice_id,
      invoice_number: this.editSalesForm.value.invoice_number,
      customer_id: this.editSalesForm.value.customer_id,
      discount: this.editSalesForm.value.amount - this.editSalesForm.value.selling_price,
      received_amount: this.editSalesForm.value.received_amount,
      note: this.editSalesForm.value.note,
      beat_id: this.saleData.beat_id
    }
    const formData = new FormData();
    this.taskService.editSaleInvoiceHeader(body).pipe(
      switchMap((response: any) => {
        if (this.file && response['updated']) {
          this.fileName = this.file.name;
          this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
          this.outputBoxVisible = true;
          return this.imageCompressor.compressImage(this.file).pipe(
            catchError((error: any) => {
              return of({imageCompressError: true})
            }),
          );
        } else if(response['updated']) {
          return of({responseError: false});
        }
        else {
          return of({responseError: true});
        }
      }),
      switchMap((response: any) => {
          if(response?.responseError) return of(false)
          if(this.file){
            if(response?.imageCompressError) formData.append('file', response);
            else if(this.file) formData.append('file', this.file)
            formData.append('invoice_id', String(this.saleData.invoice_id));
            return this.imageService.uploadImage(formData)
          }else{
            return of(true)
          }
          
      }
    )
    ).subscribe(
          (data: any) => {
            this.matDialog.open(SuccessMsgComponent, {
              data: { msg: 'Sale edited successfully' },
            });
            this.matDialogRef.close({result: true})
          },
          (error: any) => {
            this.matDialog.open(ErrorMsgComponent, {
              data: { msg: 'Failed to edited' },
            });
            this.matDialogRef.close({result: false})
            if(this.editSaleButton) this.editSaleButton._elementRef.nativeElement.disabled = false
          }
        );
    // this.taskService.editSaleLineItems(body2)
  }

  editItems() {
    let dialogRef = this.matDialog.open(AddItemsToSaleComponent, {data: this.itemsAdded})
    dialogRef.afterClosed().subscribe(
      (editData: any) => {
        if (editData?.length > 0) {
          let totalAmount = 0
          let body: updateSalesInvoiceLineItem = {
            invoice_id: Number(this.data.sale.invoice_id),
            item_details: editData
          }
          this.taskService.updateSaleInvoiceLineItem(body).subscribe(
            (data: any) => { 
              this.itemsAdded = editData
              this.itemsAdded.forEach((item: item) => {
                totalAmount += item.price * (item.quantity? item.quantity: 0)
              })
              this.editSalesForm.patchValue({
                amount: totalAmount
              })
             },
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

  onKey(event: Event, searchField: string) { 
    let searchText: string = (event.target as HTMLInputElement).value
    if(searchField == 'customer') this.visibleCustomerList = this.searchCustomer(searchText);
    else if(searchField == 'staff') this.visibleStaffList = this.searchStaff(searchText)
  }

  searchCustomer(value: any) { 
    let filter = value.toLowerCase();
    return this.customerList.filter((customer: customer) => customer.customer_name?.toLowerCase().startsWith(filter) || customer.customer_name?.toLowerCase().startsWith(filter));
  }

  searchStaff(value: any) { 
    let filter = value.toLowerCase();
    return this.staffList.filter((staff: teamMember) => staff.user_identity?.toLowerCase().startsWith(filter));
  }

  openImage(title: string, url: string){
    this.matDialog.open(ViewImageComponent, {data: {title: title, url: url}})
  }

    addCustomer() {
    let dialogRef = this.matDialog.open(AddCustomerComponent, {
      data: { type: 1 },
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      this.ngOnInit();
    });
  }
}
