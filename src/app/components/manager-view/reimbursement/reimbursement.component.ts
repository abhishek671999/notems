import { Component } from '@angular/core';
import { AttendenceService } from '../../../shared/services/attendence/attendence.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../shared/site-variables';
import { dateUtils } from '../../../shared/utils/date_utils';
import { MatDialog } from '@angular/material/dialog';
import { ReimbursementMoreInfoComponent } from '../../shared/dialog-box/reimbursement-more-info/reimbursement-more-info.component';
import { reimbursementDetail } from '../../../shared/custom_dtypes/reimbursement';

@Component({
  selector: 'app-reimbursement',
  templateUrl: './reimbursement.component.html',
  styleUrl: './reimbursement.component.css'
})
export class ReimbursementComponent {

  constructor(
    private attendenceService: AttendenceService,
    private sessionWrapper: sessionWrapper,
    private dateUtils: dateUtils,
    private matdialog: MatDialog
  ){}

  timeFrames = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'Yesterday', actualValue: 'yesterday' },
    { displayValue: 'This week', actualValue: 'this_week' },
    { displayValue: 'This month', actualValue: 'this_month' },
    { displayValue: 'Last month', actualValue: 'last_month' },
    { displayValue: 'Last 3 months', actualValue: 'last_3_months' },
    { displayValue: 'Last 6 months', actualValue: 'last_6_months' },
    { displayValue: 'This year', actualValue: 'this_year' },
    { displayValue: 'Calendar', actualValue: 'custom' }, 
  ];
  
  public selectedTimeFrame = this.timeFrames[0].actualValue
  public reimbusermentDataSource = []
  public reimbursementDataColumn = ['sl_no', 'user', 'total_amount', 'km_driven', 'more']

  public selectedFromDate = ''
  public selectedToDate = ''


  ngOnInit(){
    this.fetchReimbursements()
  }

  fetchReimbursements(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', String(this.sessionWrapper.getItem('organization_id')))
    httpParams = httpParams.append('time_frame', this.selectedTimeFrame)
    if(this.selectedTimeFrame == 'custom'){
      httpParams = httpParams.append('from_date', String(this.dateUtils.getStandardizedDateFormate(new Date(this.selectedFromDate) )))
      httpParams = httpParams.append('to_date', String(this.dateUtils.getStandardizedDateFormate(new Date(this.selectedToDate) )) )
    }
    if(this.selectedTimeFrame != 'custom' || (this.selectedTimeFrame == 'custom' && this.selectedFromDate && this.selectedToDate))
    this.attendenceService.getReimbursements(httpParams).subscribe(
      (data: any) => {
        this.reimbusermentDataSource = data['reimbursement_details']
      }
    )
  }



openReimbursementInfo(reimbursementDetails: reimbursementDetail){
  this.matdialog.open(ReimbursementMoreInfoComponent, {data: {user: reimbursementDetails, timeframe: this.selectedTimeFrame}})
}
  

}
