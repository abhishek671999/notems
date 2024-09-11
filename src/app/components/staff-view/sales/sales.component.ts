import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../shared/services/taskmanagement/task-management.service';
import { MatDialog } from '@angular/material/dialog';
import { AddSaleComponent } from '../../shared/dialog-box/add-sale/add-sale.component';
import { ViewMoreSalesInfoComponent } from '../../shared/dialog-box/view-more-sales-info/view-more-sales-info.component';
import { EditSalesInfoComponent } from '../../shared/dialog-box/edit-sales-info/edit-sales-info.component';
import { HttpParams } from '@angular/common/http';
import { beat } from '../../../shared/custom_dtypes/beats';
import { getSales, sale } from '../../../shared/custom_dtypes/sales';
import { dateUtils } from '../../../shared/utils/date_utils';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService,
    private matdialog: MatDialog,
    private dateUtils: dateUtils
  ) { }

  public selectedDate = new Date()
  public beatId: number = 0
  public salesInvoiceDataSource: [] = []
  public salesInvoiceTableColumns: string[] = ['sl_no', 'customer', 'total_amount', 'discount', 'received_amount', 'more', 'edit']

  public beatInfo: beat | undefined

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.beatId = Number(params['beat_id']);
      this.fetchSales()
      this.fetchBeatInfo()
    });
  }

  fetchSales(){
    let body: getSales = {
      beat_id: this.beatId,
    };
    if(this.selectedDate) body['date'] = this.dateUtils.getStandardizedDateFormate(new Date(this.selectedDate))
    this.taskService.getSales(body).subscribe(
      (data: any) => {
        this.salesInvoiceDataSource = data['sale_invoices']
      },
      (error: any) => {
        console.log(error);
        alert('Error while fetching tasks');
      }
    );
  }

  fetchBeatInfo(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('beat_id', this.beatId)
    this.taskService.getDailyBeats(httpParams).subscribe(
      (data: any) => {
        this.beatInfo = data['beats'].length > 0? data['beats'][0] : []
      },
      (error: any) => {
        alert('Failed to fetch beat info')
      }
    )
  }

  viewMore(element: any) {
    this.matdialog.open(ViewMoreSalesInfoComponent, { data: element })
  }

  editSales(element: sale) {
    let dialogRef = this.matdialog.open(EditSalesInfoComponent, { data: {sale: element, customerList: this.beatInfo?.customers} })
    dialogRef.afterClosed().subscribe(
      (data: any) => this.ngOnInit()
    )
  }

  addSales() {
    let dialogRef = this.matdialog.open(AddSaleComponent, {data: {beatId: this.beatId, customerList: this.beatInfo?.customers}})
    dialogRef.afterClosed().subscribe(
      (data: any) => this.ngOnInit()
    )
  }
  
}
