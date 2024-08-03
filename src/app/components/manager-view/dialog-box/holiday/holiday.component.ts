import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { addHoliday, deleteHoliday, editHoliday } from '../../../../shared/custom_dtypes/calendar';
import { sessionWrapper } from '../../../../shared/site-variables';
import { CalendarService } from '../../../../shared/services/calendar.service';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { ConfirmationBoxComponent } from '../../../shared/dialog-box/confirmation-box/confirmation-box.component';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.css'
})
export class HolidayComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private calendarService: CalendarService,
    private matdialog: MatDialog,
    private matDialogRef: MatDialogRef<HolidayComponent>
  ) { 
    this.holidayForm = this.formBuilder.group({
      name: [this.data.title || '', [Validators.required]],
    })
  }

  public holidayForm: FormGroup;

  ngOnInit() {

  }

  submit() {
    if (this.data.holiday_id) {
      let body: editHoliday = {
        'name': this.holidayForm.value.name,
        'date': this.data.date,
        'holiday_list_id': this.data.holiday_id
      }
      this.calendarService.editHoliday(body).subscribe(
        (data: any) => {
          this.matdialog.open(SuccessMsgComponent, { data: { msg: 'Successfully updated' } })
          this.matDialogRef.close({result: true})
        },
        (error: any) => this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Error while updating holiday'}})
      )
    } else {
      let body: addHoliday = {
        'name': this.holidayForm.value.name,
        'date': this.data.date,
        'organization_id': Number(this.sessionWrapper.getItem('organization_id'))
      }
      this.calendarService.addHoliday(body).subscribe(
        (data: any) => {
          this.matdialog.open(SuccessMsgComponent, { data: { msg: 'Successfully added' } })
          this.matDialogRef.close({result: true})
        },
        (error: any) => this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Error while adding holiday'}})
      )
    }
  }

  deleteHoliday() {
    let dialogRef = this.matdialog.open(ConfirmationBoxComponent, { data: { msg: 'Are you sure want to delete this holiday?' } })
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data.result) {
          let body: deleteHoliday = {
            holiday_list_id: this.data.holiday_id
          }
          this.calendarService.deleteHoliday(body).subscribe(
            (data: any) => {
              this.matdialog.open(SuccessMsgComponent, { data: { msg: 'Deleted successfully' } })
              this.matDialogRef.close({result: true})
            },
            (error: any) => this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Failed to delete'}})
          )
        }
      }
    )

    
  }
}
