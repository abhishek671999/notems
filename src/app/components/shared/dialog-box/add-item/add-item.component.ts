import { Component } from '@angular/core';
import { addItem } from '../../../../shared/custom_dtypes/items';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sessionWrapper } from '../../../../shared/site-variables';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../dialog-box/error-msg/error-msg.component';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { HttpParams } from '@angular/common/http';
import { category } from '../../../../shared/custom_dtypes/category';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddCategoryComponent } from '../../bottom-sheet/add-category/add-category.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent {

  public newItem: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private itemService: ItemsService,
    private categoryService: CategoryService,
    private matDialog: MatDialog,
    private matBottomSheet: MatBottomSheet,
    private matDialogRef: MatDialogRef<AddItemComponent>
  ) {
    this.newItem = this.formbuilder.group({
      "item_name": ['', [Validators.required]],
      "price": ['', Validators.required],
      "category_id": ['', [Validators.required]]
    })
  }
  
  public availableCategories: category[] = []
  
  ngOnInit() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organziation_id')))
    this.categoryService.getCategories(httpParams).subscribe(
      (data: any) =>  this.availableCategories = data['categories'],
      (error: any) => console.log(error)
   ) 
  }

  addItem() {
    let body: addItem = {
      "item_name": this.newItem.value.item_name,
      "price": this.newItem.value.price,
      "category_id": this.newItem.value.category_id,
      "organization_id": Number(this.sessionWrapper.getItem('organization_id'))
    }
    this.itemService.addItems(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg: 'Item added successfully' } })
        this.matDialogRef.close()
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, { data: {msg: 'Failed to add item'} })
      }
    )
  }

  addNewCategory() {
    let bottomSheetRef = this.matBottomSheet.open(AddCategoryComponent)
    bottomSheetRef.afterDismissed().subscribe(
      (data: any) => {
        console.log(data)
        this.ngOnInit()
      }
    )
  }

}
