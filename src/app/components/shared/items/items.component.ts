import { Component } from '@angular/core';
import { ItemsService } from '../../../shared/services/items/items.service';
import { meAPIUtility } from '../../../shared/site-variables';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { deleteItem, editItem, item } from '../../../shared/custom_dtypes/items';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../dialog-box/error-msg/error-msg.component';
import { ConfirmationBoxComponent } from '../dialog-box/confirmation-box/confirmation-box.component';
import { AddItemComponent } from '../dialog-box/add-item/add-item.component';
import { category } from '../../../shared/custom_dtypes/category';
import { CategoryService } from '../../../shared/services/category/category.service';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DistributorOptionsComponent } from '../bottom-sheet/distributor-options/distributor-options.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css',  './../../../app.component.css']
})
export class ItemsComponent {

  constructor(
    private itemService: ItemsService,
    private categoryService: CategoryService,
    private router: Router,
    private meUtility: meAPIUtility,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matbottomSheet: MatBottomSheet
  ) {
    this.newItem = this.formBuilder.group({
      "item_name": ['', [Validators.required]],
      "price": ['', Validators.required],
    })
   }

  public newItem: FormGroup;
  public itemSource: any[] = []
  public categoryList: any[] = []
  public itemsTableColumns = ['sl_no', 'name', 'category', 'price', 'stock', 'edit', 'delete']
  public organizationId!: number
  public userRole!: string
  
  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.userRole = data['role'].toLowerCase() || null
        this.organizationId = data['organization_id']
        this.fetchCategories()
        this.fetchItems()
        this.itemsTableColumns = this.userRole == 'manager' ? ['sl_no', 'name', 'category', 'price', 'stock', 'edit', 'delete'] : ['sl_no', 'name', 'category', 'price', 'stock']
      }
    )
  }

  fetchItems(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', String(this.organizationId))
    this.itemService.getItems(httpParams).subscribe(
      (data: any) => {
        data['items'].forEach((item: item) => {
          item.is_edit = false
        });
        let itemsPresent: any[] = []
        data['items'].forEach((category: category) => {
          category.items?.forEach((item: item) => {
            itemsPresent.push(item)
          }
          )
        })
        this.itemSource = itemsPresent
      },
      (error: any) => {
        console.log(error)
      }
    )
  }
  
  fetchCategories(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', String(this.organizationId))
    this.categoryService.getCategories(httpParams).subscribe(
      (data: any) => this.categoryList = data['categories'],
      (error: any) => alert('Failed to get categories')
    )
  }

  addItem() {
    let dialogRef = this.matDialog.open(AddItemComponent)
    dialogRef.afterClosed().subscribe(
      (data: any) => this.ngOnInit(),
      (error: any) => console.log(error)
      )
    }

  editItem(item: item, event: Event) {
    event.stopPropagation()
    item.is_edit = !item.is_edit
  }

  redirectToCategories() {
    this.router.navigate(['./manager/categories'])
  }

  submitEditItem(item: item) {
      console.log(item)
      let body: editItem = {
        item_id: item.item_id,
        item_name: item.item_name,
        price: item.price,
        category_id: item.category_id,
        stock: item.stock
      }
      console.log(body)
      this.itemService.editItems(body).subscribe(
        (data: any) => {
          item.is_edit = false
          item.category_name = this.categoryList.filter((category: any) => category.category_id == item.category_id)[0]['category_name']
        },
        (error: any) => {
          alert('Failed to update item. Please retry')
        }
      )
    
  }

  deleteItem(item: item, event: Event) {
    event.stopPropagation()
    let dialogRef = this.matDialog.open(ConfirmationBoxComponent, {
      data: {
        msg: `Are you sure want to delete ${item.item_name}?`,
        header: 'Delete item'
      }
    })
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.result) {
        let body: deleteItem = {
          item_id: item.item_id
        }
        this.itemService.deleteItems(body).subscribe(
          (data: any) => {
            this.matDialog.open(SuccessMsgComponent, { data: { msg: 'Item deleted successfully' } })
            this.ngOnInit()
          },
          (error: any) => {
            this.matDialog.open(ErrorMsgComponent, {data: {msg: 'Failed to delete item'}})
          }
        )
      }
    })
  }

  openDistributorOptions(item: item){
    let bottomSheetRef = this.matbottomSheet.open(DistributorOptionsComponent, {data: item})
    bottomSheetRef.afterDismissed().subscribe(
      (data) => {
        this.ngOnInit()
      }
    )
  }
}
