import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { lineItems } from '../../../../shared/custom_dtypes/sales';
import { HttpParams } from '@angular/common/http';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { ViewImageComponent } from '../view-image/view-image.component';
import { PrintConnectorService } from '../../../../shared/services/printer/print-connector.service';
import { ReceiptPrintFormatter } from '../../../../shared/utils/receiptPrint';

@Component({
  selector: 'app-sales-more-info',
  templateUrl: './sales-more-info.component.html',
  styleUrl: './sales-more-info.component.css'
})
export class SalesMoreInfoComponent {

  constructor(
    public taskManagement: TaskManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matdialog: MatDialog,
    public printerConn: PrintConnectorService,
    private receiptPrintFormatter: ReceiptPrintFormatter,
  ){
    console.log(data)
    this.lineItemsSource = data.line_items
  }

  public lineItemsSource: lineItems[] = []
  public lineItemColumns: string[] = ['sl_no', 'item_name', 'category_name', 'quantity', 'price', 'unit_price']

  public receiptMoreInfoDataSource = []
  public receiptMoreInfoDataColumns = ['sl_no', 'old_amount', 'new_amount', 'total_amount_received', 'pending_amount', 'activity_by', 'activity_time']

  ngOnInit(){
    this.receiptPrintFormatter.printObj = this.data
    this.fetchReceiptMoreInfo()
  }


  fetchReceiptMoreInfo(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('sale_invoice_id', this.data.invoice_id)
    this.taskManagement.getSaleInvoiceActivity(httpParams).subscribe(
      (data: any) => {
        this.receiptMoreInfoDataSource = data['sale_activity_result']
      }
    )
  }

  openImage(url: string){
    this.matdialog.open(ViewImageComponent, {data: {title: 'Receipt', url: url }})
  }

  printReceipt(){
    let printConnect = this.printerConn.printService.init();
    this.receiptPrintFormatter.getReciptPrintObjects().forEach(
      (content) => printConnect.writeCustomLine(content)
    );
    printConnect.feed(5).cut().flush();
  }

}
