import { Component } from '@angular/core';
import { CategoryService } from '../../../shared/services/category/category.service';
import { category, deleteCategory, editCategory } from '../../../shared/custom_dtypes/category';
import { HttpParams } from '@angular/common/http';
import { meAPIUtility } from '../../../shared/site-variables';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../dialog-box/confirmation-box/confirmation-box.component';
import { SuccessMsgComponent } from '../dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../dialog-box/error-msg/error-msg.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddCategoryComponent } from '../bottom-sheet/add-category/add-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  constructor(
    private categoryService: CategoryService,
    private meUtility: meAPIUtility,
    private matdialog: MatDialog,
    private matbottomSheet: MatBottomSheet
  ) { }

  public categoryDataSource: category[] = []
  public categoryDataTableColumns = ['sl_no', 'category_name', 'edit', 'delete']
  public organizationId!: number

  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
      }
    )
  }
  
  fetchCategories(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.organizationId))
    this.categoryService.getCategories(httpParams).subscribe(
      (data: any) => {
        data['categories'].forEach((category: category)=> {
          category.is_edit = false
        });
        this.categoryDataSource = data['categories']
      },
      (error: any) => alert('Failed to fetch categories')
    )
  }

  editElement(category: category){
    category.is_edit = !category.is_edit
  }

  editSubmit(category: category){
    let body: editCategory = {
      category_id: category.category_id,
      category_name: category.category_name
    }
    this.categoryService.editCategories(body).subscribe(
      (data: any) => {
        category.is_edit = false
      },
      (error: any) => {
        alert('Failed to edit category')
      }
    )
  }

  deleteCategory(category: category){
    let dialogRef = this.matdialog.open(ConfirmationBoxComponent, {data: {msg: 'Are you sure want to delete this category??'}})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data.result){
          let body: deleteCategory = {
            category_id: category.category_id
          }
          this.categoryService.deleteCategory(body).subscribe(
            (data: any) => {
              this.matdialog.open(SuccessMsgComponent, {data: {msg: 'Successfully deleted category'}})
              this.ngOnInit()
            },
            (error: any) => {
              this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Failed to delete category'}})
            }
          )
        }
      }
    )
  }

  addCategory(){
    let bottomSheetRef = this.matbottomSheet.open(AddCategoryComponent)
    bottomSheetRef.afterDismissed().subscribe(
      (data: any) => {
        this.ngOnInit()
      }
    )
  }
  
}
