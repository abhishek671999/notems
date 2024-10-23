import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { HttpParams } from '@angular/common/http';
import { ViewImageComponent } from '../view-image/view-image.component';

@Component({
  selector: 'app-reimbursement-more-info',
  templateUrl: './reimbursement-more-info.component.html',
  styleUrl: './reimbursement-more-info.component.css'
})
export class ReimbursementMoreInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private attendenceService: AttendenceService,
    private matdialog: MatDialog
  ){
    console.log(data)
  } 

  public allReimbursementsDatasource: [] = []
  public allReimbursementsDataColumns = ['sl_no', 'date', 'reimbursement_amount', 'reimbursement_reason', 'reimbursement_image_url']

  public kmDrivenDataSource: [] = []
  public kmDrivenDataColumns = ['sl_no', 'date', 'starting_km', 'ending_km', 'total_km']

  ngOnInit(){
    this.fetchReimbursementDetails()
    this.fetchKMDriven()
  }

  fetchReimbursementDetails(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('user_id', this.data.user.user_id)
    httpParams = httpParams.append('time_frame', this.data.timeframe)
    if(this.data.from_date) httpParams =  httpParams.append('from_date', this.data.from_date)
    if(this.data.to_date) httpParams = httpParams.append('to_date', this.data.to_date)
    this.attendenceService.getDetailedReimbursement(httpParams).subscribe(
      (data: any) => {
        this.allReimbursementsDatasource = data['reimbursement_details']
      }
    )
  }

  fetchKMDriven(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('user_id', this.data.user.user_id)
    httpParams = httpParams.append('time_frame', this.data.timeframe)
    if(this.data.from_date) httpParams = httpParams.append('from_date', this.data.from_date)
    if(this.data.to_date) httpParams = httpParams.append('to_date', this.data.to_date)
    this.attendenceService.getKMDrivenDetails(httpParams).subscribe(
      (data: any) => {
        this.kmDrivenDataSource = data['km_driven_result']
      }
    )
  }

  openImageDialog(element: any){
    this.matdialog.open(ViewImageComponent, {data: {url: element.reimbursement_image_url, title: `Date: ${element.date} - Amount: ₹${element.reimbursement_amount}` } })
  }

  openImage(title: string, url: string){
    this.matdialog.open(ViewImageComponent, {data: {title: title, url: url}})
  }
}
