import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../shared/services/taskmanagement/task-management.service';
import { MatDialog } from '@angular/material/dialog';
import { AddSaleComponent } from '../../shared/dialog-box/add-sale/add-sale.component';
import { ViewMoreSalesInfoComponent } from '../../shared/dialog-box/view-more-sales-info/view-more-sales-info.component';
import { EditSalesInfoComponent } from '../../shared/dialog-box/edit-sales-info/edit-sales-info.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService,
    private matdialog: MatDialog
  ) { }

  public beatId: number = 0
  public salesInvoiceDataSource: [] = []
  public salesInvoiceTableColumns: string[] = ['sl_no', 'customer', 'total_amount', 'discount', 'received_amount', 'more', 'edit']

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.beatId = Number(params['beat_id']);
      let body = {
        beat_id: this.beatId,
      };
      this.taskService.getSales(body).subscribe(
        (data: any) => {
          this.salesInvoiceDataSource = data['sale_invoices']
        },
        (error: any) => {
          console.log(error);
          alert('Error while fetching tasks');
        }
      );
    });
  }


  viewMore(element: any) {
    this.matdialog.open(ViewMoreSalesInfoComponent, { data: element })
  }

  editSales(element: any) {
    let dialogRef = this.matdialog.open(EditSalesInfoComponent, { data: element })
    dialogRef.afterClosed().subscribe(
      (data: any) => this.ngOnInit()
    )
  }

  addSales() {
    let dialogRef = this.matdialog.open(AddSaleComponent, {data: {beatId: this.beatId}})
    dialogRef.afterClosed().subscribe(
      (data: any) => this.ngOnInit()
    )
  }
  
}
