import { Component } from '@angular/core';
import { ItemsService } from '../../../shared/services/items/items.service';
import { sessionWrapper } from '../../../shared/site-variables';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addItem, deleteItem, editItem, item } from '../../../shared/custom_dtypes/items';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../dialog-box/error-msg/error-msg.component';
import { ConfirmationBoxComponent } from '../dialog-box/confirmation-box/confirmation-box.component';
import { AddItemComponent } from '../dialog-box/add-item/add-item.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {

  constructor(
    private itemService: ItemsService,
    private sessionWrapper: sessionWrapper,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
  ) {
    this.newItem = this.formBuilder.group({
      "item_name": ['', [Validators.required]],
      "price": ['', Validators.required],
    })
   }

  public newItem: FormGroup;
  public itemSource = []
  public itemsTableColumns = ['sl_no', 'name', 'price', 'edit', 'delete']
  
  ngOnInit() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', String(this.sessionWrapper.getItem('organization_id')))
    this.itemService.getItems(httpParams).subscribe(
      (data: any) => {
        data['items'].forEach((item: item) => {
          item.is_edit = false
        });
        this.itemSource = data['items']
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  addItem() {
    this.matDialog.open(AddItemComponent)
  }

  editItem(item: item) {
    item.is_edit = !item.is_edit
  }

  submitEditItem(item: item) {
    debugger
    let body: editItem = {
      item_id: item.item_id,
      item_name: item.item_name,
      price: item.price
    }
    this.itemService.editItems(body).subscribe(
      (data: any) => {
        item.is_edit = !item.is_edit
      },
      (error: any) => {
        alert('Failed to update item. Please retry')
      }
    )
  }

  deleteItem(item: item) {
    let dialogRef = this.matDialog.open(ConfirmationBoxComponent, {
      data: {
        msg: `Are you sure want to delete ${item.item_name}?`,
        header: 'Delete item'
      }
    })
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.confirm) {
        let body: deleteItem = {
          item_id: item.item_id
        }
        this.itemService.deleteItems(body).subscribe(
          (data: any) => {
            this.matDialog.open(SuccessMsgComponent, {data: {msg: 'Item deleted successfully'}})
          },
          (error: any) => {
            this.matDialog.open(ErrorMsgComponent, {data: {msg: 'Failed to delete item'}})
          }
        )
      }
    })
  }
}
