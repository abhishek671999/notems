import { Component } from '@angular/core';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addCategory } from '../../../../shared/custom_dtypes/category';
import { sessionWrapper } from '../../../../shared/site-variables';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgComponent } from '../../dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {

  constructor(
    private categoryService: CategoryService,
    private formbuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private matsheetRef: MatBottomSheetRef<AddCategoryComponent>,
    private matdialog: MatDialog
  ) { 
    this.newCategoryForm = this.formbuilder.group({
      'category_name': ['', [Validators.required]]
    })
  }
  public newCategoryForm: FormGroup;

  addCateogry() {
    let body: addCategory = {
      category_name: this.newCategoryForm.value.category_name,
      organization_id: Number(this.sessionWrapper.getItem('organization_id'))
    }
    this.categoryService.addCategory(body).subscribe(
      (data: any) => this.matsheetRef.dismiss(true),
      (error: any) => this.matdialog.open(ErrorMsgComponent, { data: {msg: 'Failed to add category'}})
    )
  }

}
