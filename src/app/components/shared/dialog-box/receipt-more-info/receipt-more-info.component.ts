import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-receipt-more-info',
  templateUrl: './receipt-more-info.component.html',
  styleUrl: './receipt-more-info.component.css'
})
export class ReceiptMoreInfoComponent {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskManagement: TaskManagementService
  ){
    console.log(data)
  }

  public receiptMoreInfoDataSource = []
  public receiptMoreInfoDataColumns = ['sl_no', 'old_amount', 'new_amount', 'activity_by', 'activity_time']


  ngOnInit(){
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





}
