import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { assignBeat } from '../../../../shared/custom_dtypes/tasks';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-assign-beat',
  standalone: true,
  imports: [
    MatDialogModule, MatTableModule, MatButtonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatRadioModule, MatSelectModule, MatDatepickerModule, CommonModule,
    MatInputModule
  ],
  templateUrl: './assign-beat.component.html',
  styleUrl: './assign-beat.component.css'
})
export class AssignBeatComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskManagementService: TaskManagementService,
    private matdialog: MatDialog,
    private formBuilder: FormBuilder
  ) {

  }
  public selectedDate: string = ''
  public selectedType: number = 1
  public beatsSource: any = []
  public beatsSourceColumns = ['sl_no', 'title', 'reporter', 'assign']
  public availableType = [
    { typeId: 1, typeName: 'Single day' },
    { typeId: 2, typeName: 'Weekly' },
    { typeId: 3, typeName: 'Day wise'}
  ]
  public weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
  public selectedDays = []

  ngOnInit() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('team_id', this.data.team_id)
    httpParams = httpParams.append('assignee_id', this.data.user_id)
    this.taskManagementService.getBeats(httpParams).subscribe(
      (data: any) => this.beatsSource = data['beats'],
      (error: any) => alert('Failed to fetch beats')
    )
  }

  assignBeat(beat: any) {
    let body: assignBeat = {
      beat_id: beat.beat_id,
      assignee_id: this.data.user_id,
      date: this.selectedDate,
      type: this.selectedType,
      days: this.selectedDays
    }
    this.taskManagementService.assignBeat(body).subscribe(
      (data: any) => {
        this.matdialog.open(SuccessMsgComponent, {data: {msg: 'Assigned successfully'}})
      },
      (error: any) => {
        this.matdialog.open(ErrorMsgComponent, {data: {msg: "Failed to assign"}})
      }
    )
  }
}
