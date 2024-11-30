import { Component, Inject, ViewChild } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { item } from '../../../../shared/custom_dtypes/items';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../success-msg/success-msg.component';
import { catchError, of, switchMap } from 'rxjs';
import { ImagesService } from '../../../../shared/services/images/images.service';
import { AddItemsToSaleComponent } from '../add-items-to-sale/add-items-to-sale.component';
import { addSalesReceievedAmountValidation, salesSellingPriceValidation } from '../../../../shared/custom_validations/sales';
import { teamMember } from '../../../../shared/custom_dtypes/team';
import { ImageCompressorService } from '../../../../shared/services/image-compressor/image-compressor.service';


@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.css',
})
export class AddSaleComponent {
  @ViewChild('addSaleButton') addSaleButton: any;

  constructor(
    private taskService: TaskManagementService,
    private imageService: ImagesService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private imageCompressor: ImageCompressorService,
    private matDialogRef: MatDialogRef<AddSaleComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any

  ) {
    console.log(data)
    this.addSalesForm = this.formBuilder.group({
      customer_id: ['', [Validators.required]],
      invoice_number: ['', [Validators.required]],
      selling_price: ['', [Validators.required]],
      received_amount: ['', [Validators.required]],
      staff_id: [''],
      note: ['', ],
      amount: [0,]
    },{
      validators: [addSalesReceievedAmountValidation(), salesSellingPriceValidation()]
    }
  );
    this.customerList = data.customerList
    this.visibleCustomerList = this.customerList
    this.staffList = data.staffList
    this.visibleStaffList = this.staffList
  }

  public visibleCustomerList: customer[] = []
  public customerList: customer[];

  public staffList: teamMember[] = [];
  public visibleStaffList: teamMember[] = []

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
      if(this.addSalesForm.value.staff_id) body['user_id'] = this.addSalesForm.value.staff_id
      const formData = new FormData();
      this.taskService
        .addSale(body)
        .pipe(
          switchMap((response: any) => {
            console.log('this is response', response);
            if (this.file && response['created']) {
              this.fileName = this.file.name;
              this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
              this.outputBoxVisible = true;              
              formData.append('invoice_id', response['invoice_id']);
              return this.imageCompressor.compressImage(this.file).pipe(
                catchError((error: any) => {
                  return of(null)
                }),
              )
            } else {
              return of(null);
            }
          }),
          switchMap((compressedImage: any) => {
              if (compressedImage) formData.append('file', compressedImage);
              else if(this.file) formData.append('file', this.file)
              return this.imageService.uploadImage(formData);
            },
          )
        )
        .subscribe(
          (data: any) => {
            this.matDialog.open(SuccessMsgComponent, {
              data: { msg: 'Sale added successfully' },
            });
            this.matDialogRef.close({result: true})
          },
          (error: any) => {
            console.log(error)
            if(this.addSaleButton) this.addSaleButton._elementRef.nativeElement.disabled = false
          }
        );

  }


  addItems() {
    let dialogRef = this.matDialog.open(AddItemsToSaleComponent, {data: this.itemsAdded})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data?.length > 0) {
          this.itemsAdded = data
          let totalAmount = Number(this.addSalesForm.value.amount)
          this.itemsAdded.forEach((item: item) => {
            totalAmount += item.price * (item.quantity? item.quantity: 0)
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
}
