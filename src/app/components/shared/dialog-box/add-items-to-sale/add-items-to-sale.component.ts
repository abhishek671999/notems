import { Component, Inject } from '@angular/core';
import { item } from '../../../../shared/custom_dtypes/items';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../../shared/site-variables';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { category } from '../../../../shared/custom_dtypes/category';

@Component({
  selector: 'app-add-items-to-sale',
  templateUrl: './add-items-to-sale.component.html',
  styleUrl: './add-items-to-sale.component.css'
})
export class AddItemsToSaleComponent {

  constructor(
    private categoryService: CategoryService,
    private itemsService: ItemsService,
    private sessionWrapper: sessionWrapper,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matdialogRef: MatDialogRef<AddItemsToSaleComponent>
  ) { 
  }

  public categoryList: category[] = []
  public selectedCategory: number = 0

  public itemListsource: item[] = [];
  public itemListColumns = ['sl_no', 'item_name', 'item_price', 'quantity'];

  public allitemsList = []

  ngOnInit() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      Number(this.sessionWrapper.getItem('organization_id'))
    );
    this.itemsService.getItems(httpParams).subscribe(
      (data: any) => {
        this.allitemsList = data['items']
        debugger
          data['items'].forEach((item: any) => {
            this.categoryList.push({ category_id: item.category_id, category_name: item.category_name })
            this.selectedCategory = this.categoryList[0].category_id
            item['items'].forEach((actualItem: item) => {
              let itemFound = this.data.filter((addedItem: item) => addedItem.item_id == actualItem.item_id)
              if (itemFound.length > 0) {
                actualItem['line_item_id'] = itemFound[0].line_item_id
                actualItem['quantity'] = itemFound[0].quantity
              } else {
                actualItem['quantity'] = 0;
              }
          })
          
          });
        this.itemListsource = this.allitemsList.filter((category: any) => category.category_id == this.selectedCategory)[0]['items'];
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


  addItem(item: any) {
    item.quantity += 1;
  }

  subtractItem(item: any) {
    if (item.quantity > 0) {
      item.quantity -= 1;
    }
  }

  returnAddedItems() {
    let addedItems: any[] = []
    this.allitemsList.forEach((category: any) => {
      addedItems.push(...category.items.filter((item: item) => item.quantity? item.quantity > 0: false))
    })
    this.matdialogRef.close(addedItems)
  }

  close() {
    this.matdialogRef.close(this.data.itemList)
  }

  categorySelectionChange() {
    this.itemListsource = this.allitemsList.filter((category: any) => category.category_id == this.selectedCategory)[0]['items'];
  }

}
