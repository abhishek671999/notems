import { Component, Inject } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { distributorStock, item, updateTeamItem } from '../../../../shared/custom_dtypes/items';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-distributor-options',
  templateUrl: './distributor-options.component.html',
  styleUrl: './distributor-options.component.css'
})
export class DistributorOptionsComponent {

  constructor(
    private itemService: ItemsService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: item,
    private matsheetRef: MatBottomSheetRef<DistributorOptionsComponent>,
  ){
    this.distributorDataSource.data = data.distributors_stock
  }


  public newStock!: number
  public distributorDataSource = new MatTableDataSource()
  public distributorTableColumns = ['sl_no', 'name', 'stock', 'edit']

  updateTeamItemInventory(distributor: distributorStock){
    let body: updateTeamItem = {
      team_id: distributor.team_id,
      item_id: this.data.item_id,
      new_stock: this.newStock
    }
    this.itemService.updateTeamItemInventory(body).subscribe(
      (data) => {
       distributor.is_edit = false
       distributor.stock = this.newStock
      },
      (error) => {
        console.log(error)
      }
    )
  }
  
  enableEdit(distributor: distributorStock, event: Event) {
    event.stopPropagation()
    this.distributorDataSource.data.forEach((ele: any) => {
      ele.is_edit = false
    })
    this.newStock = distributor.stock
    distributor.is_edit = !distributor.is_edit
  }

  close(){
    this.matsheetRef.dismiss()
  }


}
