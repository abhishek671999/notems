import { Component } from '@angular/core';
import { addItem } from '../../../../shared/custom_dtypes/items';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sessionWrapper } from '../../../../shared/site-variables';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../dialog-box/error-msg/error-msg.component';

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
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<AddItemComponent>
  ) {
    this.newItem = this.formbuilder.group({
      "item_name": ['', [Validators.required]],
      "price": ['', Validators.required],
    })
   }

  addItem() {
    let body: addItem = {
      "item_name": this.newItem.value.item_name,
      "price": this.newItem.value.price,
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

  close() {
    this.matDialogRef.close()
  }

}
