import { Component } from '@angular/core';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addCategory } from '../../../../shared/custom_dtypes/category';
import { meAPIUtility } from '../../../../shared/site-variables';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
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
    private meUtility: meAPIUtility,
    private matsheetRef: MatBottomSheetRef<AddCategoryComponent>,
    private matdialog: MatDialog
  ) { 
    this.newCategoryForm = this.formbuilder.group({
      'category_name': ['', [Validators.required]]
    })
  }
  public newCategoryForm: FormGroup;
  public organizationId!: number;

  ngOnInit(){
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
      }
    )
  }

  addCateogry() {
    let body: addCategory = {
      category_name: this.newCategoryForm.value.category_name,
      organization_id: Number(this.organizationId)
    }
    this.categoryService.addCategory(body).subscribe(
      (data: any) => this.matsheetRef.dismiss(true),
      (error: any) => this.matdialog.open(ErrorMsgComponent, { data: {msg: 'Failed to add category'}})
    )
  }

}
