import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { getInventoryStockEndpoint } from '../../../../shared/custom_dtypes/items';
import { meAPIUtility } from '../../../../shared/site-variables';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { dateUtils } from '../../../../shared/utils/date_utils';

@Component({
  selector: 'app-item-historic-stock',
  templateUrl: './item-historic-stock.component.html',
  styleUrl: './item-historic-stock.component.css'
})
export class ItemHistoricStockComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public itemService: ItemsService,
    public meUtility: meAPIUtility,
    private dateUtils: dateUtils
  ) {
    console.log(data)
  }  

  length = 50;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [50, 100, 150];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  private organizationId!: number
  public  selectedDate: Date | null = null;
  public stockHistorySource = new MatTableDataSource()
  public stockHistoryColumns = ['sl_no', 'old_stock', 'new_stock', 'updated_by', 'date']

  ngOnInit(){
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
        this.fetchItemStockLogs()
      }
    )
  }

  fetchItemStockLogs(){
    let body: getInventoryStockEndpoint = {
      offset: this.pageIndex * this.pageSize,
      count: this.pageIndex * this.pageSize + this.pageSize,
      item_id: this.data.item.item_id,
      organization_id: this.organizationId,
      date: this.dateUtils.getStandardizedDateFormate(this.selectedDate)
    }
    if(this.data.team_id) body.team_id = this.data.team_id
    this.itemService.getInventoryStockLog(body).subscribe(
      (data: any) => {
        this.stockHistorySource.data = data['inventory_stock_log']
        this.length = data['no_of_records']
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

    handlePageEvent(e: PageEvent) {
      this.length = e.length;
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
      this.fetchItemStockLogs();
    } 

    clearfilter(){
      this.selectedDate = null
      this.fetchItemStockLogs()
    }
}
