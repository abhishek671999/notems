import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild, viewChild } from '@angular/core';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { item } from '../../../../shared/custom_dtypes/items';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../success-msg/success-msg.component';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';
import { of, switchMap } from 'rxjs';
import { ImagesService } from '../../../../shared/services/images/images.service';
import { AddItemsToSaleComponent } from '../add-items-to-sale/add-items-to-sale.component';
import { addSalesDiscountValidation, addSalesReceievedAmountValidation, salesSellingPriceValidation } from '../../../../shared/custom_validations/sales';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.css',
})
export class AddSaleComponent {
  @ViewChild('addSaleButton') addSaleButton: any;

  constructor(
    private customerService: CustomersService,
    private taskService: TaskManagementService,
    private itemsService: ItemsService,
    private imageService: ImagesService,
    private sessionWrapper: sessionWrapper,
    private matsnackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<AddSaleComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any

  ) {
    this.addSalesForm = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      invoice_number: ['', [Validators.required]],
      selling_price: ['', [Validators.required]],
      received_amount: ['', [Validators.required]],
      note: ['', ],
      amount: [0,]
    },{
      validators: [addSalesReceievedAmountValidation(), salesSellingPriceValidation()]
    }
  );
    this.customerList = data.customerList
    this.visibleCustomerList = this.customerList
  }

  public visibleCustomerList: customer[] = []
  public customerList: customer[];
  public beatId: number = 0;
  public location: string = '';
  public itemsAdded: item[] = []
  public itemListColumns = ['sl_no', 'item_name', 'item_price', 'quantity'];
  
  public files: File[] = []
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

  getDiscountAmount(){
    return this.addSalesForm.value.selling_price > 0 ? `₹ ${String(this.addSalesForm.value.amount - this.addSalesForm.value.selling_price)}  `: ''
  }

  getDiscountAmountPercentage(){
    if(this.addSalesForm.value.selling_price && this.addSalesForm.value.amount){
      let discountPercentage = (((this.addSalesForm.value.amount - this.addSalesForm.value.selling_price)/ this.addSalesForm.value.amount)) * 100
      return `(${discountPercentage.toFixed(2)} % off)`
    } 
    else {
      return ''
    } 
  }

  addSales() {
    if(this.addSaleButton) this.addSaleButton._elementRef.nativeElement.disabled = true
    console.log(event)
      let body: any = {
        customer_id: this.addSalesForm.value.customer_id,
        invoice_number: this.addSalesForm.value.invoice_number,
        discount: this.addSalesForm.value.amount - this.addSalesForm.value.selling_price,
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
              formData.append('invoice_id', response['invoice_id']);
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
            if(this.addSaleButton) this.addSaleButton._elementRef.nativeElement.disabled = false
          }
        );

  }


  addItems() {
    let dialogRef = this.matDialog.open(AddItemsToSaleComponent, {data: this.itemsAdded})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        console.log('data receivd:', data)
        if (data?.length > 0) {
          this.itemsAdded = data
          let totalAmount = 0
          this.itemsAdded.forEach((item: item) => {
            totalAmount = item.price * (item.quantity? item.quantity: 0)
          })
          this.addSalesForm.patchValue({
            amount: totalAmount
          })
        }
        console.log(this.addSalesForm.value.amount, this.addSalesForm.value.discount)
      },
      
    )

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


  onKey(event: Event) { 
    let searchText: string = (event.target as HTMLInputElement).value
    this.visibleCustomerList = this.search(searchText);
  }


  search(value: any) { 
    let filter = value.toLowerCase();
    return this.customerList.filter((customer: customer) => customer.customer_name?.toLowerCase().startsWith(filter));
  }
}
